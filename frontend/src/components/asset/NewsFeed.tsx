"use client";

import { ExternalLink, Newspaper } from "lucide-react";
import type { NewsItem } from "@/lib/api";

export function NewsFeed({ news }: { news: NewsItem[] }) {
  if (!news.length) return null;

  return (
    <section className="glass-card p-6 md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <Newspaper size={20} className="text-nexus-accent" />
        <h2 className="text-xl font-semibold">Son Gelişmeler & Haberler</h2>
      </div>
      <ul className="space-y-4">
        {news.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/10"
          >
            <a
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3"
            >
              <div className="flex-1">
                <h3 className="font-medium leading-snug group-hover:text-nexus-accent">
                  {item.title}
                </h3>
                {item.summary && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{item.summary}</p>
                )}
                <p className="mt-2 text-xs text-zinc-600">
                  {item.publisher}
                  {item.published_at && (
                    <> · {new Date(item.published_at).toLocaleDateString("tr-TR")}</>
                  )}
                </p>
              </div>
              <ExternalLink size={16} className="shrink-0 text-zinc-600 group-hover:text-nexus-accent" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
