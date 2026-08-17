import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#fafafa]">
      <aside className="flex w-60 flex-col bg-[#1a1a1a] text-white">
        <div className="flex h-14 items-center gap-2 px-4 border-b border-white/10">
          <span className="text-base font-semibold tracking-tight">Overbook</span>
        </div>

        <div className="px-3 pt-4 pb-2">
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox: "w-full",
                organizationSwitcherTrigger:
                  "w-full justify-between rounded-md bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10",
              },
            }}
          />
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-4">
          <SidebarLink href="/requests">Booking Requests</SidebarLink>
          <SidebarLink href="/bookings">Bookings</SidebarLink>
          <SidebarLink href="/roster">Roster</SidebarLink>
        </nav>

        <div className="border-t border-white/10 px-4 py-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}
