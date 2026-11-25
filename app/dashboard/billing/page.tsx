import type { Metadata } from "next";
import Link from "next/link";
import { choosePlan } from "@/app/actions/billing";
import { Flash } from "@/components/flash";
import { PaymentBox } from "@/components/payment-box";
import { getCurrentStore } from "@/lib/auth";
import { money } from "@/lib/db";
import { getPlan, limitLabel, PLAN_ORDER, PLANS } from "@/lib/plans";
import { listInvoices, planUsage } from "@/lib/subscriptions";

export const metadata: Metadata = { title: "الاشتراك والفواتير" };

const INVOICE_STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "مدفوعة", cls: "bg-emerald-100 text-emerald-700" },
  pending: { label: "في انتظار الدفع", cls: "bg-amber-100 text-amber-700" },
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await getCurrentStore();
  if (!session) return null;
  const { store } = session;
  const { ok, error } = await searchParams;
  const usage = await planUsage(store);
  const current = usage.plan;
  const invoices = await listInvoices(store.id);
  const pending = invoices.find((invoice) => invoice.status === "pending");

  const meters = [
    {
      label: "المنتجات",
      used: usage.products,
      limit: current.productLimit,
      icon: "fa-cake-candles",
    },
    {
      label: "صور المعرض",
      used: usage.gallery,
      limit: current.galleryLimit,
      icon: "fa-images",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">الاشتراك والفواتير</h1>
        <p className="mt-1 text-sm text-stone-500">
          الخطة الحالية، الحدود ديالها، والفواتير ديالك — كلشي فبلاصة واحدة.
        </p>
      </div>

      <Flash ok={ok} error={error} />

      <section className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="chip bg-brand-50 text-brand-700">
              <i className="fa-solid fa-crown text-[10px]" /> خطتك الحالية
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900">{current.name}</h2>
            <p className="mt-1 text-sm text-stone-500">{current.tagline}</p>
          </div>
          <p className="text-left">
            <span className="text-3xl font-black text-stone-900">{money(current.price)}</span>
            <span className="block text-[11px] font-bold text-stone-400">
              {current.price === 0 ? "للأبد" : "كل شهر"}
            </span>
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {meters.map((meter) => {
            const full = meter.limit !== null && meter.used >= meter.limit;
            const percent =
              meter.limit === null ? 100 : Math.min(100, Math.round((meter.used / meter.limit) * 100));
            return (
              <div key={meter.label} className="rounded-2xl border border-stone-100 bg-stone-50/70 p-4">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="flex items-center gap-2 text-stone-600">
                    <i className={`fa-solid ${meter.icon} text-brand-500`} /> {meter.label}
                  </span>
                  <span className={full ? "text-rose-600" : "text-stone-500"}>
                    {meter.used} / {limitLabel(meter.limit)}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className={`h-full rounded-full ${full ? "bg-rose-500" : "bg-brand-500"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {full && (
                  <p className="mt-2 text-[11px] font-bold text-rose-600">
                    وصلت للحد — رقّي الخطة باش تزيد أكثر.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-black text-stone-900">بدّل الخطة</h2>
        <p className="mt-1 text-xs font-medium text-stone-400">
          التبديل كيتفعّل دغيا وكيتسجل فاتورة جديدة. سدّدها بتحويل CCP وصيفط الوصل فواتساب (التفاصيل
          تحت)، ومن بعد ما نتأكدو كنعلموها «مدفوعة».
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {PLAN_ORDER.map((key) => {
            const plan = PLANS[key];
            const active = current.key === key;
            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-3xl border p-6 ${
                  active ? "border-brand-300 bg-brand-50/50 shadow-soft" : "border-stone-200 bg-white"
                }`}
              >
                {active && (
                  <span className="absolute -top-3 right-5 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-black text-white shadow">
                    خطتك الحالية
                  </span>
                )}
                <h3 className="text-base font-black text-stone-900">{plan.name}</h3>
                <p className="mt-1 text-xs text-stone-500">{plan.tagline}</p>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-stone-900">{money(plan.price)}</span>
                  <span className="text-[11px] font-bold text-stone-400">
                    {plan.price === 0 ? "للأبد" : "/ شهر"}
                  </span>
                </p>
                <ul className="mt-4 flex-1 space-y-2 border-t border-stone-200/70 pt-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs font-medium text-stone-600">
                      <i className="fa-solid fa-check mt-0.5 text-brand-500" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>

                {active ? (
                  <span className="mt-5 rounded-full bg-white px-4 py-2.5 text-center text-xs font-black text-brand-700 ring-1 ring-brand-100">
                    مفعّلة
                  </span>
                ) : (
                  <form action={choosePlan} className="mt-5">
                    <input type="hidden" name="plan" value={key} />
                    <button type="submit" className="btn-primary w-full !py-2.5 !text-xs">
                      {getPlan(key).price === 0 ? "رجوع للبداية" : `اختر ${plan.name}`}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <PaymentBox amount={pending?.amount} reference={pending?.number} />

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 className="text-sm font-black text-stone-900">الفواتير</h2>
          <span className="text-[11px] font-bold text-stone-400">{invoices.length} فاتورة</span>
        </div>

        {invoices.length === 0 ? (
          <p className="p-8 text-center text-sm font-medium text-stone-400">
            مازال ما عندك حتى فاتورة. أول اشتراك مدفوع كيسجل هنا.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-right text-sm">
              <thead className="bg-stone-50 text-[11px] font-black text-stone-500">
                <tr>
                  <th className="px-5 py-3">الرقم</th>
                  <th className="px-5 py-3">الخطة</th>
                  <th className="px-5 py-3">الفترة</th>
                  <th className="px-5 py-3">المبلغ</th>
                  <th className="px-5 py-3">الحالة</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {invoices.map((invoice) => {
                  const plan = getPlan(invoice.plan);
                  const status = INVOICE_STATUS[invoice.status] ?? INVOICE_STATUS.pending;
                  return (
                    <tr key={invoice.id}>
                      <td dir="ltr" className="px-5 py-4 text-left font-black text-stone-700">
                        {invoice.number}
                      </td>
                      <td className="px-5 py-4 font-bold text-stone-600">{plan.name}</td>
                      <td dir="ltr" className="px-5 py-4 text-left text-xs font-bold text-stone-500">
                        {invoice.period_start} → {invoice.period_end}
                      </td>
                      <td className="px-5 py-4 font-black text-stone-800">{money(invoice.amount)}</td>
                      <td className="px-5 py-4">
                        <span className={`chip ${status.cls}`}>{status.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/dashboard/billing/${invoice.id}`}
                          className="text-xs font-black text-brand-600 hover:underline"
                        >
                          عرض الفاتورة
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
