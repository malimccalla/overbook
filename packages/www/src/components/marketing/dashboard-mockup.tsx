export function DashboardMockup() {
  return (
    <div className="px-3">
      <div className="overflow-hidden rounded-t-2xl border border-b-0 border-gray-200 shadow-2xl">
        {/* Browser chrome */}
        <div className="flex h-9 items-center gap-2 border-b border-gray-200 bg-gray-100 px-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex h-5 flex-1 items-center rounded-md border border-gray-200 bg-white px-3 text-[10px] text-gray-400">
            app.overbook.io/requests
          </div>
        </div>

        {/* OS-style gutter */}
        <div className="bg-gray-100 p-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-[11px]">
            {/* App header */}
            <div className="flex h-10 items-center border-b border-gray-200">
              <div className="flex h-full w-48 shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-[#ee4d2d]">
                    <span className="text-[9px] font-bold text-white">O</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900">
                    Elastic Artists
                  </span>
                </div>
              </div>
              <div className="flex h-full flex-1 items-center justify-between bg-white px-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-900">
                    Booking Requests
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                    4 need review
                  </span>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-600">
                  SK
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex h-[460px]">
              {/* Sidebar */}
              <div className="flex w-48 shrink-0 flex-col border-r border-gray-200 bg-gray-50 px-2.5 py-3">
                <nav className="space-y-0.5">
                  {[
                    { label: "Overview", active: false },
                    { label: "Requests", active: true, badge: "4" },
                    { label: "Bookings", active: false },
                    { label: "Roster", active: false },
                    { label: "Calendar", active: false },
                  ].map(({ label, active, badge }) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between rounded-md px-2.5 py-1.5 font-medium ${
                        active
                          ? "border border-gray-200 bg-white text-gray-900 shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      {label}
                      {badge && (
                        <span className="rounded-full bg-[#ee4d2d] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                          {badge}
                        </span>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="mt-auto border-t border-gray-200 pt-3">
                  <div className="rounded-md px-2.5 py-1.5 text-gray-500">
                    Settings
                  </div>
                </div>
              </div>

              {/* Main content — Review Queue */}
              <div className="flex-1 overflow-hidden bg-white p-4">
                {/* Filter row */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md border border-gray-200 px-2.5 py-1 text-gray-500">
                      All statuses
                    </div>
                    <div className="rounded-md border border-gray-200 px-2.5 py-1 text-gray-500">
                      All artists
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Showing 6 requests
                  </div>
                </div>

                {/* Request table */}
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.7fr_0.6fr_90px] border-b border-gray-100 bg-gray-50 px-3 py-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    <span>Artist</span>
                    <span>Promoter / Venue</span>
                    <span>Date</span>
                    <span>Fee</span>
                    <span>Confidence</span>
                    <span>Status</span>
                  </div>
                  {[
                    {
                      artist: "Dan Shake",
                      promoter: "Fabric · London",
                      date: "14 Sep 2025",
                      fee: "£2,500",
                      confidence: 94,
                      status: "Needs review",
                      statusColor: "text-amber-600 bg-amber-50",
                      missing: false,
                    },
                    {
                      artist: "TENNIN",
                      promoter: "Trouw · Amsterdam",
                      date: "22 Sep 2025",
                      fee: "€1,800",
                      confidence: 87,
                      status: "Needs review",
                      statusColor: "text-amber-600 bg-amber-50",
                      missing: true,
                    },
                    {
                      artist: "OUO",
                      promoter: "Boiler Room · Berlin",
                      date: "5 Oct 2025",
                      fee: "£3,200",
                      confidence: 91,
                      status: "Needs review",
                      statusColor: "text-amber-600 bg-amber-50",
                      missing: false,
                    },
                    {
                      artist: "Eli Verano",
                      promoter: "XOYO · London",
                      date: "TBC",
                      fee: "£1,400",
                      confidence: 62,
                      status: "Needs review",
                      statusColor: "text-amber-600 bg-amber-50",
                      missing: true,
                    },
                    {
                      artist: "Gensai",
                      promoter: "Warehouse Project · Manchester",
                      date: "2 Nov 2025",
                      fee: "£4,000",
                      confidence: 96,
                      status: "Captured",
                      statusColor: "text-emerald-600 bg-emerald-50",
                      missing: false,
                    },
                    {
                      artist: "From:Ksusha",
                      promoter: "De School · Berlin",
                      date: "9 Nov 2025",
                      fee: "€2,200",
                      confidence: 89,
                      status: "Captured",
                      statusColor: "text-emerald-600 bg-emerald-50",
                      missing: false,
                    },
                  ].map((row) => (
                    <div
                      key={row.artist}
                      className="grid grid-cols-[1.2fr_1fr_0.8fr_0.7fr_0.6fr_90px] items-center border-b border-gray-50 px-3 py-2.5 last:border-0 hover:bg-gray-50/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {row.artist}
                        </span>
                        {row.missing && (
                          <span className="rounded bg-red-50 px-1 py-0.5 text-[9px] font-medium text-red-500">
                            missing fields
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500">{row.promoter}</span>
                      <span className={`text-gray-500 ${row.date === "TBC" ? "italic text-amber-500" : ""}`}>
                        {row.date}
                      </span>
                      <span className="font-medium text-gray-900">
                        {row.fee}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 w-8 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full ${row.confidence >= 90 ? "bg-emerald-400" : row.confidence >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                            style={{ width: `${row.confidence}%` }}
                          />
                        </div>
                        <span className="text-gray-400">{row.confidence}%</span>
                      </div>
                      <span
                        className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
