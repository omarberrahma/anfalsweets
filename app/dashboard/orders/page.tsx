import type { Metadata } from "next";
import Link from "next/link";
import { deleteOrder, updateOrderStatus } from "@/app/actions/store";
import { Flash } from "@/components/flash";
import { getCurrentStore } from "@/lib/auth";
import { ORDER_STATUS, type OrderStatus } from "@/lib/labels";
import { getOrders, waLink } from "@/lib/stores";

export const metadata: Metadata = { title: "الطلبات" };

const filters: Array<{ key: string; label: string }> = [
  { key: "all", label: "الكل" },
  { key: "new", label: "جديدة" },
  { key: "confirmed", label: "مؤكدة" },
  { key: "done", label: "مكتملة" },
  { key: "cancelled", label: "ملغاة" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; status?: string }>;
}) {
  const session = await getCurrentStore();
  if (!session) return null;
  const { store } = session;
  const { ok, error, status = "all" } = await searchParams;
  const allOrders = await getOrders(store.id);
  const orders =
    status === "all" ? allOrders : allOrders.filter((order) => order.status === status);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">الطلبات</h1>
          <p className="mt-1 text-sm text-stone-500">
            {allOrders.length} طلب · {allOrders.filter((o) => o.status === "new").length} جديد
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Flash ok={ok} error={error} />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((filter) => {
          const count =
            filter.key === "all"
              ? allOrders.length
              : allOrders.filter((o) => o.status === filter.key).length;
          return (
            <Link
              key={filter.key}
              href={`/dashboard/orders?status=${filter.key}`}
              className={`chip flex-shrink-0 border px-4 py-2 ${
                status === filter.key
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-brand-200"
              }`}
            >
              {filter.label}
              <span className={`text-[10px] ${status === filter.key ? "text-white/70" : "text-stone-400"}`}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="card grid place-items-center p-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-2xl text-brand-500">
            <i className="fa-solid fa-inbox" />
          </span>
          <h2 className="mt-4 text-lg font-black text-stone-900">ما كاين حتى طلب هنا</h2>
          <p className="mt-1 max-w-xs text-sm text-stone-500">
            شارك رابط متجرك فـإنستغرام والواتساب باش تبدا تستقبل الطلبات.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const current = (ORDER_STATUS[order.status] ?? ORDER_STATUS.new) as {
              label: string;
              cls: string;
            };
            return (
              <article key={order.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-stone-100 text-sm font-black text-stone-600">
                      {order.customer_name.slice(0, 1)}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-black text-stone-900">{order.customer_name}</h2>
                        <span className={`chip ${current.cls}`}>{current.label}</span>
                      </div>
                      <a
                        href={`tel:${order.customer_phone}`}
                        dir="ltr"
                        className="text-left text-xs font-bold text-stone-500 hover:text-brand-600"
                      >
                        <i className="fa-solid fa-phone ml-1 text-[10px]" /> {order.customer_phone}
                      </a>
                    </div>
                  </div>

                  <div className="text-left">
                    <p className="text-[11px] font-bold text-stone-400">
                      #{order.id} · {order.created_at.slice(0, 10)}
                    </p>
                    {order.wanted_for && (
                      <p className="mt-1 text-xs font-black text-brand-700">
                        <i className="fa-regular fa-calendar ml-1" /> للمناسبة: {order.wanted_for}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 rounded-2xl bg-stone-50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-black text-stone-400">الطلب</p>
                    <p className="mt-1 text-sm font-bold text-stone-700">
                      {order.items || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-stone-400">ملاحظات</p>
                    <p className="mt-1 text-sm font-medium text-stone-600">{order.notes || "—"}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {(["new", "confirmed", "done", "cancelled"] as OrderStatus[]).map((key) => (
                    <form key={key} action={updateOrderStatus}>
                      <input type="hidden" name="id" value={order.id} />
                      <input type="hidden" name="status" value={key} />
                      <button
                        type="submit"
                        className={`chip border px-3 py-1.5 transition ${
                          order.status === key
                            ? `${ORDER_STATUS[key].cls} border-transparent`
                            : "border-stone-200 bg-white text-stone-500 hover:border-brand-200"
                        }`}
                      >
                        {ORDER_STATUS[key].label}
                      </button>
                    </form>
                  ))}

                  <a
                    href={waLink(
                      order.customer_phone,
                      `مرحباً ${order.customer_name}، بخصوص طلبك من ${store.name}: ${order.items}`,
                    )}
                    target="_blank"
                    className="chip mr-auto bg-emerald-500 px-4 py-1.5 text-white hover:bg-emerald-600"
                  >
                    <i className="fa-brands fa-whatsapp" /> رد على واتساب
                  </a>

                  <form action={deleteOrder}>
                    <input type="hidden" name="id" value={order.id} />
                    <button
                      type="submit"
                      className="chip border border-stone-200 bg-white px-3 py-1.5 text-stone-400 hover:border-rose-200 hover:text-rose-600"
                    >
                      <i className="fa-solid fa-trash text-[10px]" /> حذف
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
