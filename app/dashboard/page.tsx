import type { Metadata } from "next";
import Link from "next/link";
import { CopyLink } from "@/components/copy-link";
import { Flash } from "@/components/flash";
import { getCurrentStore } from "@/lib/auth";
import { money } from "@/lib/db";
import { ORDER_STATUS } from "@/lib/labels";
import { limitLabel } from "@/lib/plans";
import { getOrders, getProducts, getStoreStats, waLink } from "@/lib/stores";
import { planUsage } from "@/lib/subscriptions";

export const metadata: Metadata = { title: "لوحة التحكم" };

const statCards = [
  { key: "products", label: "منتجات", icon: "fa-cake-candles", tone: "bg-brand-50 text-brand-600" },
  { key: "gallery", label: "صور فالمعرض", icon: "fa-images", tone: "bg-violet-50 text-violet-600" },
  { key: "newOrders", label: "طلبات جديدة", icon: "fa-bell", tone: "bg-amber-50 text-amber-600" },
  { key: "orders", label: "إجمالي الطلبات", icon: "fa-clipboard-list", tone: "bg-emerald-50 text-emerald-600" },
] as const;

export default async function DashboardHome({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const session = await getCurrentStore();
  if (!session) return null;
  const { user, store } = session;
  const { welcome } = await searchParams;
  const stats = await getStoreStats(store.id);
  const usage = await planUsage(store);
  const products = (await getProducts(store.id)).slice(0, 3);
  const orders = (await getOrders(store.id)).slice(0, 4);
  const incomplete = !store.whatsapp || !store.about;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {welcome && (
        <Flash ok={`مرحباً ${user.name}! متجرك "${store.name}" تخلق. كمّل المعلومات باش يبان للزبائن.`} />
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">
            أهلاً، {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            هاك نظرة سريعة على متجرك وطلباتك اليوم.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/products" className="btn-primary !px-5 !py-2.5">
            <i className="fa-solid fa-plus" /> زيد منتج
          </Link>
          <Link href={`/s/${store.slug}`} target="_blank" className="btn-ghost !px-5 !py-2.5">
            <i className="fa-solid fa-arrow-up-left-from-square text-xs" /> عرض المتجر
          </Link>
        </div>
      </div>

      {incomplete && (
        <div className="flex flex-col justify-between gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
              <i className="fa-solid fa-triangle-exclamation" />
            </span>
            <div>
              <p className="text-sm font-black text-amber-900">متجرك مازال ناقص</p>
              <p className="text-xs font-medium text-amber-700">
                زيد رقم الواتساب والوصف باش الزبائن يقدرو يتواصلو معاك.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="btn bg-amber-500 !px-4 !py-2 text-white hover:bg-amber-600"
          >
            كمّل المعلومات
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="card p-5">
            <div className="flex items-center justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${card.tone}`}>
                <i className={`fa-solid ${card.icon}`} aria-hidden />
              </span>
              <span className="text-3xl font-black text-stone-900">{stats[card.key]}</span>
            </div>
            <p className="mt-3 text-xs font-bold text-stone-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
            <h2 className="text-sm font-black text-stone-900">آخر الطلبات</h2>
            <Link href="/dashboard/orders" className="text-xs font-bold text-brand-600 hover:underline">
              كل الطلبات
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="p-8 text-center text-sm font-medium text-stone-400">
              مازال ما وصلك حتى طلب. شارك رابط متجرك مع زبائنك.
            </p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {orders.map((order) => {
                const status = ORDER_STATUS[order.status] ?? ORDER_STATUS.new;
                return (
                  <li key={order.id} className="flex items-start gap-3 px-5 py-4">
                    <span className={`chip mt-0.5 ${status.cls}`}>{status.label}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-stone-800">
                        {order.customer_name}
                      </p>
                      <p className="truncate text-xs font-medium text-stone-500">
                        {order.items || "بدون تفاصيل"}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-stone-400">
                        {order.wanted_for || order.created_at.slice(0, 10)}
                      </p>
                      <a
                        href={waLink(order.customer_phone, `مرحباً ${order.customer_name}`)}
                        target="_blank"
                        className="mt-1 inline-flex text-[11px] font-black text-emerald-600 hover:underline"
                      >
                        <i className="fa-brands fa-whatsapp ml-1" /> واتساب
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-stone-900">خطتك</h2>
              <Link
                href="/dashboard/billing"
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                إدارة
              </Link>
            </div>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-black text-stone-900">{usage.plan.name}</span>
              <span className="text-[11px] font-bold text-stone-400">
                {money(usage.plan.price)} / {usage.plan.price === 0 ? "للأبد" : "شهر"}
              </span>
            </p>

            <div className="mt-4 space-y-3">
              {[
                { label: "المنتجات", used: usage.products, limit: usage.plan.productLimit },
                { label: "المعرض", used: usage.gallery, limit: usage.plan.galleryLimit },
              ].map((meter) => {
                const percent =
                  meter.limit === null
                    ? 8
                    : Math.min(100, Math.round((meter.used / meter.limit) * 100));
                return (
                  <div key={meter.label}>
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-500">
                      <span>{meter.label}</span>
                      <span>
                        {meter.used} / {limitLabel(meter.limit)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {usage.plan.key !== "weddings" && (
              <Link
                href="/dashboard/billing"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-xs font-black text-brand-700 transition hover:bg-brand-100"
              >
                <i className="fa-solid fa-arrow-up" aria-hidden /> رقّي الخطة
              </Link>
            )}
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-black text-stone-900">رابط متجرك</h2>
            <p dir="ltr" className="mt-2 truncate rounded-xl bg-stone-50 px-3 py-2 text-left text-xs font-bold text-stone-500">
              /s/{store.slug}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyLink path={`/s/${store.slug}`} />
              <a
                href={waLink(
                  store.whatsapp,
                  `شوف متجري الجديد على طبقات: ${store.name} — ${store.tagline}`,
                )}
                target="_blank"
                className="btn !bg-emerald-500 !px-4 !py-2 text-xs text-white hover:!bg-emerald-600"
              >
                <i className="fa-brands fa-whatsapp" /> شارك
              </a>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-stone-900">منتجاتك</h2>
              <Link href="/dashboard/products" className="text-xs font-bold text-brand-600 hover:underline">
                الكل
              </Link>
            </div>
            <ul className="mt-3 space-y-3">
              {products.length === 0 && (
                <li className="text-xs font-medium text-stone-400">مازال ما زدت حتى منتج.</li>
              )}
              {products.map((product) => (
                <li key={product.id} className="flex items-center gap-3">
                  <span className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-stone-800">{product.name}</p>
                    <p className="text-[11px] font-bold text-stone-400">
                      {money(product.price)} / {product.unit}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
