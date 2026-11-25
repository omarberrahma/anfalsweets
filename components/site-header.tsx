"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";

const links = [
  { href: "/#features", label: "المزايا" },
  { href: "/#how", label: "كيف يعمل" },
  { href: "/#pricing", label: "الأسعار" },
  { href: "/explore", label: "المتاجر" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100/80 bg-cream/85 backdrop-blur-xl">
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-stone-600 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden text-sm font-bold text-stone-600 hover:text-brand-700 sm:block px-3">
            دخول
          </Link>
          <Link href="/signup" className="btn-primary !px-5 !py-2.5">
            ابدأ مجاناً
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 text-stone-700 md:hidden"
            aria-label="القائمة"
            aria-expanded={open}
          >
            <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"} text-lg`} aria-hidden />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-stone-100 bg-white md:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-stone-700 hover:bg-brand-50"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-bold text-stone-700 hover:bg-brand-50"
            >
              دخول
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
