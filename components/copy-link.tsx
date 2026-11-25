"use client";

import { useState } from "react";

export function CopyLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
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
      className="btn-ghost !px-4 !py-2 text-xs"
      aria-label="نسخ رابط المتجر"
    >
      <i className={`fa-solid ${copied ? "fa-check text-emerald-600" : "fa-copy"}`} />
      {copied ? "تم النسخ" : "نسخ الرابط"}
    </button>
  );
}
