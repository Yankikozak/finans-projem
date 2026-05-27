"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.register(email, password, fullName || undefined);
      router.push("/dashboard");
    } catch {
      setError("Kayıt başarısız.");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pt-28">
      <div className="glass-card p-8">
        <h1 className="font-display text-2xl font-bold">Kayıt Ol</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Şifre (min 8)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            minLength={8}
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Kayıt Ol
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/auth/login" className="text-nexus-accent hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
