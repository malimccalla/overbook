"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";

const BOOKING_REQUESTS = gql`
  query BookingRequests {
    bookingRequests {
      id
      promoter
      venue
      city
      country
      proposedDate
      feeAmount
      currencyCode
      rawFee
      status
      missingFields
      conflictFlags
      createdAt
      artist {
        name
      }
    }
  }
`;

const PROCESS_EMAIL = gql`
  mutation ProcessEmail($emailText: String!) {
    processEmail(emailText: $emailText) {
      id
    }
  }
`;

export default function RequestsPage() {
  const { data, loading, error, refetch } = useQuery(BOOKING_REQUESTS, {
    pollInterval: 30000,
  });
  const [processEmail, { loading: processing }] = useMutation(PROCESS_EMAIL, {
    onCompleted: () => {
      setEmailText("");
      refetch();
    },
  });
  const [emailText, setEmailText] = useState("");

  const handleSubmit = () => {
    if (!emailText.trim() || processing) return;
    processEmail({ variables: { emailText: emailText.trim() } });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">
          Booking Requests
        </h1>
        {data?.bookingRequests && (
          <span className="text-sm text-zinc-500">
            {data.bookingRequests.length} request
            {data.bookingRequests.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {loading && !data && (
        <div className="mt-8 text-sm text-zinc-400">Loading...</div>
      )}

      {error && (
        <div className="mt-8 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error.message}
        </div>
      )}

      {data?.bookingRequests?.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-16">
          <p className="text-sm text-zinc-500">No booking requests yet</p>
          <p className="mt-1 text-xs text-zinc-400">
            Requests will appear here when emails are processed
          </p>
        </div>
      )}

      {data?.bookingRequests?.length > 0 && (
        <div className="mt-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                <th className="pb-3 pr-4">Artist</th>
                <th className="pb-3 pr-4">Promoter / Venue</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Fee</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Signals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.bookingRequests.map((req: BookingRequestRow) => (
                <tr key={req.id} className="group hover:bg-zinc-50">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/requests/${req.id}`}
                      className="font-medium text-zinc-900 group-hover:text-blue-600"
                    >
                      {req.artist?.name ?? "Unknown"}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-sm text-zinc-600">
                    {[req.promoter, req.venue, req.city]
                      .filter(Boolean)
                      .join(" · ")}
                  </td>
                  <td className="py-3 pr-4 text-sm text-zinc-600">
                    {req.proposedDate
                      ? new Date(req.proposedDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="py-3 pr-4 text-sm text-zinc-600">
                    {req.rawFee ?? "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-1">
                      {req.conflictFlags?.length > 0 && (
                        <Signal label="Conflict" color="red" />
                      )}
                      {req.missingFields?.length > 0 && (
                        <Signal label="Incomplete" color="amber" />
                      )}
                      {req.conflictFlags?.length === 0 &&
                        req.missingFields?.length === 0 && (
                          <Signal label="Strong" color="green" />
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {/* Chat-style email input */}
      <div className="border-t border-zinc-200 bg-white px-8 py-4">
        <div className="mx-auto max-w-[720px]">
          {processing ? (
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
              <span className="text-sm text-zinc-500">
                Processing email through agent pipeline...
              </span>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200 focus-within:border-zinc-400">
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) handleSubmit();
                }}
                placeholder="Paste a booking email..."
                rows={emailText.includes("\n") ? 4 : 1}
                className="w-full resize-none border-0 bg-white px-4 pt-3 pb-2 text-sm placeholder:text-zinc-400 focus:outline-none"
              />
              <div className="flex items-center justify-between bg-white px-3 pb-2">
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="8" y1="3" x2="8" y2="13" />
                    <line x1="3" y1="8" x2="13" y2="8" />
                  </svg>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!emailText.trim()}
                  className="flex h-7 items-center gap-1.5 rounded-md bg-zinc-900 px-3 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface BookingRequestRow {
  id: string;
  promoter: string | null;
  venue: string | null;
  city: string | null;
  proposedDate: string | null;
  rawFee: string | null;
  status: string;
  missingFields: string[];
  conflictFlags: string[];
  artist: { name: string } | null;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NEEDS_REVIEW: "bg-blue-50 text-blue-700",
    CAPTURED: "bg-green-50 text-green-700",
    DISMISSED: "bg-zinc-100 text-zinc-500",
    INFO_REQUESTED: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-zinc-100 text-zinc-600"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function Signal({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${colors[color]}`}
    >
      {label}
    </span>
  );
}
