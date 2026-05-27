import Link from "next/link";

const CRYPTO = [
  { sym: "BTC", name: "Bitcoin" },
  { sym: "ETH", name: "Ethereum" },
  { sym: "SOL", name: "Solana" },
  { sym: "BNB", name: "BNB" },
  { sym: "XRP", name: "XRP" },
];

export default function CryptoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-6">
      <h1 className="section-title">Kripto Piyasaları</h1>
      <p className="mt-2 text-zinc-500">CoinGecko & Binance verileriyle desteklenir</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CRYPTO.map((c) => (
          <Link
            key={c.sym}
            href={`/asset/${c.sym}?type=crypto&symbol=${c.sym}-USD`}
            className="glass-card p-6 transition hover:border-nexus-accent/30"
          >
            <h3 className="font-display text-2xl font-bold">{c.sym}</h3>
            <p className="text-zinc-500">{c.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
