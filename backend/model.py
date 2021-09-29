from pydantic import BaseModel


class Policy(BaseModel):
    searchBy: str
    id: str
    premium: str = None
