"""FRED macroeconomic data."""

from typing import Any, List, Optional

from app.core.config import get_settings

settings = get_settings()

# FRED series IDs
MACRO_SERIES = {
    "inflation": ("CPIAUCSL", "US CPI (Inflation Proxy)"),
    "interest_rate": ("FEDFUNDS", "Federal Funds Rate"),
    "gdp": ("GDP", "Gross Domestic Product"),
    "unemployment": ("UNRATE", "Unemployment Rate"),
    "dollar_index": ("DTWEXBGS", "Trade Weighted USD Index"),
}


def _fetch_fred_series(series_id: str, limit: int = 24) -> List[dict[str, Any]]:
    if not settings.fred_api_key:
        return _mock_series(series_id, limit)

    try:
        from fredapi import Fred

        fred = Fred(api_key=settings.fred_api_key)
        series = fred.get_series(series_id).dropna().tail(limit)
        return [{"date": str(idx.date()), "value": round(float(val), 4)} for idx, val in series.items()]
    except Exception:
        return _mock_series(series_id, limit)


def _mock_series(series_id: str, limit: int) -> List[dict[str, Any]]:
    """Demo data when FRED key missing."""
    import random
    from datetime import datetime, timedelta

    base = {
        "CPIAUCSL": 310.0,
        "FEDFUNDS": 5.25,
        "GDP": 28000.0,
        "UNRATE": 4.1,
        "DTWEXBGS": 120.0,
    }.get(series_id, 100.0)

    points = []
    for i in range(limit):
        d = datetime.utcnow() - timedelta(days=30 * (limit - i))
        base *= 1 + random.uniform(-0.002, 0.003)
        points.append({"date": d.strftime("%Y-%m"), "value": round(base, 4)})
    return points


def get_macro_dashboard() -> dict[str, Any]:
    result = {}
    for key, (series_id, label) in MACRO_SERIES.items():
        data = _fetch_fred_series(series_id)
        latest = data[-1]["value"] if data else None
        prev = data[-2]["value"] if len(data) > 1 else None
        change = round(((latest - prev) / prev * 100), 2) if latest and prev and prev != 0 else 0
        result[key] = {
            "id": key,
            "series_id": series_id,
            "label": label,
            "latest": latest,
            "change_percent": change,
            "history": data,
        }
    return result
