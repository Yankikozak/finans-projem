"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { api, type MarketTicker } from "@/lib/api";
import { displaySymbol, formatPercent, formatPrice } from "@/lib/utils";
import { Sparkline } from "./Sparkline";

export function FeaturedStockCards() {
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .featuredMarkets()
      .then(setTickers)
      .catch(() => {
        setError(true);
        setTickers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card h-36 skeleton" />
        ))}
      </div>
    );
  }

  if (error || tickers.length === 0) {
    return (
      <p className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">
        Veriler için backend çalışmalı:{" "}
        <code className="text-nexus-accent">.\scripts\start-backend.ps1</code>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {tickers.map((t) => {
        const positive = t.change_percent >= 0;
        const sym = displaySymbol(t.symbol);
        const type = t.asset_type === "crypto" ? "crypto" : "stock";
        const href = `/asset/${sym}?type=${type}&symbol=${encodeURIComponent(t.symbol)}`;

        return (
          <Link
            key={t.symbol}
            href={href}
            className="glass-card card-tap block p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold sm:text-xl">{sym}</span>
                  {positive ? (
                    <TrendingUp size={16} className="shrink-0 text-emerald-400" />
                  ) : (
                    <TrendingDown size={16} className="shrink-0 text-red-400" />
                  )}
                </div>
                <p className="truncate text-sm text-zinc-500">{t.name}</p>
              </div>
              <Sparkline data={t.sparkline} positive={positive} />
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-white/5 pt-3">
              <p className="text-xl font-semibold tabular-nums sm:text-2xl">
                {formatPrice(t.price, t.currency)}
              </p>
              <span
                className={`text-sm font-semibold tabular-nums ${
                  positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatPercent(t.change_percent)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
