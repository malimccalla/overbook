"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface QueueRequest {
  id: string;
  promoter: string | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  proposedDate: string | null;
  rawFee: string | null;
  status: string;
  missingFields: string[];
  conflictFlags: string[];
  createdAt: string;
  artist: { id: string; name: string } | null;
}

interface RequestQueueProps {
  requests: QueueRequest[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function RequestQueue({ requests, loading, selectedId, onSelect }: RequestQueueProps) {
  if (loading && requests.length === 0) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No requests</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Paste a booking email below to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="divide-y">
        {requests.map((req) => (
          <button
            key={req.id}
            onClick={() => onSelect(req.id)}
            className={cn(
              "w-full text-left px-4 py-3 transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:bg-accent/50",
              selectedId === req.id && "bg-accent"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium leading-tight truncate">
                {req.artist?.name ?? "Unknown artist"}
              </span>
              <StatusIndicator status={req.status} missingFields={req.missingFields} conflictFlags={req.conflictFlags} />
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              {[req.rawFee, formatDate(req.proposedDate)].filter(Boolean).join(" · ")}
            </div>

            <div className="mt-0.5 text-xs text-muted-foreground/70">
              {[req.city, req.country].filter(Boolean).join(", ")}
              {req.venue && ` · ${req.venue}`}
            </div>

            <div className="mt-0.5 text-xs text-muted-foreground/70">
              {req.promoter && `From: ${req.promoter}`}
              {req.createdAt && ` · ${formatDistanceToNow(req.createdAt)}`}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function StatusIndicator({ status, missingFields, conflictFlags }: { status: string; missingFields: string[]; conflictFlags: string[] }) {
  if (status === "CAPTURED") {
    return <Badge variant="secondary" className="text-[10px] shrink-0">Captured</Badge>;
  }
  if (status === "DISMISSED") {
    return <Badge variant="outline" className="text-[10px] shrink-0 text-muted-foreground">Dismissed</Badge>;
  }
  if (conflictFlags.length > 0) {
    return <Badge variant="destructive" className="text-[10px] shrink-0">Conflict</Badge>;
  }
  if (missingFields.length > 0) {
    return <Badge variant="outline" className="text-[10px] shrink-0 text-amber-600 border-amber-200">Needs details</Badge>;
  }
  return <Badge variant="secondary" className="text-[10px] shrink-0 text-emerald-600">Ready</Badge>;
}

function formatDate(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
