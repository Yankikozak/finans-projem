from typing import Any, List, Literal, Optional

from pydantic import BaseModel, Field


class SparklinePoint(BaseModel):
    t: int
    v: float


class MarketTicker(BaseModel):
    symbol: str
    name: str
    price: float
    change_percent: float
    change: float
    asset_type: Literal["crypto", "stock", "index", "commodity", "fx"]
    currency: str = "USD"
    sparkline: List[SparklinePoint] = Field(default_factory=list)


class AssetQuote(BaseModel):
    symbol: str
    name: str
    price: float
    change_percent: float
    change: float
    volume: Optional[float] = None
    market_cap: Optional[float] = None
    sector: Optional[str] = None
    asset_type: str
    currency: str = "USD"
    exchange: Optional[str] = None
    logo_url: Optional[str] = None


class TechnicalIndicators(BaseModel):
    rsi: Optional[float] = None
    macd: Optional[float] = None
    macd_signal: Optional[float] = None
    macd_hist: Optional[float] = None
    ema_20: Optional[float] = None
    sma_50: Optional[float] = None
    bb_upper: Optional[float] = None
    bb_middle: Optional[float] = None
    bb_lower: Optional[float] = None


class RiskScore(BaseModel):
    score: float = Field(ge=0, le=100)
    level: Literal["low", "medium", "high"]
    factors: dict[str, Any] = Field(default_factory=dict)


class AIAnalysisRequest(BaseModel):
    symbol: str
    asset_type: Literal["stock", "crypto"] = "stock"
    mode: Literal["full", "quick"] = "full"


class AIAnalysisResponse(BaseModel):
    symbol: str
    summary: str
    trend: str
    risk_comment: str
    technical_summary: str
    model_used: str


class SearchResult(BaseModel):
    symbol: str
    name: str
    asset_type: str
    exchange: Optional[str] = None
    score: float = 1.0
