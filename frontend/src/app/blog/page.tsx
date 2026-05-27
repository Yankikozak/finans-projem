"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type BlogPost } from "@/lib/api";

const CATEGORIES = ["all", "crypto", "macro", "guide", "stocks"];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    api
      .blog(category === "all" ? undefined : category)
      .then(setPosts)
      .catch(() => setPosts([]));
  }, [category]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-6">
      <h1 className="section-title">Blog & Araştırma</h1>
      <p className="mt-2 text-zinc-500">Medium × Bloomberg — ekonomi, kripto ve yatırım rehberleri</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-sm capitalize ${
              category === c ? "bg-nexus-accent text-black" : "bg-white/5 text-zinc-400"
            }`}
          >
            {c === "all" ? "Tümü" : c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className={`glass-card block overflow-hidden transition ${
              i === 0 && post.featured ? "md:col-span-2 md:flex" : ""
            }`}
          >
            <div className={`p-8 ${i === 0 && post.featured ? "md:flex-1" : ""}`}>
              {post.featured && (
                <span className="text-xs font-medium uppercase text-nexus-accent">Öne Çıkan</span>
              )}
              <span className="mt-2 block text-xs uppercase text-zinc-500">{post.category}</span>
              <h2 className="mt-2 font-display text-2xl font-bold">{post.title}</h2>
              <p className="mt-3 text-zinc-400">{post.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-sm text-zinc-500">
                <span>{post.author_name}</span>
                <span>·</span>
                <span>{post.read_time_minutes} dk okuma</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
