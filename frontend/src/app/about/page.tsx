export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-24 md:px-6">
      <h1 className="section-title">Hakkında</h1>
      <p className="mt-6 text-lg leading-relaxed text-zinc-400">
        Nexus Finance, Bloomberg, TradingView ve modern fintech startup tasarımlarından ilham alan,
        AI destekli yeni nesil bir finans analiz platformudur.
      </p>
      <ul className="mt-8 space-y-4 text-zinc-400">
        <li>• Gerçek zamanlı hisse ve kripto verileri (Yahoo Finance, CoinGecko)</li>
        <li>• Teknik analiz: RSI, MACD, EMA, SMA, Bollinger Bands</li>
        <li>• AI yorumları — tüm anahtarlar backend&apos;de güvende</li>
        <li>• Makroekonomi paneli (FRED API)</li>
        <li>• JWT + Google OAuth + httpOnly cookie auth</li>
      </ul>
    </div>
  );
}
