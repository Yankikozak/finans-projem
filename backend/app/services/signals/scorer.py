"""Yatırım sinyali: AL, GÜÇLÜ AL, TUT, SAT, GÜÇLÜ SAT."""

from typing import Any, Literal, Optional

SignalType = Literal["STRONG_BUY", "BUY", "HOLD", "SELL", "STRONG_SELL"]

LABELS_TR = {
    "STRONG_BUY": "GÜÇLÜ AL",
    "BUY": "AL",
    "HOLD": "TUT",
    "SELL": "SAT",
    "STRONG_SELL": "GÜÇLÜ SAT",
}


def compute_trading_signal(
    indicators: dict[str, Optional[float]],
    risk: dict[str, Any],
    fundamentals: dict[str, Any],
    change_percent: float = 0.0,
) -> dict[str, Any]:
    score = 0.0
    reasons: list[str] = []

    rsi = indicators.get("rsi")
    if rsi is not None:
        if rsi < 30:
            score += 2
            reasons.append("RSI aşırı satım bölgesinde — toparlanma potansiyeli")
        elif rsi < 45:
            score += 1
            reasons.append("RSI düşük — hafif alım bölgesi")
        elif rsi > 70:
            score -= 2
            reasons.append("RSI aşırı alım — düzeltme riski")
        elif rsi > 55:
            score -= 0.5
            reasons.append("RSI yüksek bölgede")

    macd_hist = indicators.get("macd_hist")
    if macd_hist is not None:
        if macd_hist > 0:
            score += 1
            reasons.append("MACD histogram pozitif — yükseliş momentumu")
        else:
            score -= 1
            reasons.append("MACD histogram negatif — zayıf momentum")

    if change_percent > 2:
        score += 1
        reasons.append("Güçlü günlük yükseliş")
    elif change_percent < -2:
        score -= 1
        reasons.append("Güçlü günlük düşüş")

    risk_level = risk.get("level", "medium")
    if risk_level == "low":
        score += 0.5
    elif risk_level == "high":
        score -= 1
        reasons.append("Yüksek risk skoru")

    pe = fundamentals.get("metrics", {}).get("pe_ratio")
    if pe and isinstance(pe, (int, float)):
        if pe < 12:
            score += 0.5
            reasons.append("Düşük F/K — değerleme cazip olabilir")
        elif pe > 35:
            score -= 0.5

    if score >= 2.5:
        signal: SignalType = "STRONG_BUY"
    elif score >= 1:
        signal = "BUY"
    elif score <= -2.5:
        signal = "STRONG_SELL"
    elif score <= -1:
        signal = "SELL"
    else:
        signal = "HOLD"
        reasons.append("Karışık sinyaller — bekle-gör stratejisi uygun olabilir")

    confidence = min(95, max(45, int(50 + abs(score) * 15)))

    return {
        "signal": signal,
        "label": LABELS_TR[signal],
        "confidence": confidence,
        "score": round(score, 2),
        "reasons": reasons[:5],
    }
