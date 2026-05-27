from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from app.api.router import api_router
from app.core.config import get_settings
from app.core.database import Base, engine
from app.services.blog.seed import seed_blog_posts

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_blog_posts()
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list
    + ["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_origin_regex=r"http://192\.168\.\d+\.\d+(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "nexus-finance-api"}


@app.get("/", response_class=HTMLResponse)
async def root():
    """Kullanıcılar 8000'i site sanmasın — bu API sunucusudur."""
    return """
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Nexus Finance API</title>
  <style>
    body{font-family:system-ui;background:#05060a;color:#e4e4e7;margin:0;padding:2rem;line-height:1.6}
    .box{max-width:520px;margin:4rem auto;padding:2rem;border:1px solid rgba(255,255,255,.1);
      border-radius:16px;background:rgba(255,255,255,.04)}
  h1{color:#00e5a0;font-size:1.5rem}
  a{color:#00e5a0}
  code{background:rgba(0,0,0,.3);padding:.2em .5em;border-radius:6px}
  </style>
</head>
<body>
  <div class="box">
    <h1>Nexus Finance — API</h1>
    <p>Bu adres <strong>web sitesi değil</strong>, arka plandaki veri sunucusudur.</p>
    <p>Gördüğünüz <code>{"status":"ok"}</code> mesajı = sunucu <strong>çalışıyor</strong>.</p>
    <hr style="border-color:rgba(255,255,255,.1)"/>
    <p><strong>Site (arayüz):</strong><br/>
      <a href="http://localhost:3000">http://localhost:3000</a></p>
    <p><strong>API dokümantasyonu:</strong><br/>
      <a href="/api/docs">/api/docs</a></p>
    <p style="font-size:.9rem;color:#71717a">
      3000 = görünen uygulama · 8000 = fiyat, grafik, analiz verileri (JSON)
    </p>
  </div>
</body>
</html>
"""
