export const ORDER_STATUS = {
  new: { label: "جديد", cls: "bg-amber-100 text-amber-700", icon: "fa-bell" },
  confirmed: { label: "مؤكد", cls: "bg-blue-100 text-blue-700", icon: "fa-check" },
  done: { label: "مكتمل", cls: "bg-emerald-100 text-emerald-700", icon: "fa-circle-check" },
  cancelled: { label: "ملغى", cls: "bg-stone-200 text-stone-600", icon: "fa-ban" },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;
