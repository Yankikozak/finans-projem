"""Unified market data facade with Redis cache."""

from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Optional

import pandas as pd

from app.core.cache import cache_get, cache_set
from app.core.config import get_settings
from app.schemas.market import AssetQuote, MarketTicker, TechnicalIndicators
from app.services.indicators.technical import compute_indicators
from app.services.search.catalog import FEATURED_STOCKS
from app.services.market_data.yahoo import LIVE_MARKET_SYMBOLS, fetch_history, fetch_quote, fetch_ticker_card
from app.services.risk.scorer import compute_risk_score

settings = get_settings()


def normalize_symbol(symbol: str, asset_type: str = "stock") -> str:
    s = symbol.upper().strip()
    if asset_type == "crypto" and not s.endswith("-USD"):
        if s in ("BTC", "ETH", "SOL", "BNB", "XRP"):
            return f"{s}-USD"
    if asset_type == "stock" and s.isalpha() and len(s) <= 6 and "." not in s:
        # BIST tickers without suffix — heuristic
        bist = {"THYAO", "GARAN", "AKBNK", "EREGL", "SASA", "BIMAS", "KCHOL", "XU100"}
        if s in bist or s.endswith("IS"):
            return s if ".IS" in s else f"{s}.IS"
    return s


async def get_featured_stocks() -> List[MarketTicker]:
    cache_key = "markets:featured"
    cached = await cache_get(cache_key)
    if cached:
        return [MarketTicker(**t) for t in cached]

    tickers = _fetch_cards_parallel(FEATURED_STOCKS)
    await cache_set(cache_key, [t.model_dump() for t in tickers], settings.cache_ttl_market)
    return tickers


def _fetch_cards_parallel(symbols: list) -> List[MarketTicker]:
    tickers: List[MarketTicker] = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {
            pool.submit(fetch_ticker_card, sym, name, atype): sym
            for sym, name, atype in symbols
        }
        for fut in as_completed(futures):
            try:
                card = fut.result()
                if card:
                    tickers.append(card)
            except Exception:
                pass
    return tickers


async def get_live_markets() -> List[MarketTicker]:
    cache_key = "markets:live"
    cached = await cache_get(cache_key)
    if cached:
        return [MarketTicker(**t) for t in cached]

    tickers = _fetch_cards_parallel(LIVE_MARKET_SYMBOLS)
    await cache_set(cache_key, [t.model_dump() for t in tickers], settings.cache_ttl_market)
    return tickers


async def get_asset_quote(symbol: str, asset_type: str = "stock") -> Optional[AssetQuote]:
    sym = normalize_symbol(symbol, asset_type)
    cache_key = f"quote:{sym}"
    cached = await cache_get(cache_key)
    if cached:
        return AssetQuote(**cached)

    quote = fetch_quote(sym)
    if quote:
        await cache_set(cache_key, quote.model_dump(), settings.cache_ttl_market)
    return quote


async def get_asset_analysis(symbol: str, asset_type: str = "stock") -> dict:
    sym = normalize_symbol(symbol, asset_type)
    cache_key = f"analysis:{sym}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    df = fetch_history(sym, period="1y")
    indicators = compute_indicators(df)
    risk = compute_risk_score(df, indicators)

    payload = {
        "symbol": sym,
        "indicators": TechnicalIndicators(**{k: v for k, v in indicators.items() if not k.startswith("_")}).model_dump(),
        "risk": risk.model_dump(),
        "history_points": len(df),
    }
    await cache_set(cache_key, payload, settings.cache_ttl_market * 2)
    return payload
