"""CoinGecko API — supplemental crypto data."""

from typing import Any, Optional

import httpx

COINGECKO_BASE = "https://api.coingecko.com/api/v3"


async def get_crypto_price(coin_id: str = "bitcoin") -> Optional[dict[str, Any]]:
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            r = await client.get(
                f"{COINGECKO_BASE}/simple/price",
                params={"ids": coin_id, "vs_currencies": "usd", "include_24hr_change": "true"},
            )
            r.raise_for_status()
            return r.json()
        except Exception:
            return None


async def search_coins(query: str) -> list[dict[str, Any]]:
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            r = await client.get(f"{COINGECKO_BASE}/search", params={"query": query})
            r.raise_for_status()
            data = r.json()
            return data.get("coins", [])[:5]
        except Exception:
            return []
