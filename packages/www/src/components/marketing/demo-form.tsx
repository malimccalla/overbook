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
      className="flex w-full max-w-lg items-center overflow-hidden rounded-full border border-ink/15 bg-white shadow-sm"
    >
      <input
        type="email"
        required
        placeholder="you@agency.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent px-5 py-3 text-sm text-ink placeholder:text-muted focus:outline-none"
      />
      <button
        type="submit"
        className="mr-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/80"
      >
        Request demo
      </button>
    </form>
  );
}
