from pydantic import BaseModel, field_validator


class ChatRequest(BaseModel):
    message: str

    @field_validator("message")
    def validate_message(cls, v):
        if not v:
            raise ValueError("Message is required")
        return v


class GenerateInfographicTextRequest(BaseModel):
    message: str
    style: str
    size: str

    @field_validator("message")
    def validate_message(cls, v):
        if not v:
            raise ValueError("Message is required")
        return v
    
    @field_validator("size")
    def validate_size(cls, v):
        if not v:
            raise ValueError("Size is required")
        return v
