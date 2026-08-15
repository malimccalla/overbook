import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-ink">
        <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-[clamp(1.25rem,4vw,4.75rem)]">
          <Link
            href="/"
            className="font-mono text-xl font-bold tracking-tight no-underline"
          >
            Overbook<span className="text-red">.</span>
          </Link>
          <Link
            href="/app"
            className="border-b border-ink pb-0.5 text-sm font-semibold no-underline hover:underline"
          >
            Dashboard <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-ink bg-ink text-paper">
        <div className="mx-auto flex h-28 max-w-[1400px] items-center justify-between px-[clamp(1.25rem,4vw,4.75rem)] font-mono text-xs uppercase">
          <span className="font-mono text-lg font-bold">
            Overbook<span className="text-red">.</span>
          </span>
          <span>© {new Date().getFullYear()} Overbook</span>
        </div>
      </footer>
    </>
  );
}
