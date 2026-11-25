import type { Metadata } from "next";
import Link from "next/link";
import { deleteProduct, saveProduct, toggleFeatured } from "@/app/actions/store";
import { Flash } from "@/components/flash";
import { ImageField } from "@/components/image-field";
import { getCurrentStore } from "@/lib/auth";
import { get, money, type Product } from "@/lib/db";
import { getProducts } from "@/lib/stores";
import { planUsage } from "@/lib/subscriptions";

export const metadata: Metadata = { title: "المنتجات" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; edit?: string }>;
}) {
  const session = await getCurrentStore();
  if (!session) return null;
  const { store } = session;
  const { ok, error, edit } = await searchParams;
  const products = await getProducts(store.id);
  const usage = await planUsage(store);
  const locked = usage.atProductLimit;
  const editing = edit
    ? await get<Product>("SELECT * FROM products WHERE id = ? AND store_id = ?", [
        Number(edit),
        store.id,
      ])
    : undefined;

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">المنتجات</h1>
          <p className="mt-1 text-sm text-stone-500">
            {products.length} / {usage.plan.productLimit ?? "∞"} منتج فخطة {usage.plan.name} · اضغط على أي
            منتج باش تعدّلو.
          </p>
        </div>
        <Link href={`/s/${store.slug}`} target="_blank" className="btn-ghost !px-5 !py-2.5">
          <i className="fa-solid fa-arrow-up-left-from-square text-xs" /> عرض المتجر
        </Link>
      </div>

      <div className="mt-6">
        <Flash ok={ok} error={error} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LIST */}
        <div className="space-y-3">
          {products.length === 0 && (
            <div className="card grid place-items-center p-10 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-2xl text-brand-500">
                <i className="fa-solid fa-cake-candles" />
              </span>
              <h2 className="mt-4 text-lg font-black text-stone-900">مازال ما عندك منتجات</h2>
              <p className="mt-1 max-w-xs text-sm text-stone-500">
                زيد أول منتج من الفورم اللي على جنب، وبان فوراً فمتجرك.
              </p>
            </div>
          )}

          {products.map((product) => (
            <div
              key={product.id}
              className={`card flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${
                editing?.id === product.id ? "ring-2 ring-brand-300" : ""
              }`}
            >
              <div className="h-24 w-full flex-shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:h-20 sm:w-20">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-stone-300">
                    <i className="fa-regular fa-image" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-black text-stone-900">{product.name}</h2>
                  {product.featured === 1 && (
                    <span className="chip bg-amber-100 text-amber-700">
                      <i className="fa-solid fa-star text-[9px]" /> مميز
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs font-medium text-stone-500">
                  {product.description || "بلا وصف"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
                  <span className="text-brand-700">
                    {money(product.price)} <span className="text-stone-400">/ {product.unit}</span>
                  </span>
                  <span className="chip bg-stone-100 text-stone-500">{product.category}</span>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-1.5">
                <Link
                  href={`/dashboard/products?edit=${product.id}`}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-stone-200 text-stone-500 transition hover:border-brand-200 hover:text-brand-600"
                  aria-label="تعديل"
                >
                  <i className="fa-solid fa-pen text-xs" />
                </Link>
                <form action={toggleFeatured}>
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    type="submit"
                    className={`grid h-9 w-9 place-items-center rounded-xl border text-xs transition ${
                      product.featured
                        ? "border-amber-200 bg-amber-50 text-amber-600"
                        : "border-stone-200 text-stone-400 hover:text-amber-500"
                    }`}
                    aria-label="تمييز المنتج"
                  >
                    <i className="fa-solid fa-star" />
                  </button>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    type="submit"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-stone-200 text-stone-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="حذف"
                  >
                    <i className="fa-solid fa-trash text-xs" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        {/* FORM */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          {locked && !editing ? (
            <div className="card space-y-4 p-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-xl text-rose-500">
                <i className="fa-solid fa-lock" />
              </span>
              <h2 className="text-sm font-black text-stone-900">
                وصلت للحد ديال خطة {usage.plan.name}
              </h2>
              <p className="text-xs font-medium text-stone-500">
                الخطة كتسمح بـ {usage.plan.productLimit} منتجات. رقّي الخطة باش تزيد منتجات جداد،
                ولا حيّد منتج قديم باش تفرغ بلاصة.
              </p>
              <Link href="/dashboard/billing" className="btn-primary w-full !py-2.5 !text-xs">
                <i className="fa-solid fa-crown text-[10px]" /> شوف الخطط
              </Link>
            </div>
          ) : (
          <form action={saveProduct} className="card space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-stone-900">
                {editing ? "تعديل المنتج" : "منتج جديد"}
              </h2>
              {editing && (
                <Link href="/dashboard/products" className="text-[11px] font-bold text-stone-400 hover:text-stone-700">
                  إلغاء التعديل ✕
                </Link>
              )}
            </div>

            {editing && <input type="hidden" name="id" value={editing.id} />}

            <div>
              <label className="label" htmlFor="name">
                اسم المنتج *
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={editing?.name ?? ""}
                placeholder="لاير كيك الفانيليا والتوت"
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="price">
                  السعر (دج) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  step={100}
                  required
                  defaultValue={editing?.price ?? ""}
                  placeholder="4500"
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="unit">
                  الوحدة
                </label>
                <input
                  id="unit"
                  name="unit"
                  defaultValue={editing?.unit ?? "الوحدة"}
                  placeholder="الكيلو / العلبة"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="category">
                التصنيف
              </label>
              <input
                id="category"
                name="category"
                list="categories"
                defaultValue={editing?.category ?? ""}
                placeholder="لاير كيك / حلويات الأعراس..."
                className="input"
              />
              <datalist id="categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="label" htmlFor="description">
                الوصف
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editing?.description ?? ""}
                placeholder="وصف قصير يشهّي الزبون..."
                className="input resize-none"
              />
            </div>

            <ImageField defaultValue={editing?.image_url ?? ""} />

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={editing?.featured === 1}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="text-xs font-bold text-stone-700">منتج مميز (يبان فالأول)</span>
            </label>

            <button type="submit" className="btn-primary w-full">
              <i className={`fa-solid ${editing ? "fa-floppy-disk" : "fa-plus"}`} />
              {editing ? "حفظ التعديلات" : "إضافة المنتج"}
            </button>
          </form>
          )}
        </aside>
      </div>
    </div>
  );
}
