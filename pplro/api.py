from fastapi import FastAPI
from fastapi import Request
from fastapi import HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

import json

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
    StaticFiles(directory='pplro/html/static'),
    name='static',
)
templates = Jinja2Templates(directory='pplro/html/templates/')


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

@app.get('/settings')
async def settings(request: Request):
    settings = {
        'accountName': None,
        'leagueName': None,
        'charName': None
    }
    global thisAccount
    if thisAccount:
        settings = {
            'accountName': thisAccount.accountName,
            'leagueName': thisAccount.leagueName,
            'charName': thisAccount.charName
        }
    return templates.TemplateResponse('settings.html', context={'request': request, 'settings': settings})

@app.get('/')
async def get_root(request: Request):
    global thisAccount
    if not thisAccount:
        return RedirectResponse(url='/settings')
    return templates.TemplateResponse('rank.html', context={'request': request})
