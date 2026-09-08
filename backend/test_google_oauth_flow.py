"""Integration test for the Google OAuth flow (POST /api/auth/google).

Runs against a throwaway SQLite database so paimana.db is never touched.
The real google-auth token verification is monkeypatched (no network).

Usage: backend/venv/Scripts/python.exe test_google_oauth_flow.py
"""

import os
import sys

os.environ["DATABASE_URL"] = "sqlite:///./_tmp_oauth_test.db"
os.environ["GOOGLE_CLIENT_ID"] = "test-client-id.apps.googleusercontent.com"

import app.main as m
from app.core.database import SessionLocal
from app.schemas.user import GoogleAuthRequest, RegisterRequest
from sqlalchemy import select

failures: list[str] = []


def make_verify(sub: str, email: str, issuer: str = "https://accounts.google.com"):
    """Simulate google-auth's verify_oauth2_token for a given identity."""

    def verify(token, request, audience):
        assert audience == "test-client-id.apps.googleusercontent.com", audience
        assert token == "valid-credential", token
        return {
            "sub": sub,
            "email": email,
            "email_verified": True,
            "name": "Paimana Officer",
            "picture": "https://lh3.googleusercontent.com/a/test.jpg",
            "iss": issuer,
        }

    return verify


m.google_id_token.verify_oauth2_token = make_verify("sub-google-1", "Officer@GoV.in")

db = SessionLocal()

try:
    # 1. First Google sign-in creates the user and returns a session.
    first = m.google_auth(GoogleAuthRequest(credential="valid-credential"), db)
    assert first.email == "officer@gov.in", first.email
    assert first.session_token, "session token missing"

    # 2. User persisted with the stable Google identity (sub), not just email.
    stored = db.scalar(select(m.User).where(m.User.email == "officer@gov.in"))
    assert stored is not None, "user not persisted"
    assert stored.auth_provider == "google", stored.auth_provider
    assert stored.google_sub == "sub-google-1", stored.google_sub
    assert stored.full_name == "Paimana Officer", stored.full_name
    assert stored.picture_url == "https://lh3.googleusercontent.com/a/test.jpg", stored.picture_url

    # 3. Second sign-in with the SAME Google account reuses the same row.
    second = m.google_auth(GoogleAuthRequest(credential="valid-credential"), db)
    assert second.user_id == first.user_id, "duplicate user created"

    # 4. Latest session token works with /api/auth/me (Bearer auth unchanged).
    me = m.current_user(authorization=f"Bearer {second.session_token}", db=db)
    assert me["email"] == "officer@gov.in", me

    # 5. A password-registered account is LINKED (not duplicated) on Google sign-in.
    m.register(RegisterRequest(email="link.me@example.com", password="Str0ngPass!"), db)
    m.google_id_token.verify_oauth2_token = make_verify("sub-google-2", "Link.Me@example.com")
    linked = m.google_auth(GoogleAuthRequest(credential="valid-credential"), db)
    assert linked.session_token, "linked sign-in returned no session"
    linked_row = db.scalar(select(m.User).where(m.User.email == "link.me@example.com"))
    assert linked_row.google_sub == "sub-google-2", linked_row.google_sub
    assert linked_row.auth_provider == "password", "existing password credential must keep working"
    rows = db.scalars(select(m.User).where(m.User.email == "link.me@example.com")).all()
    assert len(rows) == 1, f"expected 1 linked user, found {len(rows)}"

    # 6. Same email but a DIFFERENT Google account (sub) -> 409, no duplicates.
    m.google_id_token.verify_oauth2_token = make_verify("sub-google-IMPOSTOR", "link.me@example.com")
    try:
        m.google_auth(GoogleAuthRequest(credential="valid-credential"), db)
        failures.append("conflicting google sub was accepted")
    except m.HTTPException as exc:
        assert exc.status_code == 409, exc.status_code

    # 7. Invalid/expired credential -> 401.
    def bad_verify(token, request, audience):
        raise ValueError("Token used too late")

    m.google_id_token.verify_oauth2_token = bad_verify
    try:
        m.google_auth(GoogleAuthRequest(credential="forged"), db)
        failures.append("invalid credential was accepted")
    except m.HTTPException as exc:
        assert exc.status_code == 401, exc.status_code

    # 8. Untrusted issuer -> 401.
    m.google_id_token.verify_oauth2_token = make_verify(
        "sub-google-3", "evil@example.com", issuer="https://evil.example.com"
    )
    try:
        m.google_auth(GoogleAuthRequest(credential="valid-credential"), db)
        failures.append("untrusted issuer was accepted")
    except m.HTTPException as exc:
        assert exc.status_code == 401, exc.status_code

    # 9. Missing GOOGLE_CLIENT_ID -> 503.
    saved = os.environ.pop("GOOGLE_CLIENT_ID")
    m.google_id_token.verify_oauth2_token = make_verify("sub-google-1", "officer@gov.in")
    try:
        m.google_auth(GoogleAuthRequest(credential="valid-credential"), db)
        failures.append("missing client id was accepted")
    except m.HTTPException as exc:
        assert exc.status_code == 503, exc.status_code
    finally:
        os.environ["GOOGLE_CLIENT_ID"] = saved

    for line in [
        "PASS: first-login upsert + session",
        "PASS: google_sub / name / picture persisted",
        "PASS: repeat sign-in reuses account",
        "PASS: /api/auth/me accepts google session",
        "PASS: password account linked (no duplicate)",
        "PASS: conflicting google sub -> 409",
        "PASS: invalid credential -> 401",
        "PASS: untrusted issuer -> 401",
        "PASS: unconfigured server -> 503",
    ]:
        print(line)
    if failures:
        print("FAILURES:", failures)
        sys.exit(1)
    print("ALL GOOGLE OAUTH TESTS PASSED")
finally:
    db.close()