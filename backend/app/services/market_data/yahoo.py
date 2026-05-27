from typing import Any, List, Optional

import pandas as pd
import yfinance as yf

from app.schemas.market import AssetQuote, MarketTicker, SparklinePoint


def _safe_float(val: Any, default: float = 0.0) -> float:
    try:
        if val is None or (isinstance(val, float) and pd.isna(val)):
            return default
        return float(val)
    except (TypeError, ValueError):
        return default


def fetch_quote(symbol: str) -> Optional[AssetQuote]:
    ticker = yf.Ticker(symbol)
    info = ticker.info or {}
    hist = ticker.history(period="5d")
    if hist.empty and not info.get("regularMarketPrice"):
        return None

    price = _safe_float(
        info.get("regularMarketPrice") or info.get("currentPrice"),
        _safe_float(hist["Close"].iloc[-1]) if not hist.empty else 0,
    )
    prev = _safe_float(info.get("regularMarketPreviousClose"), price)
    change = price - prev if prev else 0
    change_pct = _safe_float(info.get("regularMarketChangePercent"), (change / prev * 100) if prev else 0)

    asset_type = "crypto" if symbol in ("BTC-USD", "ETH-USD") else (
        "index" if symbol.startswith("^") or symbol.endswith(".IS") and "XU" in symbol else "stock"
    )
    if symbol.endswith("=X"):
        asset_type = "fx"
    if "=F" in symbol:
        asset_type = "commodity"

    name = info.get("longName") or info.get("shortName") or symbol
    return AssetQuote(
        symbol=symbol,
        name=name,
        price=round(price, 4),
        change_percent=round(change_pct, 2),
        change=round(change, 4),
        volume=_safe_float(info.get("regularMarketVolume")) or None,
        market_cap=_safe_float(info.get("marketCap")) or None,
        sector=info.get("sector"),
        asset_type=asset_type,
        currency=info.get("currency", "USD"),
        exchange=info.get("exchange"),
        logo_url=info.get("logo_url"),
    )


def fetch_history(symbol: str, period: str = "6mo") -> pd.DataFrame:
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period)
    return df


def fetch_ticker_card(symbol: str, name: str, asset_type: str) -> Optional[MarketTicker]:
    quote = fetch_quote(symbol)
    if not quote:
        return None

    hist = fetch_history(symbol, period="5d")
    sparkline: List[SparklinePoint] = []
    if not hist.empty:
        for idx, row in hist.iterrows():
            ts = int(idx.timestamp()) if hasattr(idx, "timestamp") else 0
            sparkline.append(SparklinePoint(t=ts, v=round(float(row["Close"]), 4)))

    return MarketTicker(
        symbol=symbol,
        name=name,
        price=quote.price,
        change_percent=quote.change_percent,
        change=quote.change,
        asset_type=asset_type,  # type: ignore
        currency=quote.currency,
        sparkline=sparkline[-40:],
    )


# Hero panel symbols
LIVE_MARKET_SYMBOLS = [
    ("BTC-USD", "Bitcoin", "crypto"),
    ("ETH-USD", "Ethereum", "crypto"),
    ("XU100.IS", "BIST 100", "index"),
    ("^IXIC", "NASDAQ", "index"),
    ("^GSPC", "S&P 500", "index"),
    ("GC=F", "Gold", "commodity"),
    ("USDTRY=X", "USD/TRY", "fx"),
]
