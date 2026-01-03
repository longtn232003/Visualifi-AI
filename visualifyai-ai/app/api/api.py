from app.schemas.schemas import ChatRequest, GenerateInfographicTextRequest
from app.services.chat.chat import ChatService
from app.services.generate.generate_infographic import GenerateInfographicService
from app.const import ParametersOpenAIGenerateImage

from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import StreamingResponse


router = APIRouter(prefix="", tags=["Visualify API ⛅🌤️🌤️"])


@router.post("/visualify/user/chat")
async def chat(request: ChatRequest):
    return StreamingResponse(
        ChatService().chat(request),
        media_type="text/event-stream",
        headers={
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )

@router.post("/visualify/user/generate-infographic-text")
async def generate_infographic_text(
    request: GenerateInfographicTextRequest
):
    results = await GenerateInfographicService().generate_infographic_form_text(request)
    return results

@router.post("/visualify/user/generate-infographic-file")
async def generate_infographic_pdf(
    file: UploadFile = File(...),
    size: str = Query(default="1:1"),
    style: str = Query(default="simple"),
):
    results = await GenerateInfographicService().generate_infographic_from_file(file, size, style)
    return results
