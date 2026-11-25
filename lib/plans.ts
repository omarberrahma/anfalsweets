export type PlanKey = "start" | "pro" | "weddings";

export type Plan = {
  key: PlanKey;
  name: string;
  price: number;
  period: string;
  tagline: string;
  productLimit: number | null;
  galleryLimit: number | null;
  features: string[];
  highlight?: boolean;
};

export const PLANS: Record<PlanKey, Plan> = {
  start: {
    key: "start",
    name: "البداية",
    price: 0,
    period: "دج / للأبد",
    tagline: "باش تجرّب المنصة وتطلق أول متجر ليك.",
    productLimit: 10,
    galleryLimit: 10,
    features: [
      "متجر إلكتروني واحد",
      "حتى 10 منتجات",
      "حتى 10 صور فالمعرض",
      "طلبات غير محدودة",
    ],
  },
  pro: {
    key: "pro",
    name: "المحترف",
    price: 1900,
    period: "دج / شهرياً",
    tagline: "للحرفيين اللي يبيعو بانتظام ويحتاجو حرية كاملة.",
    productLimit: 100,
    galleryLimit: 100,
    features: [
      "حتى 100 منتج",
      "حتى 100 صورة فالمعرض",
      "شعار وألوان خاصة",
      "أولوية فالدليل العام",
      "دعم عبر واتساب",
    ],
    highlight: true,
  },
  weddings: {
    key: "weddings",
    name: "الأعراس",
    price: 3900,
    period: "دج / شهرياً",
    tagline: "لمحلات الحلويات اللي تخدم الأعراس والطلبات الكبيرة.",
    productLimit: null,
    galleryLimit: null,
    features: [
      "منتجات وصور بلا حدود",
      "كل مزايا المحترف",
      "طلبات بالكمية والتشكيلات",
      "دعم أولوية على واتساب",
    ],
  },
};

export const PLAN_ORDER: PlanKey[] = ["start", "pro", "weddings"];

export function isPlanKey(value: string): value is PlanKey {
  return value === "start" || value === "pro" || value === "weddings";
}

export function getPlan(value: string | null | undefined): Plan {
  return isPlanKey(value ?? "") ? PLANS[value as PlanKey] : PLANS.start;
}

export function limitLabel(limit: number | null): string {
  return limit === null ? "بلا حدود" : String(limit);
}
