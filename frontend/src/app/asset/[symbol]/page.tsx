"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { api, type AIAnalysis, type AssetDetail, type AssetQuote } from "@/lib/api";
import { formatPercent, formatPrice } from "@/lib/utils";

const LivePriceChart = dynamic(
  () => import("@/components/charts/LivePriceChart").then((m) => m.LivePriceChart),
  { loading: () => <div className="glass-card h-64 skeleton md:h-80" /> }
);

const IndicatorCharts = dynamic(
  () => import("@/components/charts/IndicatorCharts").then((m) => m.IndicatorCharts),
  { loading: () => <div className="h-40 skeleton rounded-2xl" /> }
);

const AssetAnalysis = dynamic(
  () => import("@/components/asset/AssetAnalysis").then((m) => m.AssetAnalysis),
  { loading: () => <div className="space-y-4"><div className="h-48 skeleton rounded-2xl" /><div className="h-32 skeleton rounded-2xl" /></div> }
);

function AssetPageContent({ params }: { params: Promise<{ symbol: string }> }) {
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState("");
  const assetType = searchParams.get("type") || "stock";
  const fullSymbol = searchParams.get("symbol") || slug;

  const [quote, setQuote] = useState<AssetQuote | null>(null);
  const [detail, setDetail] = useState<AssetDetail | null>(null);
  const [ai, setAi] = useState<AIAnalysis | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [loadingRest, setLoadingRest] = useState(true);
  const [loadingAi, setLoadingAi] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    params.then((p) => setSlug(p.symbol));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    const sym = fullSymbol || slug;
    setError(false);
    setLoadingQuote(true);
    setLoadingRest(true);
    setAi(null);
    setDetail(null);

    api
      .asset(sym, assetType)
      .then((q) => {
        setQuote(q);
        setLoadingQuote(false);
      })
      .catch(() => {
        setError(true);
        setLoadingQuote(false);
        setLoadingRest(false);
      });

    api
      .assetDetail(sym, assetType)
      .then((d) => {
        setDetail(d);
        setLoadingRest(false);
      })
      .catch(() => setLoadingRest(false));

    api
      .aiAnalyze(sym, assetType as "stock" | "crypto")
      .then(setAi)
      .catch(() => setAi(null))
      .finally(() => setLoadingAi(false));
  }, [slug, fullSymbol, assetType]);

  if (loadingQuote && !quote) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-24 md:pt-28 md:px-6">
        <div className="skeleton mb-6 h-24 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-24 text-center md:pt-28">
        <p className="text-zinc-400">Veri yüklenemedi.</p>
        <p className="mt-2 text-sm text-zinc-600">.\scripts\start-backend.ps1</p>
      </div>
    );
  }

  const positive = quote.change_percent >= 0;
  const sym = fullSymbol || quote.symbol;
  const indSeries = detail?.chart?.indicators;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 md:pt-28 md:px-6 md:pb-24">
      <div className="glass-card mb-5 p-5 md:mb-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 md:text-sm">
              {quote.sector || quote.asset_type}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold md:text-4xl">{quote.name}</h1>
            <p className="text-sm text-zinc-500">{quote.symbol}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-3xl font-bold tabular-nums md:text-4xl">
              {formatPrice(quote.price, quote.currency)}
            </p>
            <p className={`text-base font-medium md:text-lg ${positive ? "text-emerald-400" : "text-red-400"}`}>
              {formatPercent(quote.change_percent)}
            </p>
          </div>
        </div>
      </div>

      <LivePriceChart symbol={sym} assetType={assetType} currency={quote.currency} />

      {indSeries && (indSeries.rsi?.length > 0 || indSeries.macd_hist?.length > 0) && (
        <IndicatorCharts rsi={indSeries.rsi || []} macdHist={indSeries.macd_hist || []} />
      )}

      {loadingRest ? (
        <div className="mt-5 space-y-4">
          <div className="skeleton h-40 rounded-2xl" />
          <div className="skeleton h-28 rounded-2xl" />
        </div>
      ) : detail ? (
        <div className="mt-5">
          <AssetAnalysis
            indicators={detail.indicators}
            risk={detail.risk}
            fundamentals={detail.fundamentals}
            ai={ai}
            news={detail.news}
            signal={detail.signal}
            loadingAi={loadingAi}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 pt-24 skeleton h-64 md:pt-28" />}>
      <AssetPageContent params={params} />
    </Suspense>
  );
}
