from sqlalchemy import select

from app.core.database import async_session
from app.models.blog import BlogPost

SEED_POSTS = [
    {
        "slug": "btc-halving-2024-outlook",
        "title": "Bitcoin Halving Sonrası Piyasa Dinamikleri",
        "excerpt": "Halving döngüsünün tarihsel etkileri ve 2024-2025 beklentileri.",
        "content": "## Özet\n\nBitcoin halving, arz şokunun fiyat üzerindeki etkisini tarihsel olarak güçlendirmiştir...\n\n## Teknik Görünüm\n\n200 haftalık hareketli ortalama kritik destek bölgesi olarak izlenmelidir.",
        "category": "crypto",
        "read_time_minutes": 8,
        "featured": True,
    },
    {
        "slug": "fed-faiz-karari-makro",
        "title": "Fed Faiz Kararları ve Gelişen Piyasalar",
        "excerpt": "Faiz indirim beklentilerinin BIST ve TL varlıklarına etkisi.",
        "content": "## Makro Bağlam\n\nFed'in politika yolu, risk iştahını doğrudan şekillendiriyor...",
        "category": "macro",
        "read_time_minutes": 6,
        "featured": True,
    },
    {
        "slug": "portfoy-cesitlendirme-rehberi",
        "title": "Modern Portföy Çeşitlendirme Rehberi",
        "excerpt": "Hisse, tahvil ve kripto arasında dengeli bir portföy nasıl kurulur?",
        "content": "## Temel İlkeler\n\nÇeşitlendirme, volatiliteyi düşürmenin en etkili yollarından biridir...",
        "category": "guide",
        "read_time_minutes": 10,
        "featured": False,
    },
    {
        "slug": "thyao-teknik-analiz",
        "title": "THYAO Teknik Analiz: Momentum ve Risk",
        "excerpt": "Türk Hava Yolları hissesinde RSI, MACD ve trend analizi.",
        "content": "## Teknik Görünüm\n\nTHYAO güçlü momentum sergiliyor ancak yüksek RSI düzeltme riski taşıyor...",
        "category": "stocks",
        "read_time_minutes": 5,
        "featured": False,
    },
]


async def seed_blog_posts() -> None:
    async with async_session() as db:
        for post_data in SEED_POSTS:
            exists = await db.execute(select(BlogPost).where(BlogPost.slug == post_data["slug"]))
            if exists.scalar_one_or_none():
                continue
            db.add(BlogPost(**post_data))
        await db.commit()
