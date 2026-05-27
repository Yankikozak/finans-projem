"""Haberler — Yahoo Finance üzerinden."""

from datetime import datetime
from typing import Any, List, Optional

import yfinance as yf

from app.services.market_data.service import normalize_symbol


def fetch_asset_news(symbol: str, asset_type: str = "stock", limit: int = 6) -> List[dict[str, Any]]:
    sym = normalize_symbol(symbol, asset_type)
    try:
        raw = yf.Ticker(sym).news or []
    except Exception:
        raw = []

    items: List[dict[str, Any]] = []
    for item in raw[:limit]:
        # yfinance v0.2+ nested content yapısı
        content = item.get("content") if isinstance(item.get("content"), dict) else item
        title = (
            item.get("title")
            or content.get("title")
            or item.get("headline", "")
        )
        link = (
            item.get("link")
            or content.get("canonicalUrl")
            or content.get("clickThroughUrl")
            or item.get("url", "")
        )
        publisher = (
            item.get("publisher")
            or (content.get("provider") or {}).get("displayName")
            or "Kaynak"
        )
        pub_time = item.get("providerPublishTime") or content.get("pubDate")
        published = None
        if pub_time:
            try:
                if isinstance(pub_time, (int, float)):
                    published = datetime.utcfromtimestamp(pub_time).isoformat()
                else:
                    published = str(pub_time)
            except Exception:
                published = None

        if title:
            items.append(
                {
                    "title": title,
                    "url": link,
                    "publisher": publisher,
                    "published_at": published,
                    "summary": content.get("summary") or content.get("description") or "",
                }
            )

    if not items:
        items = _fallback_news(sym)
    return items


def _fallback_news(symbol: str) -> List[dict[str, Any]]:
    name = symbol.replace(".IS", "")
    return [
        {
            "title": f"{name} — piyasa özeti ve güncel gelişmeler",
            "url": f"https://finance.yahoo.com/quote/{symbol}",
            "publisher": "Yahoo Finance",
            "published_at": datetime.utcnow().isoformat(),
            "summary": "Canlı haber akışı için Yahoo Finance sayfasını ziyaret edebilirsiniz.",
        }
    ]
