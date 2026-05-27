"use client";

type Point = { t: number; v: number };

export function Sparkline({ data, positive }: { data: Point[]; positive: boolean }) {
  if (!data.length) return <div className="h-10 w-full skeleton" />;

  const values = data.map((d) => d.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 80;
  const h = 32;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  const color = positive ? "#00e5a0" : "#ff4d6d";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-20" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}
