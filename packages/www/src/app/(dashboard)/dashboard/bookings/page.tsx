"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { gql, useQuery } from "@apollo/client";
import { ArrowDownUp, Filter, Search } from "lucide-react";

const BOOKINGS = gql`
  query AllBookings {
    bookings {
      id
      promoter
      promoterEmail
      venue
      city
      country
      proposedDate
      rawFee
      currencyCode
      status
      createdAt
      artist {
        id
        name
      }
    }
  }
`;

const ACTIVE_STATUSES = new Set([
  "PENCILLED",
  "SENT_TO_ARTIST",
  "APPROVED",
  "CONFIRMED",
  "CONTRACTED",
]);

const STATUS_COLORS: Record<string, string> = {
  INBOX: "bg-zinc-50 text-zinc-600 border-zinc-200",
  NEEDS_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
  PENCILLED: "bg-yellow-50 text-yellow-700 border-yellow-200",
  SENT_TO_ARTIST: "bg-indigo-50 text-indigo-700 border-indigo-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CONFIRMED: "bg-green-50 text-green-700 border-green-200",
  CONTRACTED: "bg-purple-50 text-purple-700 border-purple-200",
  DECLINED: "bg-zinc-50 text-zinc-400 border-zinc-200",
  LOST: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  INBOX: "Inbox",
  NEEDS_REVIEW: "Needs review",
  PENCILLED: "Pencilled",
  SENT_TO_ARTIST: "Sent to artist",
  APPROVED: "Approved",
  CONFIRMED: "Confirmed",
  CONTRACTED: "Contracted",
  DECLINED: "Declined",
  LOST: "Lost",
};

interface BookingRow {
  id: string;
  promoter: string | null;
  promoterEmail: string | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  proposedDate: string | null;
  rawFee: string | null;
  currencyCode: string | null;
  status: string;
  createdAt: string;
  artist: { id: string; name: string } | null;
}

export default function BookingsPage() {
  const { data, loading } = useQuery(BOOKINGS);
  const allBookings: BookingRow[] = data?.bookings ?? [];
  const bookings = allBookings.filter((b) => ACTIVE_STATUSES.has(b.status));

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
              <ArrowDownUp className="h-3 w-3" />
              <span className="text-muted-foreground">Sort by</span>
              <span className="font-medium text-foreground">Date</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Date (soonest)</DropdownMenuItem>
            <DropdownMenuItem>Date (latest)</DropdownMenuItem>
            <DropdownMenuItem>Artist (A→Z)</DropdownMenuItem>
            <DropdownMenuItem>Fee (high → low)</DropdownMenuItem>
            <DropdownMenuItem>Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
              <Filter className="h-3 w-3" />
              <span className="text-muted-foreground">Status</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>All active</DropdownMenuItem>
            <DropdownMenuItem>Pencilled</DropdownMenuItem>
            <DropdownMenuItem>Sent to artist</DropdownMenuItem>
            <DropdownMenuItem>Confirmed</DropdownMenuItem>
            <DropdownMenuItem>Contracted</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
              <Filter className="h-3 w-3" />
              <span className="text-muted-foreground">Artist</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>All artists</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        <span className="text-xs text-muted-foreground">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </span>

        <Button variant="outline" size="icon" className="h-7 w-7">
          <Search className="h-3 w-3" />
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading && !data && (
          <div className="p-6 text-sm text-muted-foreground">Loading...</div>
        )}

        {bookings.length === 0 && !loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No active bookings</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Pencil a request to see it here
              </p>
            </div>
          </div>
        )}

        {bookings.length > 0 && (
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-background">
              <tr className="border-b">
                <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground">Booking</th>
                <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground">Artist</th>
                <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground">Location</th>
                <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground">Date</th>
                <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground">Fee</th>
                <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground">Promoter</th>
                <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-border/50 transition-colors hover:bg-muted/30 cursor-pointer"
                >
                  <td className="h-10 px-4 font-medium text-foreground">
                    {b.venue ?? "—"}
                  </td>
                  <td className="h-10 px-4 text-foreground">
                    {b.artist?.name ?? "Unmatched"}
                  </td>
                  <td className="h-10 px-4 text-muted-foreground">
                    {[b.city, b.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="h-10 px-4 text-foreground whitespace-nowrap">
                    {b.proposedDate
                      ? new Date(b.proposedDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "TBC"}
                  </td>
                  <td className="h-10 px-4 font-medium text-foreground whitespace-nowrap">
                    {b.rawFee ?? "—"}
                  </td>
                  <td className="h-10 px-4 text-muted-foreground">
                    {b.promoter ?? "—"}
                  </td>
                  <td className="h-10 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[11px] ${STATUS_COLORS[b.status] ?? ""}`}
                    >
                      {STATUS_LABELS[b.status] ?? b.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
