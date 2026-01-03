# config for redis

from redis import Redis
from app.const import REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PASSWORD

redis = Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, password=REDIS_PASSWORD)
