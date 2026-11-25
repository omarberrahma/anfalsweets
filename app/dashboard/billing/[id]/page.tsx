import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flash } from "@/components/flash";
import { PaymentBox } from "@/components/payment-box";
import { PrintButton } from "@/components/print-button";
import { getCurrentStore } from "@/lib/auth";
import { money } from "@/lib/db";
import { getPlan } from "@/lib/plans";
import { getInvoice } from "@/lib/subscriptions";

export const metadata: Metadata = { title: "فاتورة" };

const INVOICE_STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "مدفوعة", cls: "bg-emerald-100 text-emerald-700" },
  pending: { label: "في انتظار الدفع", cls: "bg-amber-100 text-amber-700" },
};

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const session = await getCurrentStore();
  if (!session) return null;
  const { store, user } = session;
  const { id } = await params;
  const { ok } = await searchParams;

  const invoice = await getInvoice(store.id, Number(id));
  if (!invoice) notFound();

  const plan = getPlan(invoice.plan);
  const status = INVOICE_STATUS[invoice.status] ?? INVOICE_STATUS.pending;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/dashboard/billing"
          className="text-sm font-black text-stone-500 hover:text-brand-600"
        >
          <i className="fa-solid fa-arrow-right text-xs" /> رجوع للاشتراك والفواتير
        </Link>
        <PrintButton />
      </div>

      <div className="print:hidden">
        <Flash ok={ok} />
      </div>

      <article className="card p-6 sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-stone-100 pb-6">
          <div>
            <p className="text-lg font-black text-stone-900">طبقات</p>
            <p className="text-[11px] font-bold text-stone-400">منصة متاجر الحلويات</p>
            <p className="mt-3 text-xs font-medium text-stone-500">
              تبوكات · الجزائر
              <br />
              support@tabaqat.app
            </p>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black text-stone-900">فاتورة</h1>
            <p dir="ltr" className="mt-1 text-left text-xs font-black text-stone-600">
              {invoice.number}
            </p>
            <p dir="ltr" className="text-left text-[11px] font-bold text-stone-400">
              {invoice.created_at.slice(0, 10)}
            </p>
            <span className={`chip mt-2 ${status.cls}`}>{status.label}</span>
          </div>
        </header>

        <div className="grid gap-6 border-b border-stone-100 py-6 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-black text-stone-400">الفاتورة لـ</p>
            <p className="mt-1 text-sm font-black text-stone-800">{store.name}</p>
            <p className="text-xs font-bold text-stone-500">{user.name}</p>
            <p dir="ltr" className="text-left text-[11px] font-medium text-stone-400">
              {user.email}
            </p>
            {store.city && <p className="text-xs font-medium text-stone-500">{store.city}</p>}
          </div>
          <div className="sm:text-left">
            <p className="text-[11px] font-black text-stone-400">فترة الاشتراك</p>
            <p dir="ltr" className="mt-1 text-left text-sm font-bold text-stone-700">
              {invoice.period_start} → {invoice.period_end}
            </p>
            <p className="mt-1 text-[11px] font-medium text-stone-400">
              {invoice.months} شهر · متجددة كل شهر
            </p>
          </div>
        </div>

        <table className="mt-6 w-full text-right text-sm">
          <thead className="text-[11px] font-black text-stone-400">
            <tr>
              <th className="pb-3">البيان</th>
              <th className="pb-3">الكمية</th>
              <th className="pb-3">السعر</th>
              <th className="pb-3">المجموع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 border-y border-stone-100">
            <tr>
              <td className="py-4">
                <p className="font-black text-stone-800">اشتراك خطة {plan.name}</p>
                <p className="mt-0.5 text-[11px] font-medium text-stone-400">
                  حتى {plan.productLimit === null ? "عدد غير محدود" : plan.productLimit} منتج و{" "}
                  {plan.galleryLimit === null ? "عدد غير محدود" : plan.galleryLimit} صورة فالمعرض
                </p>
              </td>
              <td className="py-4 font-bold text-stone-600">{invoice.months}</td>
              <td className="py-4 font-bold text-stone-600">{money(plan.price)}</td>
              <td className="py-4 font-black text-stone-800">{money(invoice.amount)}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 flex flex-col items-end gap-1">
          <p className="text-xs font-bold text-stone-400">المجموع (بلا رسوم إضافية)</p>
          <p className="text-2xl font-black text-stone-900">{money(invoice.amount)}</p>
          <p className="text-[11px] font-medium text-stone-400">
            {invoice.status === "paid"
              ? "تم تسديد هاد الفاتورة."
              : "سدد هاد الفاتورة بتحويل CCP وصيفط الوصل فواتساب — التفاصيل تحت."}
          </p>
        </div>

        <footer className="mt-8 border-t border-stone-100 pt-5 text-center text-[11px] font-medium text-stone-400">
          شكراً على ثقتك فطبقات 🤍 — هاد الفاتورة صادرة أوتوماتيكياً من حسابك.
        </footer>
      </article>

      {invoice.status === "pending" && (
        <div className="print:hidden">
          <PaymentBox amount={invoice.amount} reference={invoice.number} />
        </div>
      )}
    </div>
  );
}
