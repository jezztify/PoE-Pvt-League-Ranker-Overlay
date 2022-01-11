import json
import uvicorn
from pathlib import Path

from fastapi import FastAPI
from fastapi import Request
from fastapi import HTTPException
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

from account import Account
from charData import CharData

from models.account import AccountModel
from models.errorResponse import ErrorResponseModel

global thisAccount
global thisCharData
thisAccount = None
thisCharData = None

app = FastAPI()

app.mount(
    '/static',
    StaticFiles(directory=str(Path(__file__).parent) + '/html/static'),
    name='static',
)


@app.get('/getrank')
async def get_rank():
    global thisAccount
    global thisCharData
    if not thisAccount:
        error = {'errorMessage': 'Please set Account Details'}
        raise HTTPException(status_code=409, detail=json.loads(ErrorResponseModel(**error).json()))
    charRankData = thisCharData.getCharRankData()
    if type(charRankData) is not dict:
        error = {'errorMessage': charRankData}
        raise HTTPException(status_code=409, detail=json.loads(ErrorResponseModel(**error).json()))
    return charRankData
    
@app.post('/account')
async def set_account(request: AccountModel):
    global thisAccount
    global thisCharData
    thisAccount = Account(
        accountName=request.accountName,
        leagueName=request.leagueName,
        charName=request.charName
    )
    thisCharData = CharData(
        accountName=thisAccount.accountName,
        leagueName=thisAccount.leagueName,
        charName=thisAccount.charName
    )
    return thisAccount

@app.get('/account')
async def set_account(request: Request):
    global thisAccount
    return thisAccount

if __name__ == '__main__':
    uvicorn.run(
        app="__main__:app",
        host="0.0.0.0",
        port=8000,
        # reload=True
    )