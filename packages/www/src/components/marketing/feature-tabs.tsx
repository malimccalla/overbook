"use client";

import { useState } from "react";

const tabs = [
  {
    id: "bookings",
    label: "Bookings",
    headline: "From inbox to offer, in seconds.",
    description:
      "AI-powered intake captures inbound offers from email, extracts key details, matches them to your roster, and queues everything for review — so nothing slips through the cracks.",
    features: [
      "Automatic offer extraction from emails",
      "Roster matching with confidence scoring",
      "Completeness checks flag missing details",
      "One-click capture, pencil, or dismiss",
    ],
  },
  {
    id: "scheduling",
    label: "Scheduling",
    headline: "See every conflict before it happens.",
    description:
      "A unified calendar across your entire roster shows availability at a glance. Overbook detects date conflicts, routing concerns, and radius clause violations the moment an offer lands.",
    features: [
      "Roster-wide calendar view",
      "Automatic conflict detection",
      "Radius clause awareness",
      "Hold and pencil management",
    ],
  },
  {
    id: "logistics",
    label: "Logistics",
    headline: "Route planning that thinks like an agent.",
    description:
      "Plan A-to-B routing across multi-date runs, flag radius clause risks, and coordinate travel logistics — all from the booking record.",
    features: [
      "Multi-date route visualisation",
      "Radius clause flagging",
      "Travel and accommodation tracking",
      "Per-show logistics notes",
    ],
  },
  {
    id: "contracts",
    label: "Contracts",
    headline: "Contracts out the door, not stuck in drafts.",
    description:
      "Generate contracts from booking data, send for e-signature, and track status — from contract requested through to fully executed.",
    features: [
      "Auto-generated contract drafts",
      "E-signature integration",
      "Status tracking per booking",
      "Template management",
    ],
  },
  {
    id: "invoicing",
    label: "Invoicing",
    headline: "Get paid without the chase.",
    description:
      "Create invoices directly from confirmed bookings, track payment status, and keep your financials in sync with your booking pipeline.",
    features: [
      "One-click invoice from booking",
      "Payment status tracking",
      "Overdue payment alerts",
      "Financial reporting per artist",
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    headline: "Know your numbers before the promoter does.",
    description:
      "Per-artist breakdowns, pipeline conversion rates, and revenue tracking — all in real time. See which offers convert, which artists are most in demand, and where money is being left on the table.",
    features: [
      "Inquiry-to-confirmed show conversion rate",
      "Per-artist revenue and confirmed show count",
      "Most booked artists and peak periods",
      "Pipeline value and average deal size",
    ],
  },
] as const;

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<string>("bookings");
  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0];
  const tabIds = tabs.map((t) => t.id);
  const activeIndex = tabIds.indexOf(activeTab);
  const prev = () => setActiveTab(tabIds[(activeIndex - 1 + tabIds.length) % tabIds.length]);
  const next = () => setActiveTab(tabIds[(activeIndex + 1) % tabIds.length]);

  return (
    <section className="w-full border-t border-ink">
      <div className="px-[clamp(1.25rem,4vw,4.75rem)] py-[clamp(4.5rem,10vw,10rem)]">
        <p className="mb-8 font-mono text-[0.7rem] font-bold uppercase">
          Platform
        </p>
        <h2 className="mb-4 max-w-[900px] text-[clamp(2rem,4.4vw,4.8rem)] font-medium leading-[1.08]">
          Everything a booking agency needs.
        </h2>
        <p className="mb-12 max-w-[38rem] text-muted">
          One platform from first inquiry to final settlement.
        </p>

        {/* Tab bar + content as a bordered unit */}
        <div className="border border-ink">
          <div className="flex items-stretch">
            <div className="flex flex-1 gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-r border-ink px-6 py-4 font-mono text-xs uppercase transition-colors ${
                    activeTab === tab.id
                      ? "bg-ink text-paper"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/icons/${tab.id}.svg`}
                    alt=""
                    width={16}
                    height={16}
                    className={activeTab === tab.id ? "" : "invert"}
                  />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-0 border-l border-ink">
              <button
                onClick={prev}
                aria-label="Previous tab"
                className="flex h-full w-12 items-center justify-center border-r border-ink transition-colors hover:bg-ink hover:text-paper"
              >
                ←
              </button>
              <button
                onClick={next}
                aria-label="Next tab"
                className="flex h-full w-12 items-center justify-center transition-colors hover:bg-ink hover:text-paper"
              >
                →
              </button>
            </div>
          </div>

          <div className="px-[clamp(1.5rem,3vw,3rem)] py-[clamp(2rem,4vw,4rem)]">
          <div className="grid gap-12 md:grid-cols-[4fr_6fr] md:items-start">
            <div>
            <h3 className="mb-4 text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-tight">
              {active.headline}
            </h3>
            <p className="mb-6 text-muted">{active.description}</p>
            <ul className="space-y-2">
              {active.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm"
                >
                  <span className="mt-0.5 text-red">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            </div>

          {/* Tab preview mockup */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <TabPreview tab={active.id} />
          </div>
        </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const bookingRows = [
  { artist: "Dan Shake", flag: null, promoter: "Fabric · London", date: "14 Sep", fee: "£2,500", conf: 94,
    fields: [{ label: "Artist", value: "Dan Shake", ok: true }, { label: "Venue", value: "Fabric, London", ok: true }, { label: "Date", value: "14 Sep 2025", ok: true }, { label: "Fee", value: "£2,500", ok: true }, { label: "Set time", value: "23:00–01:00", ok: true }, { label: "Agency fee on top", value: "Yes", ok: true }, { label: "Hotel", value: "—", ok: false }, { label: "Promoter contact", value: "Craig R.", ok: true }],
    email: "Hey, we'd love to have Dan Shake headline Stage 2 on 14th September. Fee is £2,500 + agency fee. Let us know. — Craig" },
  { artist: "TENNIN", flag: "missing fields", promoter: "Trouw · Amsterdam", date: "22 Sep", fee: "€1,800", conf: 87,
    fields: [{ label: "Artist", value: "TENNIN", ok: true }, { label: "Venue", value: "Trouw, Amsterdam", ok: true }, { label: "Date", value: "22 Sep 2025", ok: true }, { label: "Fee", value: "€1,800", ok: true }, { label: "Set time", value: "—", ok: false }, { label: "Agency fee on top", value: "—", ok: false }, { label: "Hotel", value: "—", ok: false }, { label: "Promoter contact", value: "Jan de Boer", ok: true }],
    email: "Hi, we'd love to have TENNIN play our September party at Trouw Amsterdam. We're thinking 22nd September. Budget is €1,800 all-in. — Jan" },
  { artist: "OUO", flag: null, promoter: "Boiler Room · Berlin", date: "5 Oct", fee: "£3,200", conf: 91,
    fields: [{ label: "Artist", value: "OUO", ok: true }, { label: "Venue", value: "Boiler Room, Berlin", ok: true }, { label: "Date", value: "5 Oct 2025", ok: true }, { label: "Fee", value: "£3,200", ok: true }, { label: "Set time", value: "21:00–23:00", ok: true }, { label: "Agency fee on top", value: "Yes", ok: true }, { label: "Hotel", value: "Michelberger", ok: true }, { label: "Promoter contact", value: "Boiler Room team", ok: true }],
    email: "Hey — would OUO be available for Boiler Room Berlin on 5th Oct? Budget £3,200 all-in. Full production provided." },
  { artist: "Eli Verano", flag: "missing fields", promoter: "XOYO · London", date: "TBC", fee: "£1,400", conf: 62,
    fields: [{ label: "Artist", value: "Eli Verano", ok: true }, { label: "Venue", value: "XOYO, London", ok: true }, { label: "Date", value: "—", ok: false }, { label: "Fee", value: "£1,400", ok: true }, { label: "Set time", value: "—", ok: false }, { label: "Agency fee on top", value: "—", ok: false }, { label: "Hotel", value: "—", ok: false }, { label: "Promoter contact", value: "—", ok: false }],
    email: "Hi, interested in booking Eli Verano for XOYO sometime in October/November. Budget around £1,400. Date TBC — we're still confirming the lineup." },
];

function BookingsPreview() {
  const [expanded, setExpanded] = useState<number | null>(1);
  return (
    <div className="bg-white text-[11px]">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div>
          <span className="text-sm font-semibold text-gray-900">Booking Requests</span>
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">4 need review</span>
        </div>
        <div className="flex gap-2">
          <div className="rounded-md border border-gray-200 px-2.5 py-1 text-gray-500">Filter</div>
          <div className="rounded-md border border-gray-200 px-2.5 py-1 text-gray-500">All artists</div>
        </div>
      </div>
      <div className="grid grid-cols-[1.4fr_1fr_0.7fr_0.7fr_0.5fr_80px] border-b border-gray-100 bg-gray-50 px-5 py-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
        <span>Artist</span><span>Promoter / Venue</span><span>Date</span><span>Fee</span><span>Confidence</span><span>Status</span>
      </div>
      {bookingRows.map((r, i) => (
        <div key={r.artist}>
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className={`grid w-full grid-cols-[1.4fr_1fr_0.7fr_0.7fr_0.5fr_80px] items-center border-b px-5 py-2.5 text-left transition-colors ${
              expanded === i ? "border-blue-100 bg-blue-50/50" : "border-gray-50 hover:bg-gray-50/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{r.artist}</span>
              {r.flag && <span className="rounded bg-red-50 px-1 py-0.5 text-[9px] font-medium text-red-500">{r.flag}</span>}
            </div>
            <span className="text-gray-500">{r.promoter}</span>
            <span className={r.date === "TBC" ? "italic text-amber-500" : "text-gray-500"}>{r.date}</span>
            <span className="font-medium text-gray-900">{r.fee}</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-8 overflow-hidden rounded-full bg-gray-200">
                <div className={`h-full rounded-full ${r.conf >= 90 ? "bg-emerald-400" : r.conf >= 75 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${r.conf}%` }} />
              </div>
              <span className="text-gray-400">{r.conf}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex w-fit rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">Review</span>
              <span className="text-gray-400">{expanded === i ? "▲" : "▼"}</span>
            </div>
          </button>
          {expanded === i && (
            <div className="border-b border-blue-100 bg-blue-50/30 px-5 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-gray-900">{r.artist} — {r.promoter} · {r.date}</span>
                <div className="flex gap-1.5">
                  <div className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-gray-700 ring-1 ring-gray-200">View on calendar</div>
                  <div className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-gray-700 ring-1 ring-gray-200">Request info</div>
                  <div className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-gray-700 ring-1 ring-gray-200">Dismiss</div>
                  <div className="rounded-md bg-[#ee4d2d] px-2 py-1 text-[10px] font-medium text-white">Create booking →</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {r.fields.map((f) => (
                  <div key={f.label} className={`rounded p-2 ${f.ok ? "bg-white" : "bg-red-50"}`}>
                    <div className="text-[9px] text-gray-400">{f.label}</div>
                    <div className={`mt-0.5 text-[10px] font-medium ${f.ok ? "text-gray-900" : "text-red-400"}`}>{f.value === "—" ? "Missing" : f.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded border border-gray-100 bg-white p-2 text-[10px] text-gray-500 leading-relaxed">
                <span className="font-medium text-gray-700">Source email: </span>{r.email}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TabPreview({ tab }: { tab: string }) {
  switch (tab) {
    case "bookings":
      return <BookingsPreview />;


    case "scheduling":
      return (
        <div className="min-h-[340px] bg-white text-[11px]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <div>
              <span className="text-sm font-semibold text-gray-900">Week view</span>
              <span className="ml-2 text-gray-400">8–14 Sep 2025</span>
            </div>
            <div className="flex gap-2">
              <div className="rounded border border-gray-200 px-2.5 py-1 text-gray-500">← Prev</div>
              <div className="rounded border border-gray-200 bg-gray-50 px-2.5 py-1 font-medium text-gray-700">All artists</div>
              <div className="rounded border border-gray-200 px-2.5 py-1 text-gray-500">Next →</div>
            </div>
          </div>
          {/* Week grid — Google Calendar style */}
          <div className="px-4 pt-3">
            <div className="mb-1 grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-px text-[9px] font-medium uppercase text-gray-400">
              <span />
              {["Mon 8", "Tue 9", "Wed 10", "Thu 11", "Fri 12", "Sat 13", "Sun 14"].map(d => (
                <div key={d} className={`py-1 text-center ${d === "Sat 13" ? "font-bold text-[#ee4d2d]" : ""}`}>{d}</div>
              ))}
            </div>
            <div className="border-t border-gray-100">
              {["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00"].map(t => (
                <div key={t} className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-px border-b border-gray-50">
                  <div className="pr-2 pt-1 text-right text-[9px] text-gray-300">{t}</div>
                  {[
                    { d: "Mon 8", slot: t, show: t === "22:00" ? { a: "OUO", v: "Corsica", c: "blue" } : null },
                    { d: "Tue 9", slot: t, show: null },
                    { d: "Wed 10", slot: t, show: null },
                    { d: "Thu 11", slot: t, show: null },
                    { d: "Fri 12", slot: t, show: t === "22:00" ? { a: "Dan Shake", v: "Fabric", c: "emerald" } : null },
                    { d: "Sat 13", slot: t, show: t === "22:00" ? { a: "TENNIN", v: "Trouw", c: "emerald" } : t === "00:00" ? { a: "Gensai", v: "WHP", c: "purple" } : null },
                    { d: "Sun 14", slot: t, show: null },
                  ].map(cell => (
                    <div key={cell.d} className={`h-6 ${cell.d === "Sat 13" ? "bg-orange-50/30" : ""}`}>
                      {cell.show && (
                        <div className={`mx-0.5 h-full rounded px-1 text-[8px] font-medium flex items-center truncate ${
                          cell.show.c === "emerald" ? "bg-emerald-100 text-emerald-700" :
                          cell.show.c === "blue" ? "bg-blue-100 text-blue-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>{cell.show.a}</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "logistics":
      return (
        <div className="min-h-[340px] bg-white text-[11px]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <span className="text-sm font-semibold text-gray-900">Dan Shake — Advancing sheet</span>
            <div className="rounded-md bg-[#ee4d2d] px-3 py-1.5 text-[10px] font-medium text-white">Fabric · Fri 12 Sep</div>
          </div>
          {/* Itinerary timeline */}
          <div className="px-5 pt-4">
            <div className="mb-3 text-[10px] font-medium uppercase tracking-wide text-gray-400">Day itinerary — 12 Sep 2025</div>
            {[
              { time: "14:00", label: "Flight", detail: "LHR → none (London show — no travel)", icon: "✈", ok: true },
              { time: "16:00", label: "Check-in", detail: "The Hoxton, Southwark (booked)", icon: "🏨", ok: true },
              { time: "18:00", label: "Load in / sound check", detail: "Fabric · 77A Charterhouse St, EC1M 3HN", icon: "🔊", ok: true },
              { time: "22:00", label: "Set time", detail: "Stage 2 · 22:00–00:00 (2 hrs)", icon: "🎛", ok: true },
              { time: "00:30", label: "Ground transport", detail: "Car from venue to hotel — not yet arranged", icon: "🚗", ok: false },
            ].map(item => (
              <div key={item.time} className="flex gap-3 border-t border-gray-100 py-2.5">
                <span className="w-10 shrink-0 font-mono text-[10px] text-gray-400">{item.time}</span>
                <span className="w-4 shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{item.label}</span>
                  <span className={`ml-2 ${item.ok ? "text-gray-500" : "italic text-amber-500"}`}>{item.detail}</span>
                </div>
                {!item.ok && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-600">To do</span>}
              </div>
            ))}
          </div>
          {/* Rider / tech specs — from artist record */}
          <div className="mx-5 mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-gray-900">Tech rider — auto-attached from artist record</span>
              <span className="text-[10px] text-emerald-600">Sent to promoter ✓</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["DJ setup", "2× CDJ-3000, DJM-900NXS2"],
                ["Monitoring", "2× wedge monitors (stage return)"],
                ["Hotel", "Single room, non-smoking"],
                ["Hospitality", "6× still water, light rider"],
              ].map(([k, v]) => (
                <div key={k} className="rounded bg-white p-2 ring-1 ring-gray-100">
                  <div className="text-[9px] text-gray-400">{k}</div>
                  <div className="mt-0.5 text-gray-700">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "contracts":
      return (
        <div className="min-h-[340px] bg-white text-[11px]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <span className="text-sm font-semibold text-gray-900">Contracts</span>
            <div className="rounded-md bg-ink px-3 py-1.5 text-[10px] font-medium text-white">+ Generate contract</div>
          </div>
          {/* Status summary */}
          <div className="grid grid-cols-4 gap-3 p-5">
            {[
              { label: "Awaiting generation", value: "3", color: "bg-gray-100 text-gray-600" },
              { label: "Sent for signature", value: "4", color: "bg-blue-50 text-blue-700" },
              { label: "Signed", value: "12", color: "bg-emerald-50 text-emerald-700" },
              { label: "Overdue", value: "1", color: "bg-red-50 text-red-600" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-gray-100 p-3">
                <div className={`mb-1 text-xs font-semibold rounded-full w-fit px-2 py-0.5 ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Contracts list — hover state on OUO row */}
          <div className="px-5">
            <div className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.7fr_90px] border-b border-gray-100 pb-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
              <span>Artist</span><span>Booking</span><span>Fee</span><span>Sent</span><span>Status</span>
            </div>
            {[
              { artist: "Dan Shake", venue: "Fabric · 10 Oct", fee: "£2,500", sent: "2 Aug", status: "Signed", sc: "text-emerald-600 bg-emerald-50", hover: false },
              { artist: "TENNIN", venue: "Trouw · 22 Sep", fee: "€1,800", sent: "4 Aug", status: "Signed", sc: "text-emerald-600 bg-emerald-50", hover: false },
              { artist: "OUO", venue: "Boiler Rm · 5 Oct", fee: "£3,200", sent: "5 Aug", status: "Awaiting sig.", sc: "text-blue-600 bg-blue-50", hover: true },
              { artist: "Gensai", venue: "WHP · 2 Nov", fee: "£4,000", sent: "6 Aug", status: "Awaiting sig.", sc: "text-blue-600 bg-blue-50", hover: false },
              { artist: "From:Ksusha", venue: "De School · 9 Nov", fee: "€2,200", sent: "—", status: "Not generated", sc: "text-gray-400 bg-gray-100", hover: false },
              { artist: "Eli Verano", venue: "XOYO · 18 Jan", fee: "£1,800", sent: "—", status: "Not generated", sc: "text-gray-400 bg-gray-100", hover: false },
            ].map(r => (
              <div key={r.artist + r.venue} className={`grid grid-cols-[1.2fr_1.2fr_0.8fr_0.7fr_90px] items-center border-b border-gray-50 py-2.5 ${
                r.hover ? "bg-blue-50/60" : "hover:bg-gray-50"
              }`}>
                <span className="font-medium text-gray-900">{r.artist}</span>
                {/* Booking record link with icon */}
                <span className="flex items-center gap-1.5 text-gray-500">
                  <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0 text-[#ee4d2d]" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="2" /><rect x="5" y="5" width="6" height="1.5" rx="0.75" fill="white" /><rect x="5" y="7.5" width="4" height="1.5" rx="0.75" fill="white" /><rect x="5" y="10" width="6" height="1.5" rx="0.75" fill="white" /></svg>
                  {r.venue}
                </span>
                <span className="font-medium text-gray-900">{r.fee}</span>
                <span className="text-gray-400">{r.sent}</span>
                {r.hover ? (
                  <div className="inline-flex w-fit cursor-pointer rounded-full bg-[#ee4d2d] px-2 py-0.5 text-[10px] font-medium text-white">Send for sig. →</div>
                ) : (
                  <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${r.sc}`}>{r.status}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "invoicing":
      return (
        <div className="min-h-[340px] bg-white text-[11px]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <span className="text-sm font-semibold text-gray-900">Invoices</span>
            <div className="rounded-md bg-ink px-3 py-1.5 text-[10px] font-medium text-white">+ New invoice</div>
          </div>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 p-5">
            {[
              { label: "Outstanding", value: "£14,200", sub: "3 invoices", color: "text-amber-600" },
              { label: "Overdue", value: "€2,200", sub: "1 invoice", color: "text-red-600" },
              { label: "Collected (30d)", value: "£23,400", sub: "6 invoices", color: "text-emerald-600" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-gray-100 p-3">
                <div className="text-[10px] text-gray-400">{s.label}</div>
                <div className={`mt-1 text-base font-semibold ${s.color}`}>{s.value}</div>
                <div className="text-[9px] text-gray-400">{s.sub}</div>
              </div>
            ))}
          </div>
          {/* Invoices table */}
          <div className="px-5">
            <div className="grid grid-cols-[80px_1fr_0.8fr_0.8fr_0.7fr_90px] border-b border-gray-100 pb-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
              <span>Ref</span><span>Artist</span><span>Show</span><span>Amount</span><span>Due</span><span>Status</span>
            </div>
            {[
              { ref: "INV-047", artist: "Dan Shake", show: "Fabric · 10 Oct", amount: "£2,500", due: "26 Sep", status: "Outstanding", sc: "text-amber-600 bg-amber-50" },
              { ref: "INV-048", artist: "TENNIN", show: "Trouw · 22 Sep", amount: "€1,800", due: "8 Sep", status: "Outstanding", sc: "text-amber-600 bg-amber-50" },
              { ref: "INV-049", artist: "From:Ksusha", show: "De School · 9 Nov", amount: "€2,200", due: "10 Aug", status: "Overdue", sc: "text-red-600 bg-red-50" },
              { ref: "INV-043", artist: "OUO", show: "Boiler Rm · 5 Aug", amount: "£3,200", due: "Paid", status: "Paid", sc: "text-emerald-600 bg-emerald-50" },
              { ref: "INV-042", artist: "Gensai", show: "WHP · 2 Aug", amount: "£4,000", due: "Paid", status: "Paid", sc: "text-emerald-600 bg-emerald-50" },
              { ref: "INV-041", artist: "Eli Verano", show: "XOYO · 18 Jul", amount: "£1,800", due: "Paid", status: "Paid", sc: "text-emerald-600 bg-emerald-50" },
            ].map(r => (
              <div key={r.ref} className="grid grid-cols-[80px_1fr_0.8fr_0.8fr_0.7fr_90px] items-center border-b border-gray-50 py-2.5 hover:bg-gray-50">
                <span className="font-mono text-gray-400">{r.ref}</span>
                <span className="font-medium text-gray-900">{r.artist}</span>
                <span className="text-gray-500">{r.show}</span>
                <span className="font-medium text-gray-900">{r.amount}</span>
                <span className="text-gray-500">{r.due}</span>
                <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${r.sc}`}>{r.status}</span>
              </div>
            ))}
          </div>
          {/* Overdue alert */}
          <div className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="mb-1 font-semibold text-red-700">Overdue — INV-049 · From:Ksusha</div>
            <p className="text-red-600">€2,200 was due 10 Aug. De School, Berlin have not responded to 2 reminders.</p>
            <div className="mt-3 flex gap-2">
              <div className="rounded-md bg-white px-3 py-1.5 text-[10px] font-medium ring-1 ring-gray-200">View invoice</div>
              <div className="rounded-md bg-red-600 px-3 py-1.5 text-[10px] font-medium text-white">Send final reminder</div>
            </div>
          </div>
        </div>
      );

    case "analytics":
      return (
        <div className="min-h-[340px] bg-white text-[11px]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <span className="text-sm font-semibold text-gray-900">Agency Analytics</span>
            <div className="flex gap-2 text-[10px]">
              <div className="rounded border border-gray-200 px-2.5 py-1 text-gray-500">This year</div>
              <div className="rounded border border-gray-200 px-2.5 py-1 text-gray-500">All artists</div>
            </div>
          </div>
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-3 p-5">
            {[
              { label: "Confirmed shows", value: "147", delta: "+23 vs last year" },
              { label: "Inquiry → confirmed", value: "68%", delta: "+4pp vs last year" },
              { label: "Pipeline value", value: "£284k", delta: "active" },
              { label: "Avg deal size", value: "£2,100", delta: "+£340 vs last year" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-gray-100 p-3">
                <div className="text-[10px] text-gray-400">{s.label}</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">{s.value}</div>
                <div className="text-[9px] text-emerald-600">{s.delta}</div>
              </div>
            ))}
          </div>
          {/* Most booked artists */}
          <div className="px-5">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">Most booked artists — confirmed shows</div>
            {[
              { artist: "Dan Shake", shows: 38, revenue: "£82k", bar: 100 },
              { artist: "TENNIN", shows: 31, revenue: "£67k", bar: 82 },
              { artist: "OUO", shows: 24, revenue: "£51k", bar: 63 },
              { artist: "Gensai", shows: 19, revenue: "£39k", bar: 50 },
              { artist: "Eli Verano", shows: 14, revenue: "£28k", bar: 37 },
              { artist: "From:Ksusha", shows: 9, revenue: "£18k", bar: 24 },
            ].map(r => (
              <div key={r.artist} className="flex items-center gap-3 border-t border-gray-100 py-2">
                <span className="w-24 font-medium text-gray-900">{r.artist}</span>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#ee4d2d]" style={{ width: `${r.bar}%` }} />
                  </div>
                </div>
                <span className="w-8 text-right text-gray-500">{r.shows}</span>
                <span className="w-12 text-right font-semibold text-gray-900">{r.revenue}</span>
              </div>
            ))}
          </div>
          {/* Funnel */}
          <div className="mx-5 mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-3 text-[10px] font-medium uppercase tracking-wide text-gray-400">Pipeline funnel — last 90 days</div>
            {[
              { stage: "Inquiries received", count: 184, pct: 100 },
              { stage: "Reviewed & qualified", count: 142, pct: 77 },
              { stage: "Offer sent / negotiating", count: 89, pct: 48 },
              { stage: "Confirmed", count: 61, pct: 33 },
            ].map(f => (
              <div key={f.stage} className="mb-2 flex items-center gap-3">
                <span className="w-40 text-gray-600">{f.stage}</span>
                <div className="flex-1">
                  <div className="h-3 overflow-hidden rounded bg-gray-200">
                    <div className="h-full rounded bg-[#ee4d2d] opacity-80" style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
                <span className="w-8 text-right font-semibold text-gray-900">{f.count}</span>
                <span className="w-8 text-right text-gray-400">{f.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

