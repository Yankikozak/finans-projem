from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Nexus Finance API"
    api_v1_prefix: str = "/api/v1"
    debug: bool = True

    # SQLite varsayılan — Docker/PostgreSQL olmadan yerel geliştirme
    database_url: str = "sqlite+aiosqlite:///./nexus_finance.db"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret: str = "dev-secret-change-in-production-min-32-chars"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    cookie_secure: bool = False
    cookie_domain: str = "localhost"
    cors_origins: str = "http://localhost:3000"

    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:8000/api/v1/auth/google/callback"

    openai_api_key: str = ""
    openai_model_primary: str = "gpt-4o"
    openai_model_fast: str = "gpt-4o-mini"

    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-20250514"

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    fred_api_key: str = ""
    alpha_vantage_api_key: str = ""
    twelve_data_api_key: str = ""

    cache_ttl_market: int = 120
    cache_ttl_search: int = 300
    cache_ttl_macro: int = 3600

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
