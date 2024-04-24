from pydantic import BaseModel


class UserInput(BaseModel):
    uid: int
    user_input: str

    class Config:
        orm_mode = True


class Response(BaseModel):
    answer: str
