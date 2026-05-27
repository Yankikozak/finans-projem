from typing import Any, List

from fastapi import APIRouter, HTTPException, Query

from app.schemas.market import AIAnalysisRequest, AIAnalysisResponse, AssetQuote, MarketTicker, RiskScore, TechnicalIndicators
from app.services.ai.orchestrator import generate_analysis
from app.services.market_data.chart import get_chart_data
from app.services.market_data.fundamentals import build_fundamental_analysis
from app.services.market_data.news import fetch_asset_news
from app.services.market_data.service import get_asset_analysis, get_asset_quote, get_featured_stocks, get_live_markets
from app.services.search.engine import fuzzy_search
from app.services.signals.scorer import compute_trading_signal

router = APIRouter(tags=["markets"])


@router.get("/markets/live", response_model=List[MarketTicker])
async def live_markets():
    return await get_live_markets()


@router.get("/markets/featured", response_model=List[MarketTicker])
async def featured_markets():
    """Ana sayfa hisse/kripto kartları."""
    return await get_featured_stocks()


@router.get("/search")
async def search(q: str = Query(..., min_length=1), limit: int = Query(10, le=20)):
    return fuzzy_search(q, limit=limit)


@router.get("/assets/{symbol}", response_model=AssetQuote)
async def asset_quote(symbol: str, asset_type: str = Query("stock")):
    quote = await get_asset_quote(symbol, asset_type)
    if not quote:
        raise HTTPException(status_code=404, detail="Asset not found")
    return quote


@router.get("/assets/{symbol}/chart")
async def asset_chart(
    symbol: str,
    asset_type: str = Query("stock"),
    range: str = Query("1mo", alias="range"),
):
    return await get_chart_data(symbol, asset_type, range)


@router.get("/assets/{symbol}/news")
async def asset_news(symbol: str, asset_type: str = Query("stock"), limit: int = Query(6, le=12)):
    return fetch_asset_news(symbol, asset_type, limit)


@router.get("/assets/{symbol}/fundamentals")
async def asset_fundamentals(symbol: str, asset_type: str = Query("stock")):
    return build_fundamental_analysis(symbol, asset_type)


@router.get("/assets/{symbol}/detail")
async def asset_detail(symbol: str, asset_type: str = Query("stock")):
    """Tek istekte grafik + analiz + haber."""
    quote = await get_asset_quote(symbol, asset_type)
    if not quote:
        raise HTTPException(status_code=404, detail="Asset not found")

    analysis = await get_asset_analysis(symbol, asset_type)
    chart = await get_chart_data(symbol, asset_type, "1mo")
    fundamentals = build_fundamental_analysis(symbol, asset_type)
    news = fetch_asset_news(symbol, asset_type)
    signal = compute_trading_signal(
        analysis["indicators"],
        analysis["risk"],
        fundamentals,
        quote.change_percent,
    )

    return {
        "quote": quote.model_dump(),
        "chart": chart,
        "indicators": analysis["indicators"],
        "risk": analysis["risk"],
        "fundamentals": fundamentals,
        "news": news,
        "signal": signal,
    }


@router.get("/assets/{symbol}/signal")
async def asset_signal(symbol: str, asset_type: str = Query("stock")):
    quote = await get_asset_quote(symbol, asset_type)
    if not quote:
        raise HTTPException(status_code=404, detail="Asset not found")
    analysis = await get_asset_analysis(symbol, asset_type)
    fundamentals = build_fundamental_analysis(symbol, asset_type)
    return compute_trading_signal(
        analysis["indicators"],
        analysis["risk"],
        fundamentals,
        quote.change_percent,
    )


@router.get("/assets/{symbol}/indicators", response_model=TechnicalIndicators)
async def asset_indicators(symbol: str, asset_type: str = Query("stock")):
    data = await get_asset_analysis(symbol, asset_type)
    return TechnicalIndicators(**data["indicators"])


@router.get("/assets/{symbol}/risk", response_model=RiskScore)
async def asset_risk(symbol: str, asset_type: str = Query("stock")):
    data = await get_asset_analysis(symbol, asset_type)
    return RiskScore(**data["risk"])


@router.post("/ai/analyze", response_model=AIAnalysisResponse)
async def ai_analyze(body: AIAnalysisRequest):
    return await generate_analysis(body.symbol, body.asset_type, body.mode)
