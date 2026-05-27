"""Technical analysis via pandas-ta."""

from typing import Any, Optional

import numpy as np
import pandas as pd

try:
    import pandas_ta as ta
except ImportError:
    ta = None  # type: ignore


def compute_indicators(df: pd.DataFrame) -> dict[str, Optional[float]]:
    if df.empty or len(df) < 30:
        return {}

    close = df["Close"] if "Close" in df.columns else df["close"]
    high = df["High"] if "High" in df.columns else df.get("high", close)
    low = df["Low"] if "Low" in df.columns else df.get("low", close)

    out: dict[str, Optional[float]] = {}

    if ta is None:
        return _fallback_indicators(close)

    rsi = ta.rsi(close, length=14)
    if rsi is not None and not rsi.empty:
        out["rsi"] = float(rsi.iloc[-1])

    macd_df = ta.macd(close)
    if macd_df is not None and not macd_df.empty:
        cols = macd_df.columns.tolist()
        out["macd"] = float(macd_df[cols[0]].iloc[-1]) if len(cols) > 0 else None
        out["macd_signal"] = float(macd_df[cols[1]].iloc[-1]) if len(cols) > 1 else None
        out["macd_hist"] = float(macd_df[cols[2]].iloc[-1]) if len(cols) > 2 else None

    ema = ta.ema(close, length=20)
    if ema is not None and not ema.empty:
        out["ema_20"] = float(ema.iloc[-1])

    sma = ta.sma(close, length=50)
    if sma is not None and not sma.empty:
        out["sma_50"] = float(sma.iloc[-1])

    bb = ta.bbands(close, length=20)
    if bb is not None and not bb.empty:
        bcols = bb.columns.tolist()
        out["bb_lower"] = float(bb[bcols[0]].iloc[-1]) if len(bcols) > 0 else None
        out["bb_middle"] = float(bb[bcols[1]].iloc[-1]) if len(bcols) > 1 else None
        out["bb_upper"] = float(bb[bcols[2]].iloc[-1]) if len(bcols) > 2 else None

    return out


def _fallback_indicators(close: pd.Series) -> dict[str, Optional[float]]:
    """Simple RSI when pandas-ta unavailable."""
    delta = close.diff()
    gain = delta.where(delta > 0, 0.0).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0.0)).rolling(14).mean()
    rs = gain / loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return {"rsi": float(rsi.iloc[-1]) if not rsi.empty and not np.isnan(rsi.iloc[-1]) else None}


def indicators_to_dict(raw: dict[str, Any]) -> dict[str, Optional[float]]:
    return {k: (float(v) if v is not None and not (isinstance(v, float) and np.isnan(v)) else None) for k, v in raw.items()}


def _series_points(series: pd.Series, max_points: int = 120) -> list[dict[str, float]]:
    if series is None or series.empty:
        return []
    s = series.dropna().tail(max_points)
    out = []
    for idx, val in s.items():
        ts = int(idx.timestamp()) if hasattr(idx, "timestamp") else 0
        out.append({"t": ts, "v": round(float(val), 4)})
    return out


def compute_indicator_series(df: pd.DataFrame) -> dict[str, list[dict[str, float]]]:
    """Grafik altı RSI / MACD serileri."""
    if df.empty or len(df) < 20:
        return {"rsi": [], "macd_hist": [], "ema_20": []}

    close = df["Close"] if "Close" in df.columns else df["close"]
    result: dict[str, list] = {"rsi": [], "macd_hist": [], "ema_20": []}

    if ta is not None:
        rsi = ta.rsi(close, length=14)
        if rsi is not None:
            result["rsi"] = _series_points(rsi)
        macd_df = ta.macd(close)
        if macd_df is not None and not macd_df.empty:
            cols = macd_df.columns.tolist()
            if len(cols) > 2:
                result["macd_hist"] = _series_points(macd_df[cols[2]])
        ema = ta.ema(close, length=20)
        if ema is not None:
            result["ema_20"] = _series_points(ema)
    else:
        delta = close.diff()
        gain = delta.where(delta > 0, 0.0).rolling(14).mean()
        loss = (-delta.where(delta < 0, 0.0)).rolling(14).mean()
        rs = gain / loss.replace(0, np.nan)
        rsi = 100 - (100 / (1 + rs))
        result["rsi"] = _series_points(rsi)

    return result
