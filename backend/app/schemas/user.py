from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str


class GoogleAuthRequest(BaseModel):
    credential: str


class LoginResponse(BaseModel):
    session_token: str
    user_id: int
    email: str | None = None
