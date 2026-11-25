"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentStore } from "@/lib/auth";
import { getPlan, isPlanKey } from "@/lib/plans";
import { changePlan } from "@/lib/subscriptions";

export async function choosePlan(formData: FormData) {
  const session = await getCurrentStore();
  if (!session) redirect("/login");
  const { store } = session;

  const key = String(formData.get("plan") ?? "");
  if (!isPlanKey(key)) {
    redirect("/dashboard/billing?error=" + encodeURIComponent("الخطة غير صحيحة."));
  }
  if (key === store.plan) {
    redirect("/dashboard/billing?ok=" + encodeURIComponent("هادي هي الخطة اللي عندك دابا."));
  }

  const invoice = await changePlan(store.id, key);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/gallery");

  const plan = getPlan(key);
  redirect(
    `/dashboard/billing/${invoice.id}?ok=` +
      encodeURIComponent(`تفعّلت خطة ${plan.name}. هادي هي الفاتورة ديالك.`),
  );
}
