"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Moon, Sun, User, X } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/markets", label: "Piyasalar" },
  { href: "/crypto", label: "Kripto" },
  { href: "/stocks", label: "Hisseler" },
  { href: "/risk", label: "Risk" },
  { href: "/ai", label: "AI" },
  { href: "/blog", label: "Blog" },
  { href: "/macro", label: "Makro" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useThemeStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-nexus-bg/95 md:bg-nexus-bg/80 md:backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-nexus-accent to-nexus-accent2 text-xs font-bold text-black md:h-9 md:w-9 md:rounded-xl md:text-sm">
            N
          </span>
          <span className="font-display text-base font-bold md:text-lg">
            Nexus<span className="text-nexus-accent">Finance</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-2.5 py-2 text-sm font-medium",
                pathname === link.href ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg border border-white/10 p-2 text-zinc-400"
            aria-label="Tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            href="/dashboard"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-nexus-accent/30 bg-nexus-accent/10 text-nexus-accent sm:flex"
          >
            <User size={16} />
          </Link>
          <button
            type="button"
            className="rounded-lg border border-white/10 p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menü"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/5 bg-nexus-surface px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-medium",
                  pathname === link.href ? "bg-nexus-accent/15 text-nexus-accent" : "bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/auth/login"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 block w-full text-center text-sm"
          >
            Giriş Yap
          </Link>
        </nav>
      )}
    </header>
  );
}
