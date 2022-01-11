from pydantic import BaseModel

class AccountModel(BaseModel):
    accountName: str
    leagueName: str
    charName: str