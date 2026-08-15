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
] as const;

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<string>("bookings");
  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0];

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

        {/* Tab bar */}
        <div className="flex gap-0 border-t border-ink">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-r border-ink px-4 py-3 font-mono text-[0.68rem] uppercase transition-colors last:border-r-0 ${
                activeTab === tab.id
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="grid gap-12 border-b border-l border-r border-ink p-[clamp(2rem,5vw,5rem)] md:grid-cols-2 md:items-center">
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
    </section>
  );
}

function TabPreview({ tab }: { tab: string }) {
  switch (tab) {
    case "bookings":
      return (
        <div className="p-4 text-[11px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-gray-900">Booking Requests</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">3 new</span>
          </div>
          {[
            { artist: "Dan Shake", venue: "Fabric · London", fee: "£2,500", conf: 94 },
            { artist: "TENNIN", venue: "Trouw · Amsterdam", fee: "€1,800", conf: 87 },
            { artist: "OUO", venue: "Boiler Room · Berlin", fee: "£3,200", conf: 91 },
          ].map((r) => (
            <div key={r.artist} className="flex items-center justify-between border-t border-gray-100 py-2">
              <div>
                <span className="font-medium text-gray-900">{r.artist}</span>
                <span className="ml-2 text-gray-400">{r.venue}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{r.fee}</span>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-6 overflow-hidden rounded-full bg-gray-200">
                    <div className={`h-full rounded-full ${r.conf >= 90 ? "bg-emerald-400" : "bg-amber-400"}`} style={{ width: `${r.conf}%` }} />
                  </div>
                  <span className="text-[9px] text-gray-400">{r.conf}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case "scheduling":
      return (
        <div className="p-4 text-[11px]">
          <div className="mb-3 font-semibold text-gray-900">September 2025</div>
          <div className="grid grid-cols-7 gap-1 text-center text-[9px]">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="pb-1 font-medium text-gray-400">{d}</span>
            ))}
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isBooked = [5, 14, 15, 22].includes(day);
              const isConflict = day === 22;
              return (
                <div
                  key={day}
                  className={`rounded py-1 ${isConflict ? "bg-red-100 font-semibold text-red-600" : isBooked ? "bg-emerald-50 text-emerald-700" : "text-gray-600"}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-2 text-[10px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" />Booked</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" />Conflict</span>
          </div>
        </div>
      );

    case "logistics":
      return (
        <div className="p-4 text-[11px]">
          <div className="mb-3 font-semibold text-gray-900">Route: UK Autumn Run</div>
          <div className="space-y-2">
            {[
              { city: "London", venue: "Fabric", date: "14 Sep", km: null },
              { city: "Manchester", venue: "WHP", date: "15 Sep", km: "320km" },
              { city: "Leeds", venue: "Wire", date: "16 Sep", km: "115km" },
            ].map((stop, i) => (
              <div key={stop.city} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ee4d2d] text-[9px] font-bold text-white">{i + 1}</div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{stop.city}</span>
                  <span className="ml-2 text-gray-400">{stop.venue} · {stop.date}</span>
                </div>
                {stop.km && <span className="text-[10px] text-gray-400">{stop.km}</span>}
              </div>
            ))}
          </div>
          <div className="mt-3 rounded border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] text-amber-700">
            ⚠ Radius clause risk: Leeds → Manchester &lt; 150km
          </div>
        </div>
      );

    case "contracts":
      return (
        <div className="p-4 text-[11px]">
          <div className="mb-3 font-semibold text-gray-900">Contracts</div>
          {[
            { artist: "Dan Shake", venue: "Fabric", status: "Signed", color: "text-emerald-600 bg-emerald-50" },
            { artist: "OUO", venue: "Boiler Room", status: "Sent", color: "text-blue-600 bg-blue-50" },
            { artist: "TENNIN", venue: "Trouw", status: "Draft", color: "text-gray-500 bg-gray-100" },
          ].map((c) => (
            <div key={c.artist} className="flex items-center justify-between border-t border-gray-100 py-2">
              <div>
                <span className="font-medium text-gray-900">{c.artist}</span>
                <span className="ml-2 text-gray-400">{c.venue}</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${c.color}`}>{c.status}</span>
            </div>
          ))}
        </div>
      );

    case "invoicing":
      return (
        <div className="p-4 text-[11px]">
          <div className="mb-3 font-semibold text-gray-900">Invoices</div>
          {[
            { ref: "INV-041", artist: "Gensai", amount: "£4,000", status: "Paid", color: "text-emerald-600 bg-emerald-50" },
            { ref: "INV-042", artist: "Dan Shake", amount: "£2,500", status: "Sent", color: "text-blue-600 bg-blue-50" },
            { ref: "INV-043", artist: "From:Ksusha", amount: "€2,200", status: "Overdue", color: "text-red-600 bg-red-50" },
          ].map((inv) => (
            <div key={inv.ref} className="flex items-center justify-between border-t border-gray-100 py-2">
              <div>
                <span className="font-mono text-[10px] text-gray-400">{inv.ref}</span>
                <span className="ml-2 font-medium text-gray-900">{inv.artist}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{inv.amount}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${inv.color}`}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
