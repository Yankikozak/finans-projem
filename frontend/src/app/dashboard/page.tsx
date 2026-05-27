"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type User, type WatchlistItem } from "@/lib/api";
import { displaySymbol } from "@/lib/utils";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null));
    api.watchlist().then(setWatchlist).catch(() => setWatchlist([]));
  }, []);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-28 text-center">
        <p className="text-zinc-500">Giriş yapmanız gerekiyor.</p>
        <Link href="/auth/login" className="btn-primary mt-4 inline-block">
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-6">
      <h1 className="section-title">Dashboard</h1>
      <p className="mt-2 text-zinc-500">Hoş geldin, {user.full_name || user.email}</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">İzleme Listesi</h2>
        {watchlist.length === 0 ? (
          <p className="mt-4 text-zinc-500">
            Henüz favori yok.{" "}
            <Link href="/markets" className="text-nexus-accent">
              Piyasalardan ekle
            </Link>
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {watchlist.map((w) => (
              <Link
                key={w.id}
                href={`/asset/${displaySymbol(w.symbol)}?type=${w.asset_type}&symbol=${w.symbol}`}
                className="glass-card p-4"
              >
                <span className="font-bold">{displaySymbol(w.symbol)}</span>
                <span className="ml-2 text-sm text-zinc-500">{w.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
