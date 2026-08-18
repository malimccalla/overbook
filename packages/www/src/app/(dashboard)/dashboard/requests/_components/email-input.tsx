"use client";

import { useState } from "react";

interface EmailInputProps {
  processing: boolean;
  onSubmit: (text: string) => void;
}

export function EmailInput({ processing, onSubmit }: EmailInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || processing) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <div className="border-t px-8 py-3">
      <div className="mx-auto max-w-[720px]">
        {processing ? (
          <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
            <span className="text-sm text-muted-foreground">
              Processing email...
            </span>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border focus-within:border-ring">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) handleSubmit();
              }}
              placeholder="Paste a booking email..."
              rows={text.includes("\n") ? 4 : 1}
              className="w-full resize-none border-0 bg-background px-4 pt-3 pb-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex items-center justify-between px-3 pb-2">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="8" y1="3" x2="8" y2="13" />
                  <line x1="3" y1="8" x2="13" y2="8" />
                </svg>
              </button>
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="flex h-7 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
