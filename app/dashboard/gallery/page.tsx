import type { Metadata } from "next";
import Link from "next/link";
import { addGalleryItem, deleteGalleryItem } from "@/app/actions/store";
import { Flash } from "@/components/flash";
import { ImageField } from "@/components/image-field";
import { getCurrentStore } from "@/lib/auth";
import { getGallery } from "@/lib/stores";
import { planUsage } from "@/lib/subscriptions";

export const metadata: Metadata = { title: "المعرض" };

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await getCurrentStore();
  if (!session) return null;
  const { store } = session;
  const { ok, error } = await searchParams;
  const items = await getGallery(store.id);
  const usage = await planUsage(store);
  const locked = usage.atGalleryLimit;

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">معرض الأعمال</h1>
        <p className="mt-1 text-sm text-stone-500">
          {items.length} / {usage.plan.galleryLimit ?? "∞"} صورة فخطة {usage.plan.name} · المعرض هو
          أول حاجة كتشوفها العين قبل الطلب.
        </p>
      </div>

      <div className="mt-6">
        <Flash ok={ok} error={error} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          {items.length === 0 ? (
            <div className="card grid place-items-center p-10 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-2xl text-brand-500">
                <i className="fa-solid fa-images" />
              </span>
              <h2 className="mt-4 text-lg font-black text-stone-900">المعرض خاوي</h2>
              <p className="mt-1 max-w-xs text-sm text-stone-500">
                زيد صور لأحسن أعمالك — الصور هي اللي كتبيع.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <figure key={item.id} className="group relative overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
                  <div className="h-48 overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.caption || store.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between gap-2 px-4 py-3">
                    <span className="truncate text-xs font-bold text-stone-600">
                      {item.caption || "بلا تعليق"}
                    </span>
                    <form action={deleteGalleryItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="حذف الصورة"
                      >
                        <i className="fa-solid fa-trash text-xs" />
                      </button>
                    </form>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          {locked ? (
            <div className="card space-y-4 p-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-xl text-rose-500">
                <i className="fa-solid fa-lock" />
              </span>
              <h2 className="text-sm font-black text-stone-900">
                وصلت للحد ديال خطة {usage.plan.name}
              </h2>
              <p className="text-xs font-medium text-stone-500">
                الخطة كتسمح بـ {usage.plan.galleryLimit} صور. رقّي الخطة باش تزيد صور، ولا حيّد
                صورة قديمة باش تفرغ بلاصة.
              </p>
              <Link href="/dashboard/billing" className="btn-primary w-full !py-2.5 !text-xs">
                <i className="fa-solid fa-crown text-[10px]" /> شوف الخطط
              </Link>
            </div>
          ) : (
          <form action={addGalleryItem} className="card space-y-4 p-5">
            <h2 className="text-sm font-black text-stone-900">صورة جديدة</h2>
            <ImageField label="الصورة" />
            <div>
              <label className="label" htmlFor="caption">
                تعليق قصير
              </label>
              <input
                id="caption"
                name="caption"
                placeholder="كيك زفاف ملكي"
                className="input"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              <i className="fa-solid fa-plus" /> إضافة للمعرض
            </button>
          </form>
          )}
        </aside>
      </div>
    </div>
  );
}
