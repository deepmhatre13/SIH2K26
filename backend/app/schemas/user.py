from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    session_token: str
    user_id: int
