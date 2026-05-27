# Nexus Finance

Production-grade AI-powered finance analytics platform — Bloomberg × TradingView × modern fintech startup aesthetic.

## Architecture

```
nexus-finance/
├── backend/                 # FastAPI (Python 3.12)
│   └── app/
│       ├── api/routes/      # REST endpoints
│       ├── core/            # config, DB, cache, security
│       ├── models/          # SQLAlchemy (PostgreSQL)
│       ├── schemas/         # Pydantic DTOs
│       └── services/
│           ├── ai/          # OpenAI + Gemini orchestration
│           ├── market_data/ # Yahoo, CoinGecko, FRED
│           ├── indicators/  # pandas-ta (RSI, MACD, BB…)
│           ├── risk/        # composite risk scorer
│           └── search/      # fuzzy catalog search
├── frontend/                # Next.js 15 + React 19
│   └── src/
│       ├── app/             # App Router pages
│       ├── components/      # UI (glassmorphism, Framer Motion)
│       └── lib/api.ts       # typed API client (credentials: include)
└── docker-compose.yml       # PostgreSQL + Redis + API
```

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js 15, Tailwind, Framer Motion | SSR, premium UI, animations |
| Backend | FastAPI | Async, OpenAPI, modular services |
| DB | PostgreSQL | Users, watchlist, blog |
| Cache | Redis | Market quote TTL caching |
| Auth | JWT + httpOnly cookies + Google OAuth | Secure, no tokens in localStorage |
| Market | yfinance, CoinGecko, FRED | Stocks, crypto, macro |
| TA | pandas-ta | RSI, MACD, EMA, SMA, Bollinger |
| AI | OpenAI (primary), Gemini (fallback) | Keys only on backend |
| Charts | TradingView embed | Professional charting |

## Quick Start

### 1. Environment

```bash
cp .env.example .env
# Edit: DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, FRED_API_KEY, GOOGLE_* 
```

### 2. Infrastructure (Docker)

```bash
docker compose up -d postgres redis
```

### 3. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/api/docs

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

## API Overview

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/markets/live` | Hero market cards |
| `GET /api/v1/search?q=` | Fuzzy autocomplete |
| `GET /api/v1/assets/{symbol}` | Quote + fundamentals |
| `GET /api/v1/assets/{symbol}/risk` | Risk score |
| `POST /api/v1/ai/analyze` | AI commentary (proxied) |
| `GET /api/v1/macro/dashboard` | FRED macro panel |
| `POST /api/v1/auth/register` | JWT cookies |
| `GET /api/v1/auth/google/login` | OAuth |
| `GET /api/v1/watchlist` | User favorites (auth) |

## Security

- All secrets in `.env` on the server only
- `NEXT_PUBLIC_*` exposes only public URLs
- AI keys never sent to the browser
- CORS + `credentials: include` for cookie auth

## Deployment

### Backend (example)

- **Railway / Render / Fly.io**: deploy `backend/` with `DATABASE_URL`, `REDIS_URL`
- Run migrations via startup (`create_all` on boot for MVP; use Alembic in production)

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

Set env: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

### Full stack (Docker)

```bash
docker compose up -d
```

## Model Configuration

In `.env`, map your provider models:

```
OPENAI_MODEL_PRIMARY=gpt-4o        # or gpt-5.2 when available
OPENAI_MODEL_FAST=gpt-4o-mini
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

Claude is wired for future blog-generation; OpenAI + rules engine handle live analysis today.

## License

Proprietary — Nexus Finance © 2026
