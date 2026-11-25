"use client";

import { useState } from "react";

export function CopyValue({ value, label = "نسخ" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard may be blocked */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${value}`}
      title={label}
      className="rounded-full p-2 text-stone-500 transition hover:bg-brand-50 hover:text-brand-600 print:hidden"
    >
      <i className={`fa-solid ${copied ? "fa-check text-emerald-600" : "fa-copy"}`} />
    </button>
  );
}
