"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

import { RequestDetail } from "./_components/request-detail";
import { RequestQueue } from "./_components/request-queue";

const BOOKINGS = gql`
  query Bookings {
    bookings {
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
      updatedAt
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

const UPDATE_STATUS = gql`
  mutation UpdateBookingStatus($id: String!, $status: BookingStatus!) {
    updateBookingStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export default function RequestsPage() {
  const { data, loading, refetch } = useQuery(BOOKINGS, {
    pollInterval: 30000,
  });
  const [updateStatus] = useMutation(UPDATE_STATUS, { onCompleted: () => refetch() });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const requests = data?.bookings ?? [];
  const selectedRequest = requests.find(
    (r: { id: string }) => r.id === selectedId
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Queue pane */}
        <div className="w-[340px] min-w-[300px] max-w-[400px] flex-shrink-0 overflow-y-auto border-r">
          <RequestQueue
            requests={requests}
            loading={loading}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Detail pane */}
        <div className="flex-1 overflow-y-auto">
          {selectedRequest ? (
            <RequestDetail
              request={selectedRequest}
              onDismiss={() => updateStatus({ variables: { id: selectedRequest.id, status: 'DECLINED' } })}
              onCreateBooking={() => updateStatus({ variables: { id: selectedRequest.id, status: 'PENCILLED' } })}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Select a request to review
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
