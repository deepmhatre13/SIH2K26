import hashlib
import hmac
import secrets
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Boolean, DateTime, Integer, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column

from app.core.database import Base, engine, get_db
from app.schemas.user import LoginRequest, LoginResponse, RegisterRequest

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    active_session_token: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


Base.metadata.create_all(bind=engine)


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
    return LoginResponse(session_token=user.active_session_token, user_id=user.id)


@app.post("/api/auth/register", response_model=LoginResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This user already exists. Please use Login instead.")

    user = User(email=payload.email.lower(), password_hash=hash_password(payload.password))
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