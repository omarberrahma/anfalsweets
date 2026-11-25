"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-ghost !px-5 !py-2.5">
      <i className="fa-solid fa-print text-xs" /> طباعة الفاتورة
    </button>
  );
}
