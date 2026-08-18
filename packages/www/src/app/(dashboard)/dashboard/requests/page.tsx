"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

import { EmailInput } from "./_components/email-input";
import { RequestDetail } from "./_components/request-detail";
import { RequestQueue } from "./_components/request-queue";

const BOOKING_REQUESTS = gql`
  query BookingRequests {
    bookingRequests {
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

const PROCESS_EMAIL = gql`
  mutation ProcessEmail($emailText: String!) {
    processEmail(emailText: $emailText) {
      id
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

export default function RequestsPage() {
  const { data, loading, refetch } = useQuery(BOOKING_REQUESTS, {
    pollInterval: 30000,
  });
  const [processEmail, { loading: processing }] = useMutation(PROCESS_EMAIL, {
    onCompleted: () => refetch(),
  });
  const [dismiss] = useMutation(DISMISS, { onCompleted: () => refetch() });
  const [createBooking] = useMutation(CREATE_BOOKING, {
    onCompleted: () => refetch(),
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const requests = data?.bookingRequests ?? [];
  const selectedRequest = requests.find(
    (r: { id: string }) => r.id === selectedId
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Queue pane */}
        <div className="w-[400px] min-w-[340px] max-w-[480px] flex-shrink-0 overflow-y-auto border-r">
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
              onDismiss={() => dismiss({ variables: { id: selectedRequest.id } })}
              onCreateBooking={() =>
                createBooking({
                  variables: { bookingRequestId: selectedRequest.id },
                })
              }
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

      {/* Email input */}
      <EmailInput processing={processing} onSubmit={(text) => processEmail({ variables: { emailText: text } })} />
    </div>
  );
}
