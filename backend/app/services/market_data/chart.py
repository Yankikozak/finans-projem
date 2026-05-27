"""Grafik verisi — OHLC serisi."""

from typing import Any, List

import pandas as pd

from app.core.cache import cache_get, cache_set
from app.core.config import get_settings
from app.services.market_data.service import normalize_symbol
from app.services.indicators.technical import compute_indicator_series
from app.services.market_data.yahoo import fetch_history

settings = get_settings()

PERIOD_MAP = {
    "1d": ("1d", "5m"),
    "5d": ("5d", "15m"),
    "1mo": ("1mo", "1h"),
    "3mo": ("3mo", "1d"),
    "6mo": ("6mo", "1d"),
    "1y": ("1y", "1d"),
    "5y": ("5y", "1wk"),
}


async def get_chart_data(symbol: str, asset_type: str = "stock", range_key: str = "1mo") -> dict[str, Any]:
    sym = normalize_symbol(symbol, asset_type)
    cache_key = f"chart:{sym}:{range_key}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    period = range_key if range_key in ("5d", "1mo", "3mo", "6mo", "1y", "5y", "max") else "1mo"
    df = fetch_history(sym, period=period if period != "max" else "max")

    candles: List[dict[str, Any]] = []
    if not df.empty:
        for idx, row in df.iterrows():
            ts = int(idx.timestamp()) if hasattr(idx, "timestamp") else 0
            candles.append(
                {
                    "t": ts,
                    "o": round(float(row["Open"]), 4),
                    "h": round(float(row["High"]), 4),
                    "l": round(float(row["Low"]), 4),
                    "c": round(float(row["Close"]), 4),
                    "v": int(row.get("Volume", 0) or 0),
                }
            )

    indicator_series = compute_indicator_series(df)

    payload = {
        "symbol": sym,
        "range": range_key,
        "candles": candles[-300:],
        "last_price": candles[-1]["c"] if candles else None,
        "indicators": indicator_series,
    }
    await cache_set(cache_key, payload, settings.cache_ttl_market)
    return payload
