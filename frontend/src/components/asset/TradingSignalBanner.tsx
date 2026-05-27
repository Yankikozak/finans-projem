"use client";

import type { TradingSignal } from "@/lib/api";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const STYLES: Record<string, { bg: string; border: string; text: string; icon: typeof TrendingUp }> = {
  STRONG_BUY: { bg: "bg-emerald-500/20", border: "border-emerald-400/50", text: "text-emerald-300", icon: TrendingUp },
  BUY: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", icon: TrendingUp },
  HOLD: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: Minus },
  SELL: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: TrendingDown },
  STRONG_SELL: { bg: "bg-red-500/20", border: "border-red-400/50", text: "text-red-300", icon: TrendingDown },
};

export function TradingSignalBanner({ signal }: { signal: TradingSignal }) {
  const style = STYLES[signal.signal] || STYLES.HOLD;
  const Icon = style.icon;

  return (
    <section
      className={`rounded-2xl border p-5 md:p-8 ${style.bg} ${style.border}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.bg}`}>
            <Icon className={style.text} size={28} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">Yatırım Sinyali</p>
            <p className={`font-display text-3xl font-bold md:text-4xl ${style.text}`}>{signal.label}</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-zinc-500">Güven</p>
          <p className={`text-2xl font-bold tabular-nums ${style.text}`}>%{signal.confidence}</p>
        </div>
      </div>
      {signal.reasons.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4 text-sm text-zinc-400">
          {signal.reasons.map((r) => (
            <li key={r}>• {r}</li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[10px] text-zinc-600 md:text-xs">
        Sinyal teknik + temel göstergelere dayalıdır; yatırım tavsiyesi değildir.
      </p>
    </section>
  );
}
