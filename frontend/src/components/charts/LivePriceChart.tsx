"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

type ChartPoint = { t: number; c: number; label: string };

const RANGES = [
  { key: "5d", label: "5G" },
  { key: "1mo", label: "1A" },
  { key: "3mo", label: "3A" },
  { key: "1y", label: "1Y" },
];

export function LivePriceChart({
  symbol,
  assetType,
  currency = "USD",
}: {
  symbol: string;
  assetType: string;
  currency?: string;
}) {
  const [range, setRange] = useState("1mo");
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    (r: string, silent = false) => {
      if (!silent) setLoading(true);
      api
        .chart(symbol, assetType, r)
        .then((res) => {
          setData(
            res.candles.map((c) => ({
              t: c.t,
              c: c.c,
              label: new Date(c.t * 1000).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              }),
            }))
          );
        })
        .catch(() => setData([]))
        .finally(() => setLoading(false));
    },
    [symbol, assetType]
  );

  useEffect(() => {
    load(range);
    const id = setInterval(() => load(range, true), 120000);
    return () => clearInterval(id);
  }, [range, load]);

  const last = data[data.length - 1]?.c;
  const first = data[0]?.c;
  const change = last && first ? ((last - first) / first) * 100 : 0;
  const positive = change >= 0;

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold md:text-base">Canlı Grafik</h3>
          {last != null && (
            <p className="text-xl font-bold tabular-nums md:text-2xl">
              {formatPrice(last, currency)}
              <span
                className={`ml-2 text-xs font-medium md:text-sm ${positive ? "text-emerald-400" : "text-red-400"}`}
              >
                {positive ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg bg-white/5 p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`min-h-[36px] min-w-[40px] rounded-md px-2.5 py-1.5 text-xs font-medium ${
                range === r.key ? "bg-nexus-accent text-black" : "text-zinc-400"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-56 p-2 sm:h-72 md:h-80">
        {loading && data.length === 0 ? (
          <div className="h-full skeleton rounded-xl" />
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Grafik yüklenemedi
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={positive ? "#00e5a0" : "#ff4d6d"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={positive ? "#00e5a0" : "#ff4d6d"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 9 }} interval="preserveStartEnd" />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "#71717a", fontSize: 9 }}
                width={48}
                tickFormatter={(v) => Number(v).toFixed(1)}
              />
              <Tooltip
                contentStyle={{
                  background: "#0c0e14",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => [formatPrice(v, currency), "Fiyat"]}
              />
              <Area
                type="monotone"
                dataKey="c"
                stroke={positive ? "#00e5a0" : "#ff4d6d"}
                fill={`url(#grad-${symbol.replace(/[^a-zA-Z0-9]/g, "")})`}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="border-t border-white/5 px-4 py-2 text-[10px] text-zinc-600 md:text-xs">
        Alt bölümde RSI ve MACD indikatör grafikleri ile AL / SAT sinyali gösterilir.
      </p>
    </div>
  );
}
