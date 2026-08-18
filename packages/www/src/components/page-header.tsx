"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/requests": "Requests",
  "/bookings": "Bookings",
  "/roster": "Roster",
};

export function PageHeader() {
  const pathname = usePathname();
  const title = Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] ?? "";

  return (
    <header className="flex h-12 shrink-0 items-center border-b px-4">
      <h1 className="text-sm font-medium">{title}</h1>
    </header>
  );
}
