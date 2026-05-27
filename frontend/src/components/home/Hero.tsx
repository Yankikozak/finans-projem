import { SearchBar } from "@/components/search/SearchBar";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-10 md:pt-28 md:pb-16">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-nexus-accent/20 bg-nexus-accent/5 px-3 py-1 text-xs text-nexus-accent md:px-4 md:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-nexus-accent" />
            Canlı piyasa · AI analiz
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            AI Destekli{" "}
            <span className="text-gradient">Yeni Nesil</span>
            <br />
            Finans Platformu
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 md:mt-6 md:text-xl">
            Hisse senetleri, kripto paralar ve piyasa risklerini gerçek zamanlı analiz edin.
          </p>
          <div className="mx-auto mt-6 flex justify-center md:mt-10">
            <SearchBar large />
          </div>
        </div>
      </div>
    </section>
  );
}
