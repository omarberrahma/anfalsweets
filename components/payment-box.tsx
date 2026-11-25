import { money } from "@/lib/db";
import { PAYMENT, ccpLine, formatCcp, payLink } from "@/lib/payment";
import { CopyValue } from "./copy-value";

const STEPS = [
  "حوّل المبلغ للحساب البريدي الجاري (CCP) من بريد الجزائر ولا BaridiMob.",
  "صوّر وصل الدفع، واكتب عليه رقم الفاتورة.",
  "صيفط لينا الوصل فواتساب، ونفعّلو الاشتراك من بعد ما نتأكدو.",
];

export function PaymentBox({
  amount,
  reference,
}: {
  amount?: number;
  reference?: string;
}) {
  const shown = typeof amount === "number" && amount > 0 ? amount : undefined;

  return (
    <section className="card overflow-hidden border-brand-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-brand-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#25D366] text-white">
            <i className="fa-brands fa-whatsapp text-lg" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-black text-stone-900">الدفع عبر واتساب · CCP</h2>
            <p className="text-[11px] font-bold text-stone-500">
              تحويل بريدي + وصل فواتساب — بلا بطاقة بنكية.
            </p>
          </div>
        </div>
        {shown !== undefined && (
          <p className="text-left">
            <span className="block text-[11px] font-bold text-stone-400">
              {reference ? `الفاتورة ${reference}` : "المبلغ المطلوب"}
            </span>
            <span className="text-xl font-black text-stone-900">{money(shown)}</span>
          </p>
        )}
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2">
        <ol className="space-y-3">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-xs font-medium text-stone-600">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-black text-brand-700">
                {index + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
          <p className="text-[11px] font-black text-stone-400">
            الحساب البريدي الجاري (CCP)
          </p>
          <p className="mt-2 text-sm font-black text-stone-800">{PAYMENT.holder}</p>
          <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-stone-200">
            <span
              dir="ltr"
              className="text-left text-sm font-black tracking-wide text-stone-800"
            >
              {formatCcp()} · {PAYMENT.key}
            </span>
            <CopyValue value={`${formatCcp()} ${PAYMENT.key}`} label="نسخ رقم CCP" />
          </div>
          <p className="mt-2 text-[11px] font-bold text-stone-500">{ccpLine()}</p>
          {PAYMENT.rip && (
            <p className="mt-1 flex items-center justify-between gap-2 text-[11px] font-bold text-stone-500">
              <span dir="ltr" className="text-left">
                RIP: {PAYMENT.rip}
              </span>
              <CopyValue value={PAYMENT.rip} label="نسخ RIP" />
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-stone-100 px-5 py-4">
        <a
          href={payLink(reference, shown)}
          target="_blank"
          rel="noreferrer"
          className="btn-primary w-full !bg-[#25D366] !shadow-[#25D366]/25 hover:!bg-[#1ebe5b] print:hidden"
        >
          <i className="fa-brands fa-whatsapp" aria-hidden /> صيفط وصل الدفع فواتساب
        </a>
        <p className="mt-2 text-center text-[11px] font-medium text-stone-400">
          من بعد ما نتأكدو من الوصل، نفعّلو الاشتراك ونعلمو الفاتورة «مدفوعة» فهاد الصفحة.
        </p>
      </div>
    </section>
  );
}
