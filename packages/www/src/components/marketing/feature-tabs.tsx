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
    id: "advancing",
    label: "Advancing",
    headline: "Everything the promoter needs, sent automatically.",
    description:
      "When a booking is confirmed, Overbook sends the full advance pack to the promoter — tech rider, press photos, stage plot, schedule — pulled directly from the artist's record. No chasing, no manual sends.",
    features: [
      "Rider auto-sent on booking confirmation",
      "Tech spec, stage plot, and input list per artist",
      "Press pack (photos, bio, artwork) delivery",
      "Schedule: load-in, sound check, set time, curfew",
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
          <div className="overflow-hidden border border-ink/15 bg-[#f8f7f4]">
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
  const rows = [
    { artist: "Dan Shake", flag: null, promoter: "Fabric · London", date: "14 Sep", fee: "£2,500" },
    { artist: "TENNIN", flag: "missing fields", promoter: "Trouw · Amsterdam", date: "22 Sep", fee: "€1,800", selected: true },
    { artist: "OUO", flag: null, promoter: "Boiler Room · Berlin", date: "5 Oct", fee: "£3,200" },
    { artist: "Eli Verano", flag: "missing fields", promoter: "XOYO · London", date: "TBC", fee: "£1,400" },
  ];

  return (
    <div className="bg-[#f8f7f4] text-[11px]">
      <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3">
        <div>
          <span className="text-sm font-semibold text-ink">Booking Requests</span>
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">4 need review</span>
        </div>
        <div className="flex gap-2">
          <div className="rounded-md border border-ink/12 px-2.5 py-1 text-ink/60">Filter</div>
          <div className="rounded-md border border-ink/12 px-2.5 py-1 text-ink/60">All artists</div>
        </div>
      </div>
      <div className="grid grid-cols-[16px_1.4fr_1fr_0.7fr_0.7fr_80px] border-b border-[#121212]/8 px-5 py-2 text-[10px] font-medium uppercase tracking-wide text-ink/35">
        <span /><span>Artist</span><span>Promoter / Venue</span><span>Date</span><span>Fee</span><span>Status</span>
      </div>
      {rows.map((r) => (
        <div key={r.artist + r.date}>
          <div className={`grid grid-cols-[16px_1.4fr_1fr_0.7fr_0.7fr_80px] items-center border-b px-5 py-2.5 ${
            r.selected ? "border-[#ee4d2d]/15 bg-[#f3f1ea]" : "border-gray-50"
          }`}>
            <span className="text-[9px] text-ink/25">{(r as { selected?: boolean }).selected ? "▾" : "▸"}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-ink">{r.artist}</span>
              {r.flag && <span className="rounded bg-amber-50 px-1 py-0.5 text-[9px] font-medium text-amber-600">{r.flag}</span>}
            </div>
            <span className="text-ink/60">{r.promoter}</span>
            <span className={r.date === "TBC" ? "italic text-amber-500" : "text-ink/60"}>{r.date}</span>
            <span className="font-medium text-ink">{r.fee}</span>
            <span className="inline-flex w-fit rounded bg-amber-50 px-2 py-0.5 font-mono text-[9px] font-medium uppercase text-amber-700">Review</span>
          </div>
          {(r as { selected?: boolean }).selected && (
            <div className="border-b border-ink/8 bg-[#f3f1ea] px-5 py-3">
              {/* Actions */}
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-ink">TENNIN — Trouw, Amsterdam · 22 Sep 2025</span>
                <div className="flex gap-1.5">
                  <div className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-gray-700 ring-1 ring-ink/15">View on calendar</div>
                  <div className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-gray-700 ring-1 ring-ink/15">Request info</div>
                  <div className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-gray-700 ring-1 ring-ink/15">Dismiss</div>
                  <div className="rounded-md bg-[#ee4d2d] px-2 py-1 text-[10px] font-medium text-white">Create booking →</div>
                </div>
              </div>
              {/* Primary info — artist, date, venue, fee */}
              <div className="mb-2 grid grid-cols-4 gap-2">
                <div className="rounded bg-white p-2.5 ring-1 ring-ink/8">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10 text-[8px] font-bold text-ink/50">T</div>
                    <span className="font-mono text-[9px] uppercase text-ink/35">Artist</span>
                  </div>
                  <div className="font-semibold text-ink">TENNIN</div>
                </div>
                <div className="rounded bg-white p-2.5 ring-1 ring-ink/8">
                  <div className="mb-1.5 font-mono text-[9px] uppercase text-ink/35">Date</div>
                  <div className="font-semibold text-ink">22 Sep 2025</div>
                </div>
                <div className="rounded bg-white p-2.5 ring-1 ring-ink/8">
                  <div className="mb-1.5 font-mono text-[9px] uppercase text-ink/35">Venue</div>
                  <div className="font-semibold text-ink">Trouw</div>
                  <div className="text-[10px] text-ink/50">Amsterdam</div>
                </div>
                <div className="rounded bg-white p-2.5 ring-1 ring-ink/8">
                  <div className="mb-1.5 font-mono text-[9px] uppercase text-ink/35">Fee</div>
                  <div className="text-base font-bold text-ink">€1,800</div>
                </div>
              </div>
              {/* Secondary details — compact tag row */}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {[
                  { k: "Capacity", v: "800 / 1,200", ok: true },
                  { k: "Billing", v: "Headline", ok: true },
                  { k: "Set time", v: "Missing", ok: false },
                  { k: "Booking fee", v: "Missing", ok: false },
                  { k: "Travel on top", v: "Yes", ok: true },
                  { k: "Hotel", v: "Missing", ok: false },
                  { k: "Radius", v: "50km · 14d", ok: true },
                  { k: "Deadline", v: "19 Aug", ok: true },
                ].map(d => (
                  <span key={d.k} className={`rounded px-1.5 py-0.5 text-[9px] ${d.ok ? "bg-white text-ink/60 ring-1 ring-ink/8" : "bg-red-50 text-red-400"}`}>
                    <span className="text-ink/35">{d.k}: </span>{d.v}
                  </span>
                ))}
              </div>
              {/* Source email */}
              <div className="rounded border border-ink/8 bg-white p-2 text-[10px] text-gray-500 leading-relaxed">
                <span className="font-medium text-gray-700">Source email: </span>Hi, we'd love to have TENNIN play our September party at Trouw Amsterdam. Thinking 22nd September. Budget €1,800 all-in. Travel contribution on top. Radius: 50km / 14 days. Let us know — Jan
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
        <div className="min-h-[340px] bg-[#f8f7f4] text-[11px]">
          <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3">
            <div>
              <span className="text-sm font-semibold text-ink">Week view</span>
              <span className="ml-2 text-ink/35">8–14 Sep 2025</span>
            </div>
            <div className="flex gap-2">
              <div className="rounded border border-ink/12 px-2.5 py-1 text-ink/60">← Prev</div>
              <div className="rounded border border-ink/12 bg-[#f3f1ea] px-2.5 py-1 font-medium text-gray-700">All artists</div>
              <div className="rounded border border-ink/12 px-2.5 py-1 text-ink/60">Next →</div>
            </div>
          </div>
          {/* Week grid — Google Calendar style with multi-hour spans */}
          <div className="flex">
            {/* Time gutter */}
            <div className="w-12 shrink-0 pt-7">
              {["18", "20", "22", "00", "02", "04"].map(h => (
                <div key={h} className="flex h-10 items-start justify-end pr-2 text-[9px] text-ink/30">{h}:00</div>
              ))}
            </div>
            {/* Day columns */}
            <div className="flex flex-1 gap-px overflow-hidden">
              {[
                { d: "Mon", events: [] },
                { d: "Tue", events: [] },
                { d: "Wed", events: [{ top: 1, h: 2, a: "OUO", v: "Fabric", c: "#a8e5e1" }] },
                { d: "Thu", events: [{ top: 0, h: 1, a: "Gensai", v: "Trouw", c: "#d7f257" }] },
                { d: "Fri", events: [{ top: 1, h: 3, a: "Dan Shake", v: "Fabric", c: "#ee4d2d" }, { top: 2, h: 2, a: "TENNIN", v: "XOYO", c: "#a8e5e1" }] },
                { d: "Sat", events: [{ top: 1, h: 3, a: "Eli Verano", v: "Berghain", c: "#d7f257" }, { top: 2, h: 4, a: "From:Ksusha", v: "De School", c: "#ee4d2d" }, { top: 3, h: 2, a: "Gensai", v: "WHP", c: "#a8e5e1" }] },
                { d: "Sun", events: [{ top: 0, h: 2, a: "OUO", v: "Corsica", c: "#d7f257" }] },
              ].map(({ d, events }) => (
                <div key={d} className="flex-1 min-w-0">
                  <div className={`py-1.5 text-center text-[9px] font-medium uppercase ${
                    d === "Fri" || d === "Sat" ? "font-bold text-ink" : "text-ink/40"
                  }`}>{d}</div>
                  {/* 6 rows × 40px = 240px */}
                  <div className="relative" style={{ height: 240 }}>
                    {[0,1,2,3,4,5].map(i => (
                      <div key={i} className="absolute w-full border-t border-ink/5" style={{ top: i * 40 }} />
                    ))}
                    {events.map((ev, ei) => (
                      <div
                        key={ei}
                        className="absolute inset-x-0.5 overflow-hidden rounded px-1 py-0.5"
                        style={{ top: ev.top * 40 + 2, height: ev.h * 40 - 4, backgroundColor: ev.c + "33", borderLeft: `2px solid ${ev.c}` }}
                      >
                        <div className="truncate text-[8px] font-semibold leading-tight" style={{ color: ev.c === "#ee4d2d" ? "#c43d20" : ev.c === "#a8e5e1" ? "#2a7a75" : "#5a6200" }}>{ev.a}</div>
                        <div className="truncate text-[7px] opacity-70" style={{ color: ev.c === "#ee4d2d" ? "#c43d20" : ev.c === "#a8e5e1" ? "#2a7a75" : "#5a6200" }}>{ev.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "advancing":
      return (
        <div className="min-h-[340px] bg-[#f8f7f4] text-[11px]">
          <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3">
            <div>
              <span className="text-sm font-semibold text-ink">Dan Shake — Fabric, London</span>
              <span className="ml-2 text-ink/40">Fri 12 Sep 2025</span>
            </div>
            <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[9px] font-medium uppercase text-emerald-700">Advance complete</span>
          </div>
          {/* Advance pack checklist */}
          <div className="px-5 pt-3">
            <div className="mb-2 font-mono text-[9px] uppercase text-ink/35">Advance pack — auto-sent to promoter on confirmation</div>
            {[
              { item: "Technical rider", detail: "2× CDJ-3000, DJM-900NXS2 · 2× wedge monitors", sent: true },
              { item: "Stage plot & input list", detail: "3 channels, stereo out", sent: true },
              { item: "Hospitality rider", detail: "6× still water, 2× towels, light snacks", sent: true },
              { item: "Press pack", detail: "Hi-res photo, bio, logo — 3 files", sent: true },
              { item: "Schedule", detail: "Load-in 18:00 · Sound check 21:30 · Set 23:00–01:00 · Curfew 02:00", sent: true },
              { item: "Hotel confirmation", detail: "The Hoxton, Southwark · Check-in 16:00", sent: true },
              { item: "Ground transport", detail: "Car from venue to hotel — not yet arranged", sent: false },
            ].map(r => (
              <div key={r.item} className="flex items-start gap-3 border-t border-ink/6 py-2">
                <span className={`mt-0.5 shrink-0 text-[11px] ${r.sent ? "text-emerald-500" : "text-amber-400"}`}>
                  {r.sent ? "✓" : "○"}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-ink">{r.item}</span>
                  <span className="ml-2 text-ink/50">{r.detail}</span>
                </div>
                {!r.sent && <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[9px] font-medium text-amber-600">To do</span>}
              </div>
            ))}
          </div>
          {/* Key contacts */}
          <div className="mx-5 mt-3 rounded border border-ink/8 bg-white p-3">
            <div className="mb-2 font-mono text-[9px] uppercase text-ink/35">Contacts</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: "Promoter", name: "Craig Richards", org: "Fabric" },
                { role: "Production", name: "Marcus Hill", org: "Stage 2" },
                { role: "Artist manager", name: "Sarah Okafor", org: "" },
                { role: "Tour manager", name: "—", org: "Not assigned" },
              ].map(c => (
                <div key={c.role} className="rounded bg-[#f8f7f4] p-2">
                  <div className="font-mono text-[9px] uppercase text-ink/30">{c.role}</div>
                  <div className={`mt-0.5 text-[10px] font-medium ${c.name === "—" ? "italic text-ink/30" : "text-ink"}`}>{c.name}</div>
                  {c.org && <div className="text-[9px] text-ink/40">{c.org}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "contracts":
      return (
        <div className="min-h-[340px] bg-[#f8f7f4] text-[11px]">
          <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3">
            <span className="text-sm font-semibold text-ink">Contracts</span>
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
              <div key={s.label} className="rounded-xl border border-ink/8 p-3">
                <div className={`mb-1 text-xs font-semibold rounded-full w-fit px-2 py-0.5 ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-ink/35">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Contracts list — hover state on OUO row */}
          <div className="px-5">
            <div className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.7fr_90px] border-b border-ink/8 pb-2 text-[10px] font-medium uppercase tracking-wide text-ink/35">
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
                r.hover ? "bg-blue-50/60" : "hover:bg-[#f3f1ea]"
              }`}>
                <span className="font-medium text-ink">{r.artist}</span>
                {/* Booking record link with icon */}
                <span className="flex items-center gap-1.5 text-ink/60">
                  <svg viewBox="0 0 96 96" className="h-3 w-3 shrink-0 text-[#ee4d2d]" fill="currentColor"><path d="M32 0h16v16H32V0ZM16 16h16v16H16V16ZM0 32h16v16H0V32Zm0 16h16v16H0V48Zm16 16h16v16H16V64Zm16 16h16v16H32V80Zm16 0h16v16H48V80Zm16-16h16v16H64V64Zm16-16h16v16H80V48Zm0-16h16v16H80V32ZM64 16h16v16H64V16ZM48 0h16v16H48V0Z"/></svg>
                  {r.venue}
                </span>
                <span className="font-medium text-ink">{r.fee}</span>
                <span className="text-ink/35">{r.sent}</span>
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
        <div className="min-h-[340px] bg-[#f8f7f4] text-[11px]">
          <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3">
            <span className="text-sm font-semibold text-ink">Invoices</span>
            <div className="rounded-md bg-ink px-3 py-1.5 text-[10px] font-medium text-white">+ New invoice</div>
          </div>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 p-5">
            {[
              { label: "Outstanding", value: "£14,200", sub: "3 invoices", color: "text-amber-600" },
              { label: "Overdue", value: "€2,200", sub: "1 invoice", color: "text-red-600" },
              { label: "Collected (30d)", value: "£23,400", sub: "6 invoices", color: "text-emerald-600" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-ink/8 p-3">
                <div className="text-[10px] text-ink/35">{s.label}</div>
                <div className={`mt-1 text-base font-semibold ${s.color}`}>{s.value}</div>
                <div className="text-[9px] text-ink/35">{s.sub}</div>
              </div>
            ))}
          </div>
          {/* Invoices table */}
          <div className="px-5">
            <div className="grid grid-cols-[80px_1fr_0.8fr_0.8fr_0.7fr_90px] border-b border-ink/8 pb-2 text-[10px] font-medium uppercase tracking-wide text-ink/35">
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
              <div key={r.ref} className="grid grid-cols-[80px_1fr_0.8fr_0.8fr_0.7fr_90px] items-center border-b border-gray-50 py-2.5 hover:bg-[#f3f1ea]">
                <span className="font-mono text-ink/35">{r.ref}</span>
                <span className="font-medium text-ink">{r.artist}</span>
                <span className="text-ink/60">{r.show}</span>
                <span className="font-medium text-ink">{r.amount}</span>
                <span className="text-ink/60">{r.due}</span>
                <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${r.sc}`}>{r.status}</span>
              </div>
            ))}
          </div>

        </div>
      );

    case "analytics":
      return (
        <div className="min-h-[340px] bg-[#f8f7f4] text-[11px]">
          <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3">
            <span className="text-sm font-semibold text-ink">Agency Analytics</span>
            <div className="flex gap-2 text-[10px]">
              <div className="rounded border border-ink/12 px-2.5 py-1 text-ink/60">This year</div>
              <div className="rounded border border-ink/12 px-2.5 py-1 text-ink/60">All artists</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4">
            {/* Left: KPIs + bar chart */}
            <div>
              <div className="mb-3 grid grid-cols-2 gap-2">
                {[
                  { label: "Confirmed", value: "147", color: "text-ink" },
                  { label: "Conversion", value: "68%", color: "text-[#ee4d2d]" },
                  { label: "Pipeline", value: "£284k", color: "text-ink" },
                  { label: "Avg deal", value: "£2,100", color: "text-emerald-600" },
                ].map(s => (
                  <div key={s.label} className="rounded border border-ink/8 bg-white p-2">
                    <div className="text-[9px] text-ink/35">{s.label}</div>
                    <div className={`mt-0.5 text-sm font-semibold ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* Horizontal bar chart */}
              <div className="font-mono text-[9px] uppercase text-ink/35 mb-1">Shows by artist</div>
              {[
                { a: "Dan Shake", n: 38, c: "#ee4d2d" },
                { a: "TENNIN", n: 31, c: "#a8e5e1" },
                { a: "OUO", n: 24, c: "#d7f257" },
                { a: "Gensai", n: 19, c: "#ee4d2d" },
                { a: "Eli Verano", n: 14, c: "#a8e5e1" },
              ].map(r => (
                <div key={r.a} className="mb-1 flex items-center gap-2">
                  <span className="w-16 truncate text-[9px] text-ink/60">{r.a}</span>
                  <div className="flex-1 h-3 overflow-hidden rounded-sm bg-ink/8">
                    <div className="h-full rounded-sm" style={{ width: `${(r.n/38)*100}%`, backgroundColor: r.c }} />
                  </div>
                  <span className="w-4 text-right text-[9px] text-ink/40">{r.n}</span>
                </div>
              ))}
            </div>
            {/* Right: Donut + funnel */}
            <div>
              {/* SVG donut — bookings by status */}
              <div className="font-mono text-[9px] uppercase text-ink/35 mb-1">Pipeline breakdown</div>
              <div className="flex items-center gap-3 mb-3">
                <svg viewBox="0 0 80 80" className="h-16 w-16 shrink-0" style={{ transform: "rotate(-90deg)" }}>
                  {[
                    { pct: 33, color: "#ee4d2d" },
                    { pct: 20, color: "#a8e5e1" },
                    { pct: 27, color: "#d7f257" },
                    { pct: 20, color: "#121212" },
                  ].reduce<{ segments: React.ReactNode[]; offset: number }>(({ segments, offset }, s, i) => {
                    const r = 28, cx = 40, cy = 40;
                    const circ = 2 * Math.PI * r;
                    const dash = (s.pct / 100) * circ;
                    segments.push(
                      <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="12"
                        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset * circ / 100} />
                    );
                    return { segments, offset: offset + s.pct };
                  }, { segments: [], offset: 0 }).segments
                  }
                </svg>
                <div className="space-y-1">
                  {[
                    { label: "Confirmed", pct: 33, c: "#ee4d2d" },
                    { label: "Negotiating", pct: 27, c: "#d7f257" },
                    { label: "Pencilled", pct: 20, c: "#a8e5e1" },
                    { label: "New", pct: 20, c: "#121212" },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: l.c }} />
                      <span className="text-[9px] text-ink/60">{l.label}</span>
                      <span className="ml-auto text-[9px] font-medium text-ink">{l.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Monthly revenue sparkline */}
              <div className="font-mono text-[9px] uppercase text-ink/35 mb-1">Monthly revenue</div>
              <svg viewBox="0 0 120 36" className="w-full">
                <polyline
                  points="0,28 20,24 40,20 60,16 80,22 100,10 120,6"
                  fill="none" stroke="#ee4d2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
                <polyline
                  points="0,28 20,24 40,20 60,16 80,22 100,10 120,6"
                  fill="url(#grad)" stroke="none" opacity="0.15"
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ee4d2d" />
                    <stop offset="100%" stopColor="#ee4d2d" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      );
          {/* KPI row */}
    default:
      return null;
  }
}

