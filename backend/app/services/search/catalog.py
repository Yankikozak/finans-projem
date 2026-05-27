"""Unified search catalog — stocks (BIST + US) and crypto."""

from typing import List, TypedDict


class CatalogEntry(TypedDict):
    symbol: str
    name: str
    asset_type: str
    exchange: str
    aliases: List[str]


SEARCH_CATALOG: List[CatalogEntry] = [
    # Crypto
    {"symbol": "BTC-USD", "name": "Bitcoin", "asset_type": "crypto", "exchange": "global", "aliases": ["btc", "bitcoin"]},
    {"symbol": "ETH-USD", "name": "Ethereum", "asset_type": "crypto", "exchange": "global", "aliases": ["eth", "ethereum", "ether"]},
    {"symbol": "SOL-USD", "name": "Solana", "asset_type": "crypto", "exchange": "global", "aliases": ["sol", "solana"]},
    {"symbol": "BNB-USD", "name": "BNB", "asset_type": "crypto", "exchange": "global", "aliases": ["bnb", "binance"]},
    {"symbol": "XRP-USD", "name": "XRP", "asset_type": "crypto", "exchange": "global", "aliases": ["xrp", "ripple"]},
    # BIST — zengin Türkçe alias
    {
        "symbol": "THYAO.IS",
        "name": "Türk Hava Yolları",
        "asset_type": "stock",
        "exchange": "BIST",
        "aliases": [
            "thyao", "thy", "turkish airlines", "turk hava", "turk hava yollari",
            "türk hava yolları", "türk hava", "turkish", "turkish air",
            "türk", "turk", "hava yolları", "hava yollari",
        ],
    },
    {
        "symbol": "GARAN.IS",
        "name": "Garanti BBVA",
        "asset_type": "stock",
        "exchange": "BIST",
        "aliases": ["garan", "garanti", "garanti bank", "garanti bbva"],
    },
    {
        "symbol": "AKBNK.IS",
        "name": "Akbank",
        "asset_type": "stock",
        "exchange": "BIST",
        "aliases": ["akbnk", "akbank", "ak bank"],
    },
    {
        "symbol": "EREGL.IS",
        "name": "Erdemir",
        "asset_type": "stock",
        "exchange": "BIST",
        "aliases": ["eregl", "erdemir", "eregli"],
    },
    {
        "symbol": "SASA.IS",
        "name": "Sasa Polyester",
        "asset_type": "stock",
        "exchange": "BIST",
        "aliases": ["sasa", "sasa polyester"],
    },
    {
        "symbol": "BIMAS.IS",
        "name": "BIM Birleşik Mağazalar",
        "asset_type": "stock",
        "exchange": "BIST",
        "aliases": ["bimas", "bim"],
    },
    {
        "symbol": "KCHOL.IS",
        "name": "Koç Holding",
        "asset_type": "stock",
        "exchange": "BIST",
        "aliases": ["kchol", "koc", "koç", "koc holding", "koç holding"],
    },
    # US
    {"symbol": "AAPL", "name": "Apple Inc.", "asset_type": "stock", "exchange": "NASDAQ", "aliases": ["aapl", "apple", "elma"]},
    {"symbol": "TSLA", "name": "Tesla Inc.", "asset_type": "stock", "exchange": "NASDAQ", "aliases": ["tsla", "tesla"]},
    {"symbol": "NVDA", "name": "NVIDIA Corporation", "asset_type": "stock", "exchange": "NASDAQ", "aliases": ["nvda", "nvidia", "nvidia corp"]},
    {"symbol": "MSFT", "name": "Microsoft Corporation", "asset_type": "stock", "exchange": "NASDAQ", "aliases": ["msft", "microsoft"]},
    {"symbol": "GOOGL", "name": "Alphabet Inc.", "asset_type": "stock", "exchange": "NASDAQ", "aliases": ["googl", "google", "alphabet"]},
    {"symbol": "AMZN", "name": "Amazon.com Inc.", "asset_type": "stock", "exchange": "NASDAQ", "aliases": ["amzn", "amazon"]},
    {"symbol": "META", "name": "Meta Platforms", "asset_type": "stock", "exchange": "NASDAQ", "aliases": ["meta", "facebook"]},
    # Indices
    {"symbol": "^GSPC", "name": "S&P 500", "asset_type": "index", "exchange": "US", "aliases": ["sp500", "s&p 500", "snp500", "sp"]},
    {"symbol": "^IXIC", "name": "NASDAQ Composite", "asset_type": "index", "exchange": "US", "aliases": ["nasdaq", "ndx"]},
    {"symbol": "XU100.IS", "name": "BIST 100", "asset_type": "index", "exchange": "BIST", "aliases": ["bist100", "bist 100", "xu100"]},
    {"symbol": "GC=F", "name": "Altın", "asset_type": "commodity", "exchange": "COMEX", "aliases": ["altin", "altın", "gold", "xau"]},
    {"symbol": "USDTRY=X", "name": "USD/TRY", "asset_type": "fx", "exchange": "FX", "aliases": ["dolar", "usd try", "usdtry", "dolar tl"]},
]

# Ana sayfa öne çıkan hisseler
FEATURED_STOCKS: List[tuple[str, str, str]] = [
    ("THYAO.IS", "Türk Hava Yolları", "stock"),
    ("GARAN.IS", "Garanti BBVA", "stock"),
    ("AKBNK.IS", "Akbank", "stock"),
    ("EREGL.IS", "Erdemir", "stock"),
    ("AAPL", "Apple", "stock"),
    ("TSLA", "Tesla", "stock"),
    ("NVDA", "NVIDIA", "stock"),
    ("BTC-USD", "Bitcoin", "crypto"),
    ("ETH-USD", "Ethereum", "crypto"),
]
