import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { DashboardBrand, DashboardNav, DashboardTabs } from "@/components/dashboard-nav";
import { getCurrentStore } from "@/lib/auth";
import { getStoreStats } from "@/lib/stores";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentStore();
  if (!session) redirect("/login");
  const { user, store } = session;
  const stats = await getStoreStats(store.id);

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <aside className="hidden w-72 flex-shrink-0 border-l border-stone-200/70 bg-white px-5 py-6 lg:flex lg:flex-col">
        <DashboardBrand />

        <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50/80 p-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 flex-shrink-0 place-items-center overflow-hidden rounded-xl text-white"
              style={{ backgroundColor: store.accent }}
            >
              {store.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={store.logo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-black">{store.name.slice(0, 1)}</span>
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-stone-900">{store.name}</p>
              <Link
                href={`/s/${store.slug}`}
                target="_blank"
                className="text-[11px] font-bold text-brand-600 hover:underline"
              >
                عرض المتجر <i className="fa-solid fa-arrow-up-left-from-square text-[9px]" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-1 flex-col">
          <DashboardNav newOrders={stats.newOrders} />
        </div>

        <div className="mt-6 border-t border-stone-100 pt-4">
          <p className="px-2 text-xs font-black text-stone-800">{user.name}</p>
          <p dir="ltr" className="truncate px-2 text-left text-[11px] font-medium text-stone-400">
            {user.email}
          </p>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-stone-500 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <i className="fa-solid fa-right-from-bracket text-xs" /> تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      <DashboardTabs newOrders={stats.newOrders} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-white/85 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <DashboardBrand />
            <div className="flex items-center gap-2">
              <Link
                href={`/s/${store.slug}`}
                target="_blank"
                className="grid h-9 w-9 place-items-center rounded-xl border border-stone-200 text-sm text-stone-600"
                aria-label="عرض المتجر"
              >
                <i className="fa-solid fa-arrow-up-left-from-square text-xs" />
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-stone-200 text-sm text-stone-600"
                  aria-label="تسجيل الخروج"
                >
                  <i className="fa-solid fa-right-from-bracket text-xs" />
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="px-4 pb-24 pt-6 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
