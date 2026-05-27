/** Tarayıcıda proxy kullan — telefondan erişimde aynı host üzerinden API gider */
function getApiBase(): string {
  if (typeof window !== "undefined") {
    return "/api/proxy";
  }
  const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${base}/api/v1`;
}

export type MarketTicker = {
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
  change: number;
  asset_type: string;
  currency: string;
  sparkline: { t: number; v: number }[];
};

export type SearchResult = {
  symbol: string;
  name: string;
  asset_type: string;
  exchange?: string;
  score: number;
};

export type AssetQuote = {
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
  change: number;
  volume?: number;
  market_cap?: number;
  sector?: string;
  asset_type: string;
  currency: string;
  exchange?: string;
};

export type RiskScore = {
  score: number;
  level: "low" | "medium" | "high";
  factors: Record<string, number>;
};

export type AIAnalysis = {
  symbol: string;
  summary: string;
  trend: string;
  risk_comment: string;
  technical_summary: string;
  model_used: string;
};

export type ChartCandle = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

export type IndicatorPoint = { t: number; v: number };

export type ChartData = {
  symbol: string;
  range: string;
  candles: ChartCandle[];
  last_price: number | null;
  indicators?: {
    rsi: IndicatorPoint[];
    macd_hist: IndicatorPoint[];
    ema_20: IndicatorPoint[];
  };
};

export type TradingSignal = {
  signal: "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL";
  label: string;
  confidence: number;
  score: number;
  reasons: string[];
};

export type NewsItem = {
  title: string;
  url: string;
  publisher: string;
  published_at: string | null;
  summary: string;
};

export type Fundamentals = {
  symbol: string;
  name: string;
  metrics: Record<string, string | number | null>;
  commentary: string;
};

export type AssetDetail = {
  quote: AssetQuote;
  chart: ChartData;
  indicators: Record<string, number | null>;
  risk: RiskScore;
  fundamentals: Fundamentals;
  news: NewsItem[];
  signal: TradingSignal;
};

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  liveMarkets: () => fetchApi<MarketTicker[]>("/markets/live"),
  featuredMarkets: () => fetchApi<MarketTicker[]>("/markets/featured"),
  search: (q: string) => fetchApi<SearchResult[]>(`/search?q=${encodeURIComponent(q)}`),
  asset: (symbol: string, assetType: string) =>
    fetchApi<AssetQuote>(`/assets/${encodeURIComponent(symbol)}?asset_type=${assetType}`),
  assetDetail: (symbol: string, assetType: string) =>
    fetchApi<AssetDetail>(
      `/assets/${encodeURIComponent(symbol)}/detail?asset_type=${assetType}`
    ),
  chart: (symbol: string, assetType: string, range = "1mo") =>
    fetchApi<ChartData>(
      `/assets/${encodeURIComponent(symbol)}/chart?asset_type=${assetType}&range=${range}`
    ),
  news: (symbol: string, assetType: string) =>
    fetchApi<NewsItem[]>(`/assets/${encodeURIComponent(symbol)}/news?asset_type=${assetType}`),
  fundamentals: (symbol: string, assetType: string) =>
    fetchApi<Fundamentals>(
      `/assets/${encodeURIComponent(symbol)}/fundamentals?asset_type=${assetType}`
    ),
  risk: (symbol: string, assetType: string) =>
    fetchApi<RiskScore>(`/assets/${encodeURIComponent(symbol)}/risk?asset_type=${assetType}`),
  indicators: (symbol: string, assetType: string) =>
    fetchApi<Record<string, number | null>>(
      `/assets/${encodeURIComponent(symbol)}/indicators?asset_type=${assetType}`
    ),
  aiAnalyze: (symbol: string, assetType: string, mode: "full" | "quick" = "full") =>
    fetchApi<AIAnalysis>("/ai/analyze", {
      method: "POST",
      body: JSON.stringify({ symbol, asset_type: assetType, mode }),
    }),
  macro: () => fetchApi<Record<string, MacroSeries>>("/macro/dashboard"),
  blog: (category?: string) =>
    fetchApi<BlogPost[]>(`/blog${category ? `?category=${category}` : ""}`),
  blogPost: (slug: string) => fetchApi<BlogPostDetail>(`/blog/${slug}`),
  me: () => fetchApi<User>("/auth/me"),
  login: (email: string, password: string) =>
    fetchApi<{ message: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, full_name?: string) =>
    fetchApi<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    }),
  watchlist: () => fetchApi<WatchlistItem[]>("/watchlist"),
  addWatchlist: (symbol: string, asset_type: string, name?: string) =>
    fetchApi<WatchlistItem>("/watchlist", {
      method: "POST",
      body: JSON.stringify({ symbol, asset_type, name }),
    }),
};

export type MacroSeries = {
  id: string;
  label: string;
  latest: number;
  change_percent: number;
  history: { date: string; value: number }[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author_name: string;
  read_time_minutes: number;
  featured: boolean;
  published_at: string;
};

export type BlogPostDetail = BlogPost & { content: string };

export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
};

export type WatchlistItem = {
  id: string;
  symbol: string;
  asset_type: string;
  name?: string;
};
