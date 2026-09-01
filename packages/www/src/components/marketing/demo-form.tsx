"use client";

import { useState } from "react";

export function DemoForm() {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: submit to API
      }}
      className="flex w-full max-w-lg items-center gap-2"
    >
      <input
        type="email"
        required
        placeholder="you@agency.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg border border-ink/15 bg-white px-5 py-3 text-base text-ink shadow-sm placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-ink px-6 py-3 text-base font-medium text-paper shadow-sm transition-colors hover:bg-ink/80"
      >
        Request Demo
      </button>
    </form>
  );
}
