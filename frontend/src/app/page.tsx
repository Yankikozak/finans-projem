import { Hero } from "@/components/home/Hero";
import { FeaturedStockCards } from "@/components/markets/FeaturedStockCards";
import { MarketCards } from "@/components/markets/MarketCards";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Öne çıkan hisse kartları — ilk ekranda */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8">
          <h2 className="section-title">Öne Çıkan Hisseler</h2>
          <p className="mt-2 text-zinc-500">
            THYAO, GARAN, AAPL, NVDA ve daha fazlası — tıklayın, grafik ve analiz görün
          </p>
        </div>
        <FeaturedStockCards />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-16 md:px-6">
        <div className="mb-8">
          <h2 className="section-title">Canlı Piyasalar</h2>
          <p className="mt-2 text-zinc-500">BTC, ETH, BIST100, NASDAQ ve daha fazlası</p>
        </div>
        <MarketCards />
      </section>
    </>
  );
}
