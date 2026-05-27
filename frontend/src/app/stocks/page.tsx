import Link from "next/link";

const BIST = [
  { sym: "THYAO", symbol: "THYAO.IS", name: "Türk Hava Yolları" },
  { sym: "GARAN", symbol: "GARAN.IS", name: "Garanti BBVA" },
  { sym: "AKBNK", symbol: "AKBNK.IS", name: "Akbank" },
];

const US = [
  { sym: "AAPL", symbol: "AAPL", name: "Apple" },
  { sym: "TSLA", symbol: "TSLA", name: "Tesla" },
  { sym: "NVDA", symbol: "NVDA", name: "NVIDIA" },
];

export default function StocksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-6">
      <h1 className="section-title">Hisse Senetleri</h1>
      <p className="mt-2 text-zinc-500">BIST ve ABD borsaları</p>

      <h2 className="mt-12 text-xl font-semibold text-nexus-accent">BIST</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BIST.map((s) => (
          <StockCard key={s.symbol} {...s} />
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold text-nexus-accent2">ABD</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {US.map((s) => (
          <StockCard key={s.symbol} {...s} />
        ))}
      </div>
    </div>
  );
}

function StockCard({
  sym,
  symbol,
  name,
}: {
  sym: string;
  symbol: string;
  name: string;
}) {
  return (
    <Link
      href={`/asset/${sym}?type=stock&symbol=${encodeURIComponent(symbol)}`}
      className="glass-card block p-6"
    >
      <h3 className="font-display text-2xl font-bold">{sym}</h3>
      <p className="text-zinc-500">{name}</p>
    </Link>
  );
}
