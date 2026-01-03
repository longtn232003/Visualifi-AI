from app.schemas.schemas import ChatRequest
from app.schemas.response import ResponseAPI
from app.const import (
    OPENAI_MODEL_CHAT,
    OPENAI_API_KEY,
    ParametersOpenAIChat,
    StatusResponse,
)

from openai import AsyncOpenAI
import json
import logging

logger = logging.getLogger(__name__)


class ChatService:
    async def chat(self, request: ChatRequest):
        try:
            # check input is valid
            if len(request.message) > ParametersOpenAIChat.MAX_INPUT_LENGTH:
                results = ResponseAPI(
                    StatusResponse.HTTP_BAD_REQUEST, {"message": "Input is too long"}
                )
                yield json.dumps(results)

            client = AsyncOpenAI(api_key=OPENAI_API_KEY)
            response = await client.responses.create(
                model=OPENAI_MODEL_CHAT,
                input=request.message,
                max_output_tokens=ParametersOpenAIChat.MAX_OUTPUT_LENGTH,
                stream=True,
            )
            # return repose stream
            async for chunk in response:
                if hasattr(chunk, "delta"):
                    yield json.dumps({"message": chunk.delta}, ensure_ascii=False)

        except Exception as e:
            results = ResponseAPI(
                StatusResponse.HTTP_INTERNAL_SERVER_ERROR, {"message": str(e)}
            )
            yield json.dumps(results)
