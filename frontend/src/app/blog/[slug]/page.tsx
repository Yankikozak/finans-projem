"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type BlogPostDetail } from "@/lib/api";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("");
  const [post, setPost] = useState<BlogPostDetail | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    api.blogPost(slug).then(setPost).catch(() => setPost(null));
  }, [slug]);

  if (!post) {
    return <div className="mx-auto max-w-3xl px-4 pt-28 skeleton h-96" />;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 pt-28 pb-24 md:px-6">
      <Link href="/blog" className="text-sm text-nexus-accent hover:underline">
        ← Blog
      </Link>
      <span className="mt-6 block text-xs uppercase text-zinc-500">{post.category}</span>
      <h1 className="mt-2 font-display text-4xl font-bold leading-tight">{post.title}</h1>
      <div className="mt-4 flex gap-4 text-sm text-zinc-500">
        <span>{post.author_name}</span>
        <span>{post.read_time_minutes} dk</span>
      </div>
      <div className="prose prose-invert mt-10 max-w-none">
        {post.content.split("\n").map((line, i) => {
          if (line.startsWith("## "))
            return (
              <h2 key={i} className="mt-8 text-2xl font-bold">
                {line.replace("## ", "")}
              </h2>
            );
          if (line.trim())
            return (
              <p key={i} className="mt-4 leading-relaxed text-zinc-300">
                {line}
              </p>
            );
          return null;
        })}
      </div>
    </article>
  );
}
