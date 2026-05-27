"use client";

import type { RiskScore } from "@/lib/api";

const levelConfig = {
  low: { label: "Düşük Risk", color: "#00e5a0" },
  medium: { label: "Orta Risk", color: "#fbbf24" },
  high: { label: "Yüksek Risk", color: "#ff4d6d" },
};

export function RiskGauge({ risk }: { risk: RiskScore }) {
  const cfg = levelConfig[risk.level];
  const pct = Math.min(100, Math.max(0, risk.score));

  return (
    <div className="glass-card p-5 md:p-6">
      <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500">Risk Skoru</h3>
      <div className="mt-4 text-center">
        <p className="text-4xl font-bold tabular-nums" style={{ color: cfg.color }}>
          {risk.score}
        </p>
        <p className="text-sm font-medium" style={{ color: cfg.color }}>
          {cfg.label}
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, backgroundColor: cfg.color }}
        />
      </div>
      <div className="mt-4 space-y-2">
        {Object.entries(risk.factors).map(([key, val]) => (
          <div key={key}>
            <div className="mb-0.5 flex justify-between text-[10px] text-zinc-500 md:text-xs">
              <span className="capitalize">{key.replace("_", " ")}</span>
              <span>{val}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-nexus-accent/60" style={{ width: `${val}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
