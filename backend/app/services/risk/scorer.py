"""Composite risk score from volatility, volume, and technicals."""

from typing import Any, Literal, Optional

import numpy as np
import pandas as pd

from app.schemas.market import RiskScore


def _volatility_score(returns: pd.Series) -> float:
    if len(returns) < 5:
        return 50.0
    vol = returns.std() * np.sqrt(252) * 100
    return float(min(100, max(0, vol * 2)))


def _volume_score(volume: pd.Series) -> float:
    if len(volume) < 10:
        return 50.0
    recent = volume.tail(5).mean()
    prior = volume.tail(30).head(25).mean()
    if prior <= 0:
        return 50.0
    ratio = recent / prior
    # Unusual volume spikes increase risk
    if ratio > 2:
        return 75.0
    if ratio > 1.5:
        return 60.0
    if ratio < 0.5:
        return 55.0
    return 40.0


def _technical_risk(indicators: dict[str, Optional[float]]) -> float:
    score = 50.0
    rsi = indicators.get("rsi")
    if rsi is not None:
        if rsi > 70:
            score += 20
        elif rsi < 30:
            score += 15
        elif 45 <= rsi <= 55:
            score -= 10

    macd_hist = indicators.get("macd_hist")
    if macd_hist is not None:
        score += min(15, abs(macd_hist) * 5)

    price = indicators.get("_last_close")
    bb_upper = indicators.get("bb_upper")
    bb_lower = indicators.get("bb_lower")
    if price and bb_upper and bb_lower:
        if price >= bb_upper:
            score += 10
        elif price <= bb_lower:
            score += 8

    return float(min(100, max(0, score)))


def _trend_strength(close: pd.Series) -> float:
    if len(close) < 20:
        return 50.0
    ema_short = close.ewm(span=10).mean().iloc[-1]
    ema_long = close.ewm(span=30).mean().iloc[-1]
    diff_pct = abs(ema_short - ema_long) / ema_long * 100 if ema_long else 0
    # Strong trend can mean higher risk in overheated moves
    return float(min(100, 40 + diff_pct * 3))


def compute_risk_score(df: pd.DataFrame, indicators: dict[str, Optional[float]]) -> RiskScore:
    close = df["Close"] if "Close" in df.columns else df["close"]
    volume = df["Volume"] if "Volume" in df.columns else df.get("volume", pd.Series([0] * len(df)))

    ind = dict(indicators)
    ind["_last_close"] = float(close.iloc[-1]) if len(close) else None

    returns = close.pct_change().dropna()
    v_score = _volatility_score(returns)
    vol_score = _volume_score(volume) if volume is not None and len(volume) else 50.0
    t_score = _technical_risk(ind)
    tr_score = _trend_strength(close)

    composite = v_score * 0.35 + vol_score * 0.15 + t_score * 0.35 + tr_score * 0.15
    composite = round(min(100, max(0, composite)), 1)

    if composite < 40:
        level: Literal["low", "medium", "high"] = "low"
    elif composite < 65:
        level = "medium"
    else:
        level = "high"

    return RiskScore(
        score=composite,
        level=level,
        factors={
            "volatility": round(v_score, 1),
            "volume_anomaly": round(vol_score, 1),
            "technical": round(t_score, 1),
            "trend": round(tr_score, 1),
        },
    )
