import { MarketCards } from "@/components/markets/MarketCards";
import { SearchBar } from "@/components/search/SearchBar";

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-6">
      <h1 className="section-title">Piyasalar</h1>
      <p className="mt-2 text-zinc-500">Global endeksler, emtia ve döviz kurları</p>
      <div className="mt-8 max-w-xl">
        <SearchBar />
      </div>
      <div className="mt-12">
        <MarketCards />
      </div>
    </div>
  );
}
