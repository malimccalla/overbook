"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const BOOKING_REQUEST = gql`
  query BookingRequest($id: String!) {
    bookingRequest(id: $id) {
      id
      promoter
      promoterEmail
      venue
      city
      country
      proposedDate
      proposedDateRaw
      feeAmount
      currencyCode
      rawFee
      status
      confidence
      missingFields
      conflictFlags
      summary
      notes
      recommendedNextAction
      details
      createdAt
      artist {
        id
        name
      }
      rawEmail {
        subject
        fromEmail
        fromName
        bodyText
        receivedAt
      }
    }
  }
`;

const DISMISS = gql`
  mutation Dismiss($id: String!) {
    dismissBookingRequest(id: $id) {
      id
      status
    }
  }
`;

const CREATE_BOOKING = gql`
  mutation CreateBooking($bookingRequestId: String!) {
    createBooking(bookingRequestId: $bookingRequestId) {
      id
    }
  }
`;

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading } = useQuery(BOOKING_REQUEST, { variables: { id } });
  const [dismiss] = useMutation(DISMISS);
  const [createBooking] = useMutation(CREATE_BOOKING);

  if (loading) return <div className="p-8 text-sm text-zinc-400">Loading...</div>;

  const req = data?.bookingRequest;
  if (!req) return <div className="p-8 text-sm text-zinc-500">Not found</div>;

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/requests" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Back to requests
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">
          {req.artist?.name ?? "Unknown Artist"}
        </h1>
        <StatusBadge status={req.status} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-zinc-200 bg-white p-5">
        <Field label="Promoter" value={req.promoter} />
        <Field label="Email" value={req.promoterEmail} />
        <Field label="Venue" value={req.venue} />
        <Field label="City" value={[req.city, req.country].filter(Boolean).join(", ")} />
        <Field
          label="Date"
          value={
            req.proposedDate
              ? new Date(req.proposedDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : req.proposedDateRaw
          }
        />
        <Field label="Fee" value={req.rawFee} />
        <Field label="Currency" value={req.currencyCode} />
        <Field label="Confidence" value={req.confidence != null ? `${(req.confidence * 100).toFixed(0)}%` : null} />
      </div>

      {(req.missingFields?.length > 0 || req.conflictFlags?.length > 0) && (
        <div className="mt-4 flex gap-4">
          {req.missingFields?.length > 0 && (
            <div className="flex-1 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-medium uppercase text-amber-700">Missing Fields</p>
              <p className="mt-1 text-sm text-amber-800">{req.missingFields.join(", ")}</p>
            </div>
          )}
          {req.conflictFlags?.length > 0 && (
            <div className="flex-1 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-xs font-medium uppercase text-red-700">Conflicts</p>
              <p className="mt-1 text-sm text-red-800">{req.conflictFlags.join(", ")}</p>
            </div>
          )}
        </div>
      )}

      {req.rawEmail && (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-xs font-medium uppercase text-zinc-500">Source Email</p>
          <p className="mt-2 text-sm font-medium text-zinc-800">{req.rawEmail.subject}</p>
          <p className="mt-1 text-xs text-zinc-500">
            From: {req.rawEmail.fromName} &lt;{req.rawEmail.fromEmail}&gt;
          </p>
          <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded bg-zinc-50 p-3 text-xs text-zinc-700">
            {req.rawEmail.bodyText}
          </pre>
        </div>
      )}

      {req.status === "NEEDS_REVIEW" && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={async () => {
              await createBooking({ variables: { bookingRequestId: req.id } });
              router.push("/requests");
            }}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Create Booking
          </button>
          <button
            onClick={async () => {
              await dismiss({ variables: { id: req.id } });
              router.push("/requests");
            }}
            className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-zinc-500">{label}</p>
      <p className="mt-0.5 text-sm text-zinc-900">{value || "—"}</p>
    </div>
  );
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
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? "bg-zinc-100 text-zinc-600"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
