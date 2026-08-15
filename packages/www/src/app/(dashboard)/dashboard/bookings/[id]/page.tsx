export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Booking Detail</h1>
    </div>
  );
}
