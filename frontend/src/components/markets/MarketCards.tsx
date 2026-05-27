"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type MarketTicker } from "@/lib/api";
import { displaySymbol, formatPercent, formatPrice } from "@/lib/utils";
import { Sparkline } from "./Sparkline";

export function MarketCards() {
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .liveMarkets()
      .then(setTickers)
      .catch(() => setTickers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card h-32 skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tickers.map((t) => {
        const positive = t.change_percent >= 0;
        const sym = displaySymbol(t.symbol);
        const type = t.asset_type === "crypto" ? "crypto" : "stock";

        return (
          <Link
            key={t.symbol}
            href={`/asset/${sym}?type=${type}&symbol=${encodeURIComponent(t.symbol)}`}
            className="glass-card card-tap block p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {t.asset_type}
                </p>
                <h3 className="font-display text-lg font-bold">{sym}</h3>
              </div>
              <Sparkline data={t.sparkline} positive={positive} />
            </div>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-lg font-semibold tabular-nums">
                {formatPrice(t.price, t.currency)}
              </p>
              <span
                className={`rounded-lg px-2 py-0.5 text-xs font-medium ${
                  positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
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
