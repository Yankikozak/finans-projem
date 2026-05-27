"use client";

import { memo } from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
} from "recharts";

type Point = { t: number; v: number };

function toChartData(rsi: Point[], macd: Point[]) {
  const map = new Map<number, { label: string; rsi?: number; macd?: number }>();
  const add = (pts: Point[], key: "rsi" | "macd") => {
    pts.forEach((p) => {
      const label = new Date(p.t * 1000).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
      const row = map.get(p.t) || { label };
      row[key] = p.v;
      map.set(p.t, row);
    });
  };
  add(rsi, "rsi");
  add(macd, "macd");
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

function IndicatorChartsInner({
  rsi,
  macdHist,
}: {
  rsi: Point[];
  macdHist: Point[];
}) {
  const data = toChartData(rsi, macdHist);
  if (!data.length) return null;

  return (
    <div className="glass-card mt-4 space-y-4 p-4">
      <h3 className="text-sm font-semibold md:text-base">Teknik İndikatör Grafikleri</h3>

      {rsi.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-zinc-500">RSI (14)</p>
          <div className="h-36 md:h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#71717a" }} interval="preserveEnd" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#71717a" }} width={28} />
                <ReferenceLine y={70} stroke="#ff4d6d" strokeDasharray="3 3" />
                <ReferenceLine y={30} stroke="#00e5a0" strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{ background: "#0c0e14", border: "1px solid #333", borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="rsi" stroke="#00e5a0" dot={false} strokeWidth={2} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {macdHist.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-zinc-500">MACD Histogram</p>
          <div className="h-36 md:h-44">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#71717a" }} interval="preserveEnd" />
                <YAxis tick={{ fontSize: 9, fill: "#71717a" }} width={32} />
                <Tooltip
                  contentStyle={{ background: "#0c0e14", border: "1px solid #333", borderRadius: 8 }}
                />
                <Bar dataKey="macd" fill="#3b82f6" isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export const IndicatorCharts = memo(IndicatorChartsInner);
