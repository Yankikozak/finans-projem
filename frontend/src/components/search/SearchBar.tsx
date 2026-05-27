"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";
import { api, type SearchResult } from "@/lib/api";
import { cn, displaySymbol } from "@/lib/utils";

export function SearchBar({ large = false }: { large?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.search(q);
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, search]);

  const goToAsset = (r: SearchResult) => {
    const type = r.asset_type === "crypto" ? "crypto" : "stock";
    const sym = displaySymbol(r.symbol);
    router.push(`/asset/${sym}?type=${type}&symbol=${encodeURIComponent(r.symbol)}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className={cn("relative w-full", large ? "max-w-2xl" : "max-w-md")}>
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-2xl border bg-white/5 backdrop-blur-xl transition-all",
          large
            ? "border-nexus-accent/20 px-5 py-4 shadow-glow focus-within:border-nexus-accent/50"
            : "border-white/10 px-4 py-3 focus-within:border-white/20"
        )}
      >
        <Search className={cn("shrink-0", large ? "text-nexus-accent" : "text-zinc-500")} size={large ? 22 : 18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="BTC, THYAO, Tesla, NVIDIA ara..."
          className="w-full bg-transparent text-base outline-none placeholder:text-zinc-500"
        />
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-nexus-accent border-t-transparent" />
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-nexus-surface/95 shadow-2xl backdrop-blur-xl"
          >
            {results.map((r) => (
              <li key={r.symbol}>
                <button
                  type="button"
                  onClick={() => goToAsset(r)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                >
                  <TrendingUp size={16} className="text-nexus-accent" />
                  <div className="flex-1">
                    <span className="font-semibold">{displaySymbol(r.symbol)}</span>
                    <span className="ml-2 text-sm text-zinc-500">{r.name}</span>
                  </div>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs uppercase text-zinc-400">
                    {r.asset_type}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
