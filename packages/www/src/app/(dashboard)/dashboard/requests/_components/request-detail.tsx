"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "@/lib/format";

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

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header */}
      <div className="shrink-0 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold">
              {req.artist?.name ?? "Unknown artist"}
            </h2>
            <StatusBadge status={req.status} />
          </div>

          {req.status === "NEEDS_REVIEW" && (
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={onCreateBooking}>
                Progress to booking
              </Button>
              <Button size="sm" variant="outline" onClick={onDismiss}>
                Decline
              </Button>
            </div>
          )}
        </div>

        {/* Summary row */}
        <div className="mt-3 grid grid-cols-4 gap-4">
          <SummaryField
            label="Fee"
            value={req.rawFee ?? "Fee missing"}
            uncertain={!req.rawFee}
          />
          <SummaryField
            label="Date"
            value={req.proposedDate ? formatEventDate(req.proposedDate) : (req.proposedDateRaw ?? "Date TBC")}
            uncertain={!req.proposedDate}
          />
          <SummaryField
            label="Location"
            value={[req.city, req.country].filter(Boolean).join(", ") || "Location TBC"}
            secondary={req.venue ?? undefined}
            uncertain={!req.city}
          />
          <SummaryField
            label="Promoter"
            value={req.promoter ?? "Unknown"}
            uncertain={!req.promoter}
          />
        </div>
      </div>

      {/* Scrollable body */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 px-6 py-5">
          {/* Decision context */}
          {(req.missingFields.length > 0 || req.conflictFlags.length > 0) && (
            <section>
              <SectionLabel>Decision context</SectionLabel>
              <div className="mt-2 space-y-2">
                {req.conflictFlags.map((flag) => (
                  <Flag key={flag} type="conflict">{flag}</Flag>
                ))}
                {req.missingFields.map((field) => (
                  <Flag key={field} type="missing">{field} is missing from the request</Flag>
                ))}
              </div>
            </section>
          )}

          {/* Extracted details */}
          <section>
            <SectionLabel>Request details</SectionLabel>
            <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-3">
              <DetailField label="Fee" value={req.rawFee} />
              <DetailField label="Currency" value={req.currencyCode} />
              <DetailField label="Date" value={req.proposedDate ? formatEventDate(req.proposedDate) : req.proposedDateRaw} />
              <DetailField label="Venue" value={req.venue} />
              <DetailField label="City" value={[req.city, req.country].filter(Boolean).join(", ")} />
              <DetailField label="Promoter" value={req.promoter} />
              <DetailField label="Promoter email" value={req.promoterEmail} />
            </div>
          </section>

          {/* Source message */}
          {req.rawEmail && (
            <section>
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
            </section>
          )}

          {/* Activity */}
          <section>
            <SectionLabel>Activity</SectionLabel>
            <div className="mt-2 space-y-2">
              <ActivityEvent
                time={req.createdAt}
                label="Request received and extracted"
              />
              {req.artist && (
                <ActivityEvent
                  time={req.createdAt}
                  label={`Matched to ${req.artist.name}`}
                />
              )}
              {req.status === "DISMISSED" && (
                <ActivityEvent
                  time={req.updatedAt ?? req.createdAt}
                  label="Declined"
                />
              )}
              {req.status === "CAPTURED" && (
                <ActivityEvent
                  time={req.updatedAt ?? req.createdAt}
                  label="Progressed to booking"
                />
              )}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}

function SummaryField({ label, value, secondary, uncertain }: { label: string; value: string; secondary?: string; uncertain?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-sm ${uncertain ? "text-muted-foreground italic" : "text-foreground"}`}>
        {value}
      </p>
      {secondary && <p className="text-xs text-muted-foreground">{secondary}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</h3>;
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value || "—"}</p>
    </div>
  );
}

function Flag({ type, children }: { type: "conflict" | "missing"; children: React.ReactNode }) {
  return (
    <div className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${
      type === "conflict" ? "border-destructive/20 bg-destructive/5 text-destructive" : "border-amber-200 bg-amber-50 text-amber-700"
    }`}>
      <span className="mt-px shrink-0">{type === "conflict" ? "⚠" : "○"}</span>
      <span>{children}</span>
    </div>
  );
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

function formatEventDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
