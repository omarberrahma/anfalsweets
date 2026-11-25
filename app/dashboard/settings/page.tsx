import type { Metadata } from "next";
import Link from "next/link";
import { saveSettings } from "@/app/actions/store";
import { CopyLink } from "@/components/copy-link";
import { Flash } from "@/components/flash";
import { ImageField } from "@/components/image-field";
import { getCurrentStore } from "@/lib/auth";

export const metadata: Metadata = { title: "إعدادات المتجر" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await getCurrentStore();
  if (!session) return null;
  const { store, user } = session;
  const { ok, error } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">إعدادات المتجر</h1>
          <p className="mt-1 text-sm text-stone-500">
            هاد المعلومات هي اللي كتبان للزبون فمتجرك.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopyLink path={`/s/${store.slug}`} />
          <Link href={`/s/${store.slug}`} target="_blank" className="btn-primary !px-4 !py-2 text-xs">
            <i className="fa-solid fa-arrow-up-left-from-square text-[10px]" /> معاينة
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <Flash ok={ok} error={error} />
      </div>

      <form action={saveSettings} className="space-y-6">
        <section className="card p-6">
          <h2 className="text-sm font-black text-stone-900">الهوية</h2>
          <p className="text-xs font-medium text-stone-400">اسم المتجر، الرابط، والصنف.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">
                اسم المتجر *
              </label>
              <input id="name" name="name" required defaultValue={store.name} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="slug">
                رابط المتجر *
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
                <span dir="ltr" className="text-xs font-bold text-stone-400">/s/</span>
                <input
                  id="slug"
                  name="slug"
                  required
                  dir="ltr"
                  pattern="[a-z0-9\-]{3,30}"
                  defaultValue={store.slug}
                  className="w-full border-0 bg-transparent p-0 text-sm font-bold text-stone-800 outline-none"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="tagline">
                الشعار القصير
              </label>
              <input
                id="tagline"
                name="tagline"
                defaultValue={store.tagline}
                placeholder="نصنع السعادة في كل طبقة 🎂"
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="category">
                الصنف
              </label>
              <select id="category" name="category" defaultValue={store.category} className="input">
                <option value="cake">كيك ديزاين</option>
                <option value="traditional">حلويات تقليدية</option>
                <option value="both">بجوج</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="accent">
                لون المتجر
              </label>
              <div className="flex items-center gap-3">
                <span
                  className="h-11 w-14 rounded-xl border border-stone-200"
                  style={{ backgroundColor: store.accent }}
                  aria-hidden
                />
                <input
                  id="accent"
                  name="accent"
                  defaultValue={store.accent}
                  dir="ltr"
                  pattern="#[0-9a-fA-F]{6}"
                  className="input ltr:text-left"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="about">
                من نحن
              </label>
              <textarea
                id="about"
                name="about"
                rows={4}
                defaultValue={store.about}
                placeholder="حكي للزبون على تجربتك، المكونات، وكيفاش بديت..."
                className="input resize-none"
              />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-sm font-black text-stone-900">الصور</h2>
          <p className="text-xs font-medium text-stone-400">
            الشعار وصورة الغلاف. خليهم فارغين وتظهر أول حرف من اسم متجرك.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ImageField name="logo_url" defaultValue={store.logo_url} label="الشعار" />
            <ImageField name="cover_url" defaultValue={store.cover_url} label="صورة الغلاف" />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-sm font-black text-stone-900">التواصل</h2>
          <p className="text-xs font-medium text-stone-400">
            رقم الواتساب بالصيغة الدولية بلا + (مثال: 213771077617).
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="phone">
                رقم الهاتف
              </label>
              <input
                id="phone"
                name="phone"
                dir="ltr"
                defaultValue={store.phone}
                placeholder="0771 07 76 17"
                className="input ltr:text-left"
              />
            </div>
            <div>
              <label className="label" htmlFor="whatsapp">
                رقم الواتساب الدولي
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                dir="ltr"
                defaultValue={store.whatsapp}
                placeholder="213771077617"
                className="input ltr:text-left"
              />
            </div>
            <div>
              <label className="label" htmlFor="city">
                المدينة
              </label>
              <input id="city" name="city" defaultValue={store.city} placeholder="الجزائر العاصمة" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="instagram">
                إنستغرام (بلا @)
              </label>
              <input
                id="instagram"
                name="instagram"
                dir="ltr"
                defaultValue={store.instagram}
                placeholder="anfal.sweets"
                className="input ltr:text-left"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="delivery">
                التوصيل
              </label>
              <input
                id="delivery"
                name="delivery"
                defaultValue={store.delivery}
                placeholder="توصيل داخل الولاية خلال 24 ساعة..."
                className="input"
              />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-sm font-black text-stone-900">الحساب</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p className="rounded-2xl bg-stone-50 px-4 py-3">
              <span className="block text-[11px] font-bold text-stone-400">الاسم</span>
              <span className="font-black text-stone-700">{user.name}</span>
            </p>
            <p className="rounded-2xl bg-stone-50 px-4 py-3">
              <span className="block text-[11px] font-bold text-stone-400">البريد الإلكتروني</span>
              <span dir="ltr" className="block text-left font-black text-stone-700">
                {user.email}
              </span>
            </p>
          </div>
        </section>

        <div className="sticky bottom-4 z-20 flex justify-end">
          <button type="submit" className="btn-primary shadow-xl">
            <i className="fa-solid fa-floppy-disk" /> حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
}
