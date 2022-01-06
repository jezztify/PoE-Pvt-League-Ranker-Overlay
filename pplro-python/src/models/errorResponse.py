from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ErrorResponseModel(BaseModel):
    errorMessage: str
    errorCode: Optional[str] = None
    date: Optional[datetime] = datetime.now()