import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <aside className="flex w-56 flex-col border-r border-zinc-200 dark:border-zinc-800">
        <div className="flex h-16 items-center px-6 font-semibold tracking-tight">
          <Link href="/">Overbook</Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          <NavLink href="/bookings">Bookings</NavLink>
          <NavLink href="/requests">Requests</NavLink>
          <NavLink href="/roster">Roster</NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {children}
    </Link>
  );
}
