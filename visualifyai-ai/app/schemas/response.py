from app.const import StatusResponse

from pydantic import BaseModel
from typing import Union


class ResponseData(BaseModel):
    status: int
    data: Union[dict, list]


def ResponseAPI(status: int, data: Union[dict, list]):
    return {"status_code": status, "data": data}
