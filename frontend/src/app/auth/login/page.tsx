"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pt-28">
      <div className="glass-card p-8">
        <h1 className="font-display text-2xl font-bold">Giriş Yap</h1>
        <p className="mt-2 text-sm text-zinc-500">Nexus Finance hesabınıza erişin</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-nexus-accent/50"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-nexus-accent/50"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Giriş
          </button>
        </form>
        <a
          href={`${API}/api/v1/auth/google/login`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm hover:bg-white/5"
        >
          Google ile devam et
        </a>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Hesabınız yok mu?{" "}
          <Link href="/auth/register" className="text-nexus-accent hover:underline">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}
