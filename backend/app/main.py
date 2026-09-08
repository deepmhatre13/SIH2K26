import hashlib
import hmac
import os
import secrets
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from google.auth.transport import requests as google_auth_requests
from google.oauth2 import id_token as google_id_token
from sqlalchemy import Boolean, DateTime, Integer, String, select, text
from sqlalchemy.orm import Mapped, Session, mapped_column

from app.core.database import Base, engine, get_db
from app.schemas.user import GoogleAuthRequest, LoginRequest, LoginResponse, RegisterRequest

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:4173", "http://127.0.0.1:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    auth_provider: Mapped[str] = mapped_column(String(32), nullable=False, default="password", server_default="password")
    # Google identity. `google_sub` (the `sub` claim) is the stable Google account
    # identifier; emails can change, subs cannot. Nullable because password users
    # never have one.
    google_sub: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    picture_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    active_session_token: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


Base.metadata.create_all(bind=engine)


def _ensure_google_auth_columns() -> None:
    """Lightweight migration for pre-existing users tables.

    create_all() only creates missing tables, never missing columns, so databases
    created before Google login need these one-off ALTERs. SQLite cannot add more
    than one column per statement, hence one ALTER per column. Errors are ignored
    when a column already exists or migrations are managed elsewhere.
    """
    statements = [
        "ALTER TABLE users ADD COLUMN auth_provider VARCHAR(32) NOT NULL DEFAULT 'password'",
        "ALTER TABLE users ADD COLUMN google_sub VARCHAR(64)",
        "ALTER TABLE users ADD COLUMN full_name VARCHAR(255)",
        "ALTER TABLE users ADD COLUMN picture_url VARCHAR(512)",
    ]
    for statement in statements:
        try:
            with engine.begin() as connection:
                connection.execute(text(statement))
        except Exception:  # noqa: BLE001 - column already exists / external migration tool
            pass


_ensure_google_auth_columns()


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120_000)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    salt_hex, digest_hex = stored_hash.split("$", 1)
    expected = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), 120_000)
    return hmac.compare_digest(expected.hex(), digest_hex)


@app.get("/")
def root():
    return {
        "message": "FastAPI backend is running"
    }


@app.get("/api/hello")
def hello():
    return {
        "message": "Hello from FastAPI"
    }


def create_session(user: User, db: Session) -> LoginResponse:
    user.active_session_token = secrets.token_urlsafe(32)
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    return LoginResponse(session_token=user.active_session_token, user_id=user.id, email=user.email)


@app.post("/api/auth/register", response_model=LoginResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This user already exists. Please use Login instead.")

    user = User(email=payload.email.lower(), password_hash=hash_password(payload.password), auth_provider="password")
    db.add(user)
    db.flush()
    return create_session(user, db)


@app.post("/api/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="This user is not registered. Please use Sign up first.")
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return create_session(user, db)


def _upsert_google_user(
    db: Session, email: str, google_sub: str, full_name: str | None, picture_url: str | None
) -> User:
    """Find or create the application user for a verified Google identity.

    `google_sub` is the stable key; email is used only to link an existing
    password account (Google has already verified that email), never as the
    primary identity.
    """
    user = db.scalar(select(User).where(User.google_sub == google_sub))
    if user is not None:
        # Profile fields may legitimately change over time; email is unique so
        # only refresh it if Google reports a new (verified) address.
        if user.email != email:
            user.email = email
        user.full_name = full_name
        user.picture_url = picture_url
        return user

    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        # First sign-in: create the account. password_hash stays NOT NULL but is
        # an unusable random value; Google users never authenticate with it.
        user = User(
            email=email,
            password_hash=secrets.token_urlsafe(32),
            auth_provider="google",
            google_sub=google_sub,
            full_name=full_name,
            picture_url=picture_url,
        )
        db.add(user)
        db.flush()
        return user

    # Existing account (e.g. registered with email+password): link it to this
    # Google identity instead of creating a duplicate row.
    if user.google_sub is not None and user.google_sub != google_sub:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email is already linked to a different Google account",
        )
    user.google_sub = google_sub
    user.full_name = full_name
    user.picture_url = picture_url
    if user.auth_provider == "password":
        # Keep "password" so the existing credential continues to work; the
        # account now supports both sign-in methods.
        user.auth_provider = "password"
    return user


@app.post("/api/auth/google", response_model=LoginResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Exchange a Google Identity Services ID token for a PAIMANA session.

    The frontend sends the raw `credential` (JWT) from Google; this endpoint
    verifies signature, audience, expiry and issuer before trusting any claim.
    """
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google sign-in is not configured on this server",
        )

    try:
        identity = google_id_token.verify_oauth2_token(
            payload.credential, google_auth_requests.Request(), client_id
        )
    except ValueError as verification_error:
        message = str(verification_error)
        if "expired" in message.lower() or "too late" in message.lower():
            detail = "Your Google session expired. Please try signing in again."
        else:
            detail = "Invalid Google credential. Please try signing in again."
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail) from None

    # verify_oauth2_token checks audience and expiry; issuer must be checked explicitly.
    if identity.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential. Please try signing in again.",
        )

    google_sub = str(identity.get("sub", ""))
    email = str(identity.get("email", "")).lower()
    if not google_sub or not email or not identity.get("email_verified", False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account email is not verified",
        )

    user = _upsert_google_user(
        db,
        email=email,
        google_sub=google_sub,
        full_name=identity.get("name") or None,
        picture_url=identity.get("picture") or None,
    )
    return create_session(user, db)


@app.post("/api/auth/logout")
def logout(session_token: str, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.active_session_token == session_token))
    if user:
        user.active_session_token = None
        db.commit()
    return {"message": "Signed out"}


@app.get("/api/auth/me")
def current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    session_token = authorization.removeprefix("Bearer ").strip()
    user = db.scalar(select(User).where(User.active_session_token == session_token, User.is_active.is_(True)))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired or invalid")
    return {"user_id": user.id, "email": user.email}