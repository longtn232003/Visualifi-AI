from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.const import (
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
)

# Create async engine
engine = create_async_engine(
    f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)


# Create async session factory
async_session = sessionmaker(
    class_=AsyncSession, expire_on_commit=False, autocommit=False, autoflush=False
)


# Async database dependency
async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
