from app.schemas.schemas import GenerateInfographicTextRequest
from app.services.generate.preprocessing import PreprocessingService
from app.schemas.response import ResponseAPI
from app.const import (
    StatusResponse,
    OPENAI_API_KEY,
    APPLICATION_PDF,
    ParametersOpenAIGenerateImage,
    APPLICATION_DOCX,
    APPLICATION_TXT,
    OPENAI_MODEL_GENERATE_IMAGE,
)

import base64
from openai import AsyncOpenAI
import requests

class GenerateInfographicService:
    def __init__(self):
        self.preprocessing_service = PreprocessingService()

    async def generate_infographic_form_text(
        self, request: GenerateInfographicTextRequest
    ):
        try:
            # check input is valid
            if await self.preprocessing_service.token_length(request.message) > ParametersOpenAIGenerateImage.MAX_INPUT_LENGTH:
                results = ResponseAPI(
                    StatusResponse.HTTP_BAD_REQUEST, {"message": "Input is too long"}
                )
                return results

            # generate infographic
            if request.size in ParametersOpenAIGenerateImage.SIZE:
                size = ParametersOpenAIGenerateImage.SIZE[request.size]
            else:
                results = ResponseAPI(
                    StatusResponse.HTTP_BAD_REQUEST, {"message": "Invalid size"}
                )
                return results

            # conevert to image
            message = f"Generate an infographic in English for the following text with style: {request.style}: {request.message}"
            image_base64 = await self.generate_infographic(message, size)
            if not image_base64:
                results = ResponseAPI(
                    StatusResponse.HTTP_INTERNAL_SERVER_ERROR,
                    {"message": "Failed to generate infographic"},
                )
                return results

            # return response
            results = ResponseAPI(
                StatusResponse.HTTP_SUCCESS,
                {
                    "message": "Infographic generated successfully",
                    "image_url": image_base64,
                },
            )

        except Exception as e:
            results = ResponseAPI(
                StatusResponse.HTTP_INTERNAL_SERVER_ERROR, {"message": str(e)}
            )

        return results

    async def generate_infographic_from_file(self, file, size, style):
        try:                        
            if file.content_type == APPLICATION_PDF:
                full_text = await self.preprocessing_service.extract_text_from_pdf(file)
            elif file.content_type == APPLICATION_DOCX:
                full_text = await self.preprocessing_service.extract_text_from_docx(file)
            elif file.content_type == APPLICATION_TXT:
                full_text = await self.preprocessing_service.extract_text_from_txt(file)
            else:
                results = ResponseAPI(
                    StatusResponse.HTTP_BAD_REQUEST, {"message": "File is not supported"}
                )
                return results
            
            # get size 
            if size in ParametersOpenAIGenerateImage.SIZE:
                size = ParametersOpenAIGenerateImage.SIZE[size]
            else:
                results = ResponseAPI(
                    StatusResponse.HTTP_BAD_REQUEST, {"message": "Invalid size"}
                )
                return results
            
            # check token length
            token_length = await self.preprocessing_service.token_length(full_text) 
            if token_length > ParametersOpenAIGenerateImage.MAX_INPUT_LENGTH:
                results = ResponseAPI(
                    StatusResponse.HTTP_BAD_REQUEST, {"message": "Input is too long"}
                )
                return results
            
            # generate infographic
            message = f"Generate an infographic in English for the following text with style: {style}: {full_text}"
            image_base64 = await self.generate_infographic(message, size)
            if not image_base64:
                results = ResponseAPI(
                    StatusResponse.HTTP_INTERNAL_SERVER_ERROR, {"message": "Failed to generate infographic"}
                )
                return results

            # return response
            results = ResponseAPI(
                StatusResponse.HTTP_SUCCESS,
                {
                    "message": "Infographic generated successfully",
                    "image_url": image_base64,
                },
            )
        except Exception as e:
            results = ResponseAPI(
                StatusResponse.HTTP_INTERNAL_SERVER_ERROR, {"message": str(e)}
            )

        return results

    async def generate_infographic(self, message: str, size: str):
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        response = await client.images.generate(
            model=OPENAI_MODEL_GENERATE_IMAGE,
            prompt=message,
            n=1,
            size=size,
            quality=ParametersOpenAIGenerateImage.QUALITY,
        )

        # get base64
        image_base64 = response.data[0].b64_json

        # save image to file
        with open("image.png", "wb") as f:
            f.write(base64.b64decode(image_base64))

        return image_base64
    