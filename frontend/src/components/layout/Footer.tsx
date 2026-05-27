import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Nexus Finance. Tüm hakları saklıdır.
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="/about" className="hover:text-white">
            Hakkında
          </Link>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link href="/ai" className="hover:text-white">
            AI Analiz
          </Link>
        </div>
      </div>
    </footer>
  );
}
