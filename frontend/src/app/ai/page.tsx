"use client";

import { useState } from "react";
import { api, type AIAnalysis } from "@/lib/api";
import { SearchBar } from "@/components/search/SearchBar";

export default function AIAnalysisPage() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"full" | "quick">("full");

  const run = async (symbol: string, assetType: string) => {
    setLoading(true);
    try {
      const a = await api.aiAnalyze(symbol, assetType, mode);
      setAnalysis(a);
    } catch {
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-24 md:pt-28 md:px-6">
      <h1 className="section-title">
        <span className="text-gradient">AI</span> Analiz Merkezi
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-500">
        Profesyonel piyasa yorumları — tüm AI çağrıları güvenli backend üzerinden.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="max-w-xl flex-1">
          <SearchBar />
        </div>
        <div className="flex rounded-xl border border-white/10 p-1">
          {(["full", "quick"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-2 text-sm ${
                mode === m ? "bg-nexus-accent text-black" : "text-zinc-400"
              }`}
            >
              {m === "full" ? "Detaylı" : "Hızlı"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" className="btn-primary text-sm" onClick={() => run("THYAO.IS", "stock")}>
          THYAO Analiz
        </button>
        <button type="button" className="btn-ghost text-sm" onClick={() => run("BTC-USD", "crypto")}>
          BTC Analiz
        </button>
      </div>

      {loading && <div className="mt-12 glass-card h-48 skeleton" />}

      {analysis && !loading && (
        <div className="glass-card mt-12 border-nexus-accent/20 p-6 md:p-12">
          <p className="text-sm text-zinc-500">{analysis.symbol} · {analysis.model_used}</p>
          <p className="mt-4 text-xl font-medium leading-relaxed md:text-3xl">{analysis.summary}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div>
              <h4 className="text-nexus-accent">Trend</h4>
              <p className="mt-2 text-zinc-400">{analysis.trend}</p>
            </div>
            <div>
              <h4 className="text-nexus-accent">Risk</h4>
              <p className="mt-2 text-zinc-400">{analysis.risk_comment}</p>
            </div>
            <div>
              <h4 className="text-nexus-accent">Teknik</h4>
              <p className="mt-2 text-zinc-400">{analysis.technical_summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
