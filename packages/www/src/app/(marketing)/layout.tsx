import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Overbook
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/app"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 text-sm text-zinc-500">
          © {new Date().getFullYear()} Overbook
        </div>
      </footer>
    </>
  );
}
