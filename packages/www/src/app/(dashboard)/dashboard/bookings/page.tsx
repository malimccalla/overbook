export default function BookingsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">Bookings</h1>
      </div>
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-16">
        <p className="text-sm text-zinc-500">No confirmed bookings yet</p>
        <p className="mt-1 text-xs text-zinc-400">
          Confirm a booking request to see it here
        </p>
      </div>
    </div>
  );
}
