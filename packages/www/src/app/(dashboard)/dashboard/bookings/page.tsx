"use client";

import { Badge } from "@/components/ui/badge";
import { gql, useQuery } from "@apollo/client";

const BOOKINGS = gql`
  query ActiveBookings {
    bookings(status: PENCILLED) {
      id
      promoter
      venue
      city
      country
      proposedDate
      rawFee
      currencyCode
      status
      artist {
        id
        name
      }
    }
  }
`;

const STATUS_COLORS: Record<string, string> = {
  PENCILLED: "bg-yellow-50 text-yellow-700 border-yellow-200",
  SENT_TO_ARTIST: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CONFIRMED: "bg-green-50 text-green-700 border-green-200",
  CONTRACTED: "bg-purple-50 text-purple-700 border-purple-200",
};

const STATUS_LABELS: Record<string, string> = {
  PENCILLED: "Pencilled",
  SENT_TO_ARTIST: "Sent to artist",
  APPROVED: "Approved",
  CONFIRMED: "Confirmed",
  CONTRACTED: "Contracted",
};

interface BookingRow {
  id: string;
  promoter: string | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  proposedDate: string | null;
  rawFee: string | null;
  currencyCode: string | null;
  status: string;
  artist: { id: string; name: string } | null;
}

export default function BookingsPage() {
  const { data, loading } = useQuery(BOOKINGS);
  const bookings: BookingRow[] = data?.bookings ?? [];

  return (
    <div className="h-full overflow-y-auto p-6">
      {loading && !data && (
        <div className="text-sm text-muted-foreground">Loading...</div>
      )}

      {bookings.length === 0 && !loading && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No active bookings</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Pencil a request to see it here
            </p>
          </div>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Artist</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Event / Venue</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Location</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Fee</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {b.artist?.name ?? "Unmatched"}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {b.venue ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {[b.city, b.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {b.proposedDate
                      ? new Date(b.proposedDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "TBC"}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {b.rawFee ?? "—"}
                  </td>
                  <td className="px-4 py-3">
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
        </div>
      )}
    </div>
  );
}
