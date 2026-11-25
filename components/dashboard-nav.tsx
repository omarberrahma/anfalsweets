"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

const items = [
  { href: "/dashboard", label: "نظرة عامة", icon: "fa-gauge-high" },
  { href: "/dashboard/products", label: "المنتجات", icon: "fa-cake-candles" },
  { href: "/dashboard/gallery", label: "المعرض", icon: "fa-images" },
  { href: "/dashboard/orders", label: "الطلبات", icon: "fa-clipboard-list" },
  { href: "/dashboard/billing", label: "الاشتراك", icon: "fa-credit-card" },
  { href: "/dashboard/settings", label: "الإعدادات", icon: "fa-gear" },
];

function useActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

export function DashboardNav({ newOrders }: { newOrders: number }) {
  const isActive = useActive();

  return (
    <nav className="hidden flex-col gap-1 lg:flex">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
              active
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                : "text-stone-600 hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            <i className={`fa-solid ${item.icon} w-4 text-center`} aria-hidden />
            <span className="whitespace-nowrap">{item.label}</span>
            {item.href === "/dashboard/orders" && newOrders > 0 && (
              <span
                className={`mr-auto rounded-full px-2 py-0.5 text-[10px] font-black ${
                  active ? "bg-white text-brand-700" : "bg-brand-600 text-white"
                }`}
              >
                {newOrders}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** شريط التنقل السفلي فالموبايل */
export function DashboardTabs({ newOrders }: { newOrders: number }) {
  const isActive = useActive();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-6">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-black transition ${
                active ? "text-brand-600" : "text-stone-400"
              }`}
            >
              <span className="relative">
                <i className={`fa-solid ${item.icon} text-base`} aria-hidden />
                {item.href === "/dashboard/orders" && newOrders > 0 && (
                  <span className="absolute -top-1.5 -left-2 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] text-white">
                    {newOrders}
                  </span>
                )}
              </span>
              {item.label}
              {active && (
                <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-brand-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DashboardBrand() {
  return (
    <div className="px-2 py-1">
      <Logo />
    </div>
  );
}
