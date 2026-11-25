import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreCard } from "@/components/store-card";
import { listPublicStores } from "@/lib/stores";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "متاجر الحلويات",
  description: "تصفح متاجر أصحاب الكيك ديزاين والحلويات التقليدية على منصة طبقات.",
};

export default async function ExplorePage() {
  const stores = await listPublicStores();
  const cakes = stores.filter((s) => s.category === "cake" || s.category === "both");
  const traditional = stores.filter((s) => s.category === "traditional" || s.category === "both");

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="blobs border-b border-stone-100 py-16">
        <div className="container-x">
          <span className="chip bg-brand-50 text-brand-700">دليل المتاجر</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-stone-900 sm:text-5xl">
            اكتشف أحلى الحلويات قريبة منك
          </h1>
          <p className="mt-4 max-w-xl text-stone-600">
            {cakes.length} متجر كيك ديزاين و{traditional.length} متجر حلويات تقليدية، كلهم
            يشتغلو بالطلب ومستعدين لمناسبتك.
          </p>
        </div>
      </section>

      <main className="container-x py-14">
        {stores.length === 0 ? (
          <div className="card grid place-items-center p-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-2xl text-brand-500">
              <i className="fa-solid fa-store" />
            </span>
            <h2 className="mt-4 text-lg font-black text-stone-900">مازال ما كاين حتى متجر</h2>
            <p className="mt-1 text-sm text-stone-500">كون أنت الأول على المنصة.</p>
            <Link href="/signup" className="btn-primary mt-5">
              أنشئ متجرك
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-[2rem] bg-stone-900 p-8 text-center text-white sm:flex-row sm:text-right">
          <div>
            <h2 className="text-xl font-black">عندك أنت حتى محل حلويات؟</h2>
            <p className="mt-1 text-sm text-stone-400">دخّل متجرك للدليل مجاناً فدقائق.</p>
          </div>
          <Link href="/signup" className="btn bg-white !text-stone-900 hover:bg-brand-50">
            أضف متجرك <i className="fa-solid fa-arrow-left text-xs" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
