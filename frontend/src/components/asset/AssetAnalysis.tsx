"use client";

import type { AIAnalysis, Fundamentals, NewsItem, RiskScore, TradingSignal } from "@/lib/api";
import { RiskGauge } from "@/components/risk/RiskGauge";
import { TradingSignalBanner } from "@/components/asset/TradingSignalBanner";
import { ExternalLink, Newspaper } from "lucide-react";

export function AssetAnalysis({
  indicators,
  risk,
  fundamentals,
  ai,
  news,
  signal,
  loadingAi,
}: {
  indicators: Record<string, number | null>;
  risk: RiskScore;
  fundamentals: Fundamentals;
  ai: AIAnalysis | null;
  news: NewsItem[];
  signal: TradingSignal;
  loadingAi?: boolean;
}) {
  return (
    <div className="space-y-5 md:space-y-6">
      <section className="glass-card p-5 md:p-8">
        <h2 className="font-display text-lg font-bold md:text-xl">Teknik Analiz</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {(
            [
              { label: "RSI", val: indicators.rsi },
              { label: "MACD", val: indicators.macd },
              { label: "MACD Hist", val: indicators.macd_hist },
              { label: "EMA 20", val: indicators.ema_20 },
              { label: "SMA 50", val: indicators.sma_50 },
              { label: "BB Üst", val: indicators.bb_upper },
            ] as const
          ).map(({ label, val }) => {
            const rsiClass =
              label === "RSI" && val != null
                ? val > 70
                  ? "text-red-400"
                  : val < 30
                    ? "text-emerald-400"
                    : ""
                : "";
            return (
              <div key={label} className="rounded-xl bg-white/5 p-3 text-center">
                <p className="text-[10px] text-zinc-500 md:text-xs">{label}</p>
                <p className={`mt-1 font-mono text-sm font-semibold ${rsiClass}`}>
                  {val != null ? Number(val).toFixed(2) : "—"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-nexus-accent/20 bg-nexus-accent/5 p-4">
          <p className="text-sm font-medium text-nexus-accent">AI Yorumu</p>
          {loadingAi ? (
            <p className="mt-2 text-sm text-zinc-500">Analiz hazırlanıyor…</p>
          ) : ai ? (
            <>
              <p className="mt-2 leading-relaxed text-zinc-200">{ai.summary}</p>
              <p className="mt-2 text-sm text-zinc-400">{ai.technical_summary}</p>
              <p className="mt-1 text-sm text-zinc-500">{ai.trend}</p>
              <p className="mt-1 text-sm text-zinc-500">{ai.risk_comment}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">
              RSI {indicators.rsi?.toFixed(1) ?? "—"} · MACD hist {indicators.macd_hist?.toFixed(2) ?? "—"}
            </p>
          )}
        </div>
      </section>

      <section className="glass-card p-5 md:p-8">
        <h2 className="font-display text-lg font-bold md:text-xl">Temel Analiz</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300 md:text-base">
          {fundamentals.commentary}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.entries(fundamentals.metrics).map(([key, val]) => (
            <div key={key} className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] capitalize text-zinc-500 md:text-xs">{key.replace(/_/g, " ")}</p>
              <p className="mt-1 text-sm font-semibold">{val ?? "—"}</p>
            </div>
          ))}
        </div>
      </section>

      <TradingSignalBanner signal={signal} />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <RiskGauge risk={risk} />
        </div>
      </div>

      <section className="glass-card p-5 md:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Newspaper className="text-nexus-accent" size={20} />
          <h2 className="font-display text-lg font-bold md:text-xl">Son Gelişmeler</h2>
        </div>
        <div className="space-y-3">
          {news.map((item, i) => (
            <a
              key={`${item.title}-${i}`}
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-white/5 p-4 active:bg-white/10"
            >
              <h3 className="text-sm font-medium md:text-base">{item.title}</h3>
              {item.summary && (
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500 md:text-sm">{item.summary}</p>
              )}
              <p className="mt-2 flex items-center gap-1 text-[10px] text-zinc-600 md:text-xs">
                {item.publisher}
                <ExternalLink size={12} />
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
