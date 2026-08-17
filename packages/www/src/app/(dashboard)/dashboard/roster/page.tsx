export default function RosterPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">Roster</h1>
      </div>
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-16">
        <p className="text-sm text-zinc-500">No artists on roster yet</p>
        <p className="mt-1 text-xs text-zinc-400">
          Add artists to manage their bookings
        </p>
      </div>
    </div>
  );
}
