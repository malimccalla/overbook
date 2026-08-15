import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <section className="flex w-full max-w-4xl flex-col items-center gap-8 px-6 py-32 text-center">
        <h1 className="text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Manage every booking, <br />
          from offer to settlement.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          The <strong>all-in-one</strong> booking management platform <br /> empowering agencies to move <strong>at the speed of AI.</strong>
        </p>
        <div className="flex gap-4">
          <Link
            href="/app"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
}
