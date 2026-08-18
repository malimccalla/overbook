"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowDownUp,
  Calendar,
  ChevronRight,
  CircleDashed,
  DollarSign,
  Filter,
  Search,
  User,
} from "lucide-react";

export interface QueueRequest {
  id: string;
  promoter: string | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  proposedDate: string | null;
  rawFee: string | null;
  currencyCode: string | null;
  status: string;
  missingFields: string[];
  conflictFlags: string[];
  createdAt: string;
  details?: Record<string, unknown> | null;
  artist: { id: string; name: string } | null;
}

interface RequestQueueProps {
  requests: QueueRequest[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function deriveTitleWithCity(req: QueueRequest): string {
  const eventName = (req.details as Record<string, unknown>)?.event_name as string
    ?? (req.details as Record<string, unknown>)?.eventName as string;
  const title = eventName || req.venue || req.promoter || "Untitled request";
  const city = req.city;
  return city ? `${title} · ${city}` : title;
}

export function RequestQueue({ requests, loading, selectedId, onSelect }: RequestQueueProps) {
  if (loading && requests.length === 0) {
    return (
      <div className="space-y-3 p-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
              <ArrowDownUp className="h-3 w-3" />
              <span className="text-muted-foreground">Sorted by</span>
              <span className="font-medium text-foreground">Newest</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Priority</DropdownMenuItem>
            <DropdownMenuItem>Newest</DropdownMenuItem>
            <DropdownMenuItem>Event date</DropdownMenuItem>
            <DropdownMenuItem>Fee (high → low)</DropdownMenuItem>
            <DropdownMenuItem>Fee (low → high)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
              <Filter className="h-3 w-3" />
              <span className="text-muted-foreground">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Needs review</DropdownMenuItem>
            <DropdownMenuItem>Has conflicts</DropdownMenuItem>
            <DropdownMenuItem>Missing details</DropdownMenuItem>
            <DropdownMenuItem>Captured</DropdownMenuItem>
            <DropdownMenuItem>Dismissed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        <Button variant="outline" size="icon" className="h-7 w-7">
          <Search className="h-3 w-3" />
        </Button>
      </div>

      {/* Cards */}
      {requests.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No requests</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Paste a booking email below to get started
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-3">
            {requests.map((req) => (
              <button
                key={req.id}
                onClick={() => onSelect(req.id)}
                className={cn(
                  "group w-full text-left rounded-lg border p-3 transition-all hover:bg-accent/50 focus-visible:outline-none",
                  selectedId === req.id
                    ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20"
                    : "border-border bg-card"
                )}
              >
                {/* Event/Venue · City */}
                <div className="flex items-center gap-2.5">
                  <CircleDashed className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
                  <span className="flex-1 truncate text-[13px] font-semibold text-foreground">
                    {deriveTitleWithCity(req)}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                {/* Artist */}
                <div className="mt-2.5 flex items-center gap-2.5">
                  <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback
                        className="text-[8px] font-semibold text-white"
                        style={{ backgroundColor: stringToColor(req.artist?.name ?? "?") }}
                      >
                        {(req.artist?.name ?? "?")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-[13px] font-medium text-foreground">
                      {req.artist?.name ?? "Unmatched artist"}
                    </span>
                  </div>
                </div>

                {/* Fee */}
                <div className="mt-2.5 flex items-center gap-2.5">
                  <DollarSign className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
                  <span className="text-[13px] font-medium text-foreground">
                    {formatFee(req.rawFee, req.currencyCode)}
                  </span>
                </div>

                {/* Date */}
                <div className="mt-2.5 flex items-center gap-2.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
                  <span className="text-[13px] font-medium text-foreground">
                    {req.proposedDate
                      ? new Date(req.proposedDate).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Date TBC"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function formatFee(rawFee: string | null, currencyCode: string | null): string {
  if (!rawFee) return "Fee TBC";

  // Extract just the numeric amount
  const numMatch = rawFee.match(/[\d,.]+/);
  const amount = numMatch ? numMatch[0] : rawFee;

  switch (currencyCode?.toUpperCase()) {
    case "GBP":
      return `GBP £${amount}`;
    case "EUR":
      return `EUR €${amount}`;
    case "USD":
      return `US $${amount}`;
    default:
      return rawFee;
  }
}

const AVATAR_COLORS = [
  "#e11d48", "#db2777", "#c026d3", "#9333ea", "#7c3aed",
  "#4f46e5", "#2563eb", "#0284c7", "#0891b2", "#0d9488",
  "#059669", "#16a34a", "#ca8a04", "#ea580c", "#dc2626",
];

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
