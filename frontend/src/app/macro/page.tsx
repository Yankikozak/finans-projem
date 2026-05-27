"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api, type MacroSeries } from "@/lib/api";

export default function MacroPage() {
  const [data, setData] = useState<Record<string, MacroSeries>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .macro()
      .then(setData)
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  const entries = Object.values(data);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-6">
      <h1 className="section-title">Makroekonomi</h1>
      <p className="mt-2 text-zinc-500">FRED API · enflasyon, faiz, GDP, işsizlik, dolar endeksi</p>

      {loading ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card h-64 skeleton" />
          ))}
        </div>
      ) : (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {entries.map((series) => (
            <div key={series.id} className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{series.label}</h3>
                  <p className="mt-1 text-3xl font-bold tabular-nums">
                    {series.latest?.toLocaleString() ?? "—"}
                  </p>
                </div>
                <span
                  className={`rounded-lg px-2 py-1 text-sm ${
                    series.change_percent >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {series.change_percent >= 0 ? "+" : ""}
                  {series.change_percent}%
                </span>
              </div>
              <div className="mt-6 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series.history}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} width={50} />
                    <Tooltip
                      contentStyle={{
                        background: "#0c0e14",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00e5a0"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
