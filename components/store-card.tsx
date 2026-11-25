import Link from "next/link";
import { CATEGORY_LABELS, type PublicStore } from "@/lib/stores";

export function StoreCard({ store }: { store: PublicStore }) {
  return (
    <Link
      href={`/s/${store.slug}`}
      className="group overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative h-44 overflow-hidden bg-brand-50">
        {store.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.cover_url}
            alt={store.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-4xl" style={{ color: store.accent }}>
            <i className="fa-solid fa-cake-candles" aria-hidden />
          </div>
        )}
        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-stone-700 shadow-sm">
          {CATEGORY_LABELS[store.category] ?? "حلويات"}
        </span>
      </div>

      <div className="flex items-center gap-3 p-5">
        <span
          className="grid h-12 w-12 flex-shrink-0 place-items-center overflow-hidden rounded-2xl text-white"
          style={{ backgroundColor: store.accent }}
        >
          {store.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={store.logo_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-black">{store.name.slice(0, 1)}</span>
          )}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-stone-900 group-hover:text-brand-700">
            {store.name}
          </h3>
          <p className="truncate text-xs font-medium text-stone-500">
            {store.city || "الجزائر"} · {store.product_count} منتج
          </p>
        </div>
        <i className="fa-solid fa-arrow-left mr-auto text-stone-300 transition group-hover:text-brand-600" aria-hidden />
      </div>
    </Link>
  );
}
