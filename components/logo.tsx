import Link from "next/link";

export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span
        className={`grid h-11 w-11 place-items-center rounded-2xl text-lg shadow-lg ${
          light
            ? "bg-white/15 text-white shadow-black/20 ring-1 ring-white/20"
            : "bg-brand-600 text-white shadow-brand-600/30"
        }`}
      >
        <i className="fa-solid fa-layer-group" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-xl font-black tracking-tight ${light ? "text-white" : "text-stone-900"}`}
        >
          طبقات
        </span>
        <span
          className={`mt-1 text-[10px] font-bold uppercase tracking-[0.22em] ${
            light ? "text-white/60" : "text-brand-600"
          }`}
        >
          Tabaqat
        </span>
      </span>
    </Link>
  );
}
