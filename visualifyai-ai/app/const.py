from dotenv import load_dotenv
import os

load_dotenv()

# Database configuration
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_DB = os.getenv("POSTGRES_DB")

# OpenAI configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL_CHAT = "gpt-4o-mini"
OPENAI_MODEL_GENERATE_IMAGE = "gpt-image-1"

# Redis configuration
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")
REDIS_DB = os.getenv("REDIS_DB")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")

# MODEL TOKEN 
MODEL_NAME_TOKENIZER = "Alibaba-NLP/gte-multilingual-base"

# Ratelimit configuration
RATELIMIT_WINDOW = 60
RATELIMIT_LIMIT = 100

ZERO = 0

class ParametersOpenAIChat:
    MAX_INPUT_LENGTH = 500
    MAX_OUTPUT_LENGTH = 16
    TEMPERATURE = 1
    TOP_P = 1
    FREQUENCY_PENALTY = 0
    PRESENCE_PENALTY = 0


class ParametersOpenAIGenerateImage:
    MAX_INPUT_LENGTH = 800
    N = 1
    SIZE = {
        "1:1": "1024x1024",
        "2:3": "1024x1792",
        "3:2": "1536x1024",
    }
    RESPONSE_FORMAT = "b64_json"
    QUALITY = "medium"
    TYPE =  "image_generation"


class StatusResponse:
    HTTP_SUCCESS = 200
    HTTP_BAD_REQUEST = 400
    HTTP_UNAUTHORIZED = 401
    HTTP_FORBIDDEN = 403
    HTTP_NOT_FOUND = 404
    HTTP_INTERNAL_SERVER_ERROR = 500

APPLICATION_PDF = "application/pdf"
APPLICATION_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
APPLICATION_TXT = "text/plain"
