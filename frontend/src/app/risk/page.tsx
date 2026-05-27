"use client";

import { useState } from "react";
import { api, type RiskScore } from "@/lib/api";
import { RiskGauge } from "@/components/risk/RiskGauge";
import { SearchBar } from "@/components/search/SearchBar";

export default function RiskPage() {
  const [symbol, setSymbol] = useState("THYAO.IS");
  const [assetType, setAssetType] = useState("stock");
  const [risk, setRisk] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (sym?: string, type?: string) => {
    const s = sym || symbol;
    const t = type || assetType;
    setLoading(true);
    try {
      const r = await api.risk(s, t);
      setRisk(r);
      if (sym) setSymbol(sym);
      if (type) setAssetType(t);
    } catch {
      setRisk(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-6">
      <h1 className="section-title">Risk Analizi</h1>
      <p className="mt-2 max-w-2xl text-zinc-500">
        Volatilite, hacim anomalileri ve teknik göstergelere dayalı bileşik risk skoru.
      </p>
      <div className="mt-8 max-w-xl">
        <SearchBar />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {[
          { s: "THYAO.IS", t: "stock", l: "THYAO" },
          { s: "BTC-USD", t: "crypto", l: "BTC" },
          { s: "AAPL", t: "stock", l: "AAPL" },
        ].map((x) => (
          <button
            key={x.s}
            type="button"
            onClick={() => analyze(x.s, x.t)}
            className="btn-ghost text-sm"
          >
            {x.l}
          </button>
        ))}
      </div>
      <div className="mt-12 max-w-md">
        {loading ? (
          <div className="glass-card h-64 skeleton" />
        ) : risk ? (
          <RiskGauge risk={risk} />
        ) : (
          <p className="text-zinc-500">Bir varlık seçin veya arayın.</p>
        )}
      </div>
    </div>
  );
}
