"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "@/lib/format";
import { Calendar, CheckCircle2, CircleDashed, DollarSign, MapPin, Send, User } from "lucide-react";

import type { QueueRequest } from "./request-queue";

interface RequestDetailProps {
  request: QueueRequest & {
    promoterEmail?: string | null;
    proposedDateRaw?: string | null;
    feeAmount?: number | null;
    currencyCode?: string | null;
    confidence?: number | null;
    summary?: string | null;
    notes?: string | null;
    recommendedNextAction?: string | null;
    details?: unknown;
    updatedAt?: string;
    rawEmail?: {
      subject: string | null;
      fromEmail: string | null;
      fromName: string | null;
      bodyText: string;
      receivedAt: string;
    } | null;
  };
  onDismiss: () => void;
  onCreateBooking: () => void;
}

export function RequestDetail({ request, onDismiss, onCreateBooking }: RequestDetailProps) {
  const req = request;
  const title = deriveTitle(req);
  const subtitle = req.proposedDate
    ? new Date(req.proposedDate).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : req.proposedDateRaw ?? "";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b px-6 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5 min-w-0">
            <CircleDashed className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" strokeWidth={2} />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold truncate">{title}</h2>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>

          {req.status === "NEEDS_REVIEW" && (
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" onClick={onCreateBooking} className="gap-1.5 h-7 text-xs">
                <CheckCircle2 className="h-3 w-3" />
                Pencil
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs">
                <Send className="h-3 w-3" />
                Approve
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={onDismiss}>
                Decline
              </Button>
            </div>
          )}

          {req.status !== "NEEDS_REVIEW" && (
            <StatusBadge status={req.status} />
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-4">
          {/* Detail rows */}
          <div className="divide-y">
            <DetailRow icon={<User className="h-3.5 w-3.5" />} label="Artist" value={req.artist?.name ?? "Unmatched"} />
            <DetailRow icon={<MapPin className="h-3.5 w-3.5" />} label="Venue" value={req.venue} />
            <DetailRow icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={[req.city, req.country].filter(Boolean).join(", ")} />
            <DetailRow icon={<Calendar className="h-3.5 w-3.5" />} label="Date" value={req.proposedDate ? new Date(req.proposedDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : req.proposedDateRaw} />
            <DetailRow icon={<DollarSign className="h-3.5 w-3.5" />} label="Fee" value={req.rawFee} />
            <DetailRow icon={<User className="h-3.5 w-3.5" />} label="Promoter" value={req.promoter} />
            <DetailRow icon={<User className="h-3.5 w-3.5" />} label="Email" value={req.promoterEmail} />
          </div>

          {/* Flags */}
          {(req.missingFields.length > 0 || req.conflictFlags.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {req.conflictFlags.map((flag) => (
                <Badge key={flag} variant="destructive" className="text-[11px]">
                  {flag}
                </Badge>
              ))}
              {req.missingFields.map((field) => (
                <Badge key={field} variant="outline" className="text-[11px] text-amber-600 border-amber-200">
                  {field} missing
                </Badge>
              ))}
            </div>
          )}

          {/* Deal terms */}
          {req.details && typeof req.details === "object" && (
            <DealTerms details={req.details as Record<string, unknown>} />
          )}

          {/* Source message */}
          {req.rawEmail && (
            <div className="mt-6">
              <SectionLabel>Source message</SectionLabel>
              <div className="mt-2 rounded-md border bg-muted/30 p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium">{req.rawEmail.subject ?? "(no subject)"}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(req.rawEmail.receivedAt)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  From: {req.rawEmail.fromName ?? req.rawEmail.fromEmail}
                </p>
                <Separator className="my-3" />
                <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-foreground/80">
                  {req.rawEmail.bodyText}
                </pre>
              </div>
            </div>
          )}

          {/* Activity */}
          <div className="mt-6">
            <SectionLabel>Activity</SectionLabel>
            <div className="mt-2 space-y-2">
              <ActivityEvent time={req.createdAt} label="Request received and extracted" />
              {req.artist && (
                <ActivityEvent time={req.createdAt} label={`Matched to ${req.artist.name}`} />
              )}
              {req.status === "DISMISSED" && (
                <ActivityEvent time={req.updatedAt ?? req.createdAt} label="Declined" />
              )}
              {req.status === "CAPTURED" && (
                <ActivityEvent time={req.updatedAt ?? req.createdAt} label="Progressed to booking" />
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground truncate">{value || "—"}</span>
    </div>
  );
}

function DealTerms({ details }: { details: Record<string, unknown> }) {
  const terms = (details.offer_terms ?? details.offerTerms) as string[] | undefined;
  if (!terms || terms.length === 0) return null;

  return (
    <div className="mt-6">
      <SectionLabel>Deal terms</SectionLabel>
      <ul className="mt-2 space-y-1">
        {terms.map((term, i) => (
          <li key={i} className="text-xs text-foreground/80">· {term}</li>
        ))}
      </ul>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</h3>;
}

function ActivityEvent({ time, label }: { time: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-16 shrink-0 text-muted-foreground">{formatDistanceToNow(time)}</span>
      <span className="text-foreground">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    NEEDS_REVIEW: "secondary",
    CAPTURED: "default",
    DISMISSED: "outline",
    INFO_REQUESTED: "secondary",
  };
  const labels: Record<string, string> = {
    NEEDS_REVIEW: "Needs review",
    CAPTURED: "Captured",
    DISMISSED: "Declined",
    INFO_REQUESTED: "Awaiting reply",
  };
  return (
    <Badge variant={variants[status] ?? "outline"} className="text-[10px]">
      {labels[status] ?? status}
    </Badge>
  );
}

function deriveTitle(req: { venue: string | null; city: string | null; promoter: string | null; details?: unknown }) {
  const details = req.details as Record<string, unknown> | null;
  const eventName = details?.event_name as string ?? details?.eventName as string;
  const title = eventName || req.venue || req.promoter || "Untitled request";
  return req.city ? `${title} · ${req.city}` : title;
}
