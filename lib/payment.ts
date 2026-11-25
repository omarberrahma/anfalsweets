import { money } from "./db";

/**
 * معلومات الدفع. بدّل هاد القيم بلي بغيت — كلشي فبلاصة واحدة.
 */
export const PAYMENT = {
  /** رقم الدعم على واتساب بالصيغة الدولية بلا + */
  whatsapp: "213562163900",
  /** صاحب الحساب البريدي الجاري */
  holder: "طبقات — Tabaqat",
  /** رقم الحساب البريدي الجاري (CCP) — 10 أرقام */
  ccp: "0000000000",
  /** مفتاح الحساب (clé) — رقمين */
  key: "00",
  /** RIP ديال BaridiMob (اختياري) */
  rip: "",
};

function digits(value: string) {
  return value.replace(/\D/g, "");
}

/** 0012345678 → 00 123 456 78 */
export function formatCcp(value: string = PAYMENT.ccp): string {
  const clean = digits(value);
  if (clean.length !== 10) return clean;
  return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
}

export function ccpLine(): string {
  return `${formatCcp()} — مفتاح ${PAYMENT.key}`;
}

export function payMessage(reference?: string, amount?: number): string {
  const lines = ["السلام عليكم، حبيت نسدد اشتراك طبقات."];
  if (reference) lines.push(`رقم الفاتورة: ${reference}`);
  if (typeof amount === "number") lines.push(`المبلغ: ${money(amount)}`);
  lines.push("هاهو وصل الدفع 👇");
  return lines.join("\n");
}

export function payLink(reference?: string, amount?: number): string {
  return `https://wa.me/${digits(PAYMENT.whatsapp)}?text=${encodeURIComponent(
    payMessage(reference, amount),
  )}`;
}
