import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createOrder } from "@/app/actions/store";
import { CATEGORY_LABELS, getGallery, getProducts, getStoreBySlug, waLink } from "@/lib/stores";
import { money } from "@/lib/db";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: "المتجر غير موجود" };
  return {
    title: `${store.name} — ${CATEGORY_LABELS[store.category] ?? "حلويات"}`,
    description: store.about || store.tagline,
  };
}

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ ordered?: string; orderError?: string; p?: string }>;
}) {
  const { slug } = await params;
  const { ordered, orderError, p } = await searchParams;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const products = await getProducts(store.id);
  const gallery = await getGallery(store.id);
  const accent = store.accent || "#db2777";

  const groups = new Map<string, typeof products>();
  for (const product of products) {
    const key = product.category || "منتجاتنا";
    groups.set(key, [...(groups.get(key) ?? []), product]);
  }

  const whatsapp = store.whatsapp
    ? waLink(store.whatsapp, `مرحباً ${store.name}، بغيت نستفسر على الطلب.`)
    : "#order";

  return (
    <div className="min-h-screen bg-cream" style={{ ["--accent" as string]: accent }}>
      {/* TOP BAR */}
      <div className="bg-stone-900 text-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-2 py-2 text-[11px] font-bold sm:text-xs">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot" style={{ color: accent }} />
            {store.city || "الجزائر"}
            {store.phone && <span className="hidden text-white/60 sm:inline">· {store.phone}</span>}
          </span>
          <span className="flex items-center gap-2 text-white/70">
            <i className="fa-solid fa-truck-fast" /> {store.delivery ? "التوصيل متوفر" : "طلبات بالحجز المسبق"}
          </span>
        </div>
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-cream/90 backdrop-blur-xl">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <Link href={`/s/${store.slug}`} className="flex items-center gap-3">
            <span
              className="grid h-12 w-12 flex-shrink-0 place-items-center overflow-hidden rounded-2xl text-lg font-black text-white shadow-lg"
              style={{ backgroundColor: accent }}
            >
              {store.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={store.logo_url} alt={store.name} className="h-full w-full object-cover" />
              ) : (
                store.name.slice(0, 1)
              )}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-black text-stone-900">{store.name}</span>
              <span className="text-[10px] font-bold" style={{ color: accent }}>
                {CATEGORY_LABELS[store.category] ?? "حلويات"}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              ["#menu", "القائمة"],
              ["#gallery", "المعرض"],
              ["#about", "من نحن"],
              ["#order", "اطلب"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-bold text-stone-600 transition hover:bg-white hover:text-stone-900"
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href={whatsapp}
            target={store.whatsapp ? "_blank" : undefined}
            rel="noreferrer"
            className="btn !px-5 !py-2.5 text-white shadow-lg"
            style={{ backgroundColor: accent }}
          >
            <i className="fa-brands fa-whatsapp text-base" /> اطلب الآن
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {store.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={store.cover_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full" style={{ backgroundColor: accent }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/55 to-stone-900/20" />
        </div>

        <div className="container-x relative py-20 text-white sm:py-28">
          <span className="chip bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
            <i className="fa-solid fa-location-dot" /> {store.city || "الجزائر"}
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {store.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{store.tagline}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#order" className="btn !px-7 !py-4 !text-base text-white" style={{ backgroundColor: accent }}>
              <i className="fa-solid fa-bag-shopping" /> اطلب من المتجر
            </a>
            <a
              href="#menu"
              className="btn border border-white/40 !px-7 !py-4 !text-base text-white backdrop-blur hover:bg-white/10"
            >
              شوف القائمة
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs font-bold text-white/70">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-cake-candles" /> {store.product_count} منتج
            </span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-images" /> {store.gallery_count} صورة
            </span>
            {store.instagram && (
              <a
                href={`https://instagram.com/${store.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white"
              >
                <i className="fa-brands fa-instagram" /> @{store.instagram}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-16 sm:py-20">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: accent }}>
                القائمة
              </span>
              <h2 className="mt-2 text-3xl font-black text-stone-900 sm:text-4xl">شنو كنقدمو</h2>
            </div>
            <p className="max-w-sm text-sm text-stone-500">
              كل ما تشوفه مصنوع بالطلب. اختر اللي عجبك وزيدو للطلب.
            </p>
          </div>

          {products.length === 0 ? (
            <p className="mt-10 rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm font-bold text-stone-400">
              القائمة مازال كتمتلأ. تواصل معانا على واتساب.
            </p>
          ) : (
            <div className="mt-10 space-y-12">
              {[...groups.entries()].map(([category, items]) => (
                <div key={category}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                    <h3 className="text-xl font-black text-stone-900">{category}</h3>
                    <span className="h-px flex-1 bg-stone-200" />
                    <span className="text-[11px] font-bold text-stone-400">{items.length} منتج</span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((product) => (
                      <article
                        key={product.id}
                        className="group flex flex-col overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                      >
                        <div className="relative h-52 overflow-hidden bg-stone-100">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-stone-300">
                              <i className="fa-solid fa-cake-candles text-3xl" />
                            </div>
                          )}
                          {product.featured === 1 && (
                            <span className="absolute top-3 right-3 chip bg-amber-400 text-stone-900 shadow">
                              <i className="fa-solid fa-star text-[9px]" /> مميز
                            </span>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h4 className="text-lg font-black text-stone-900">{product.name}</h4>
                          <p className="mt-1 flex-1 text-sm leading-relaxed text-stone-500">
                            {product.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                            <p className="text-sm font-black text-stone-900">
                              {money(product.price)}
                              <span className="text-[11px] font-bold text-stone-400"> / {product.unit}</span>
                            </p>
                            <Link
                              href={`/s/${store.slug}?p=${product.id}#order`}
                              className="rounded-full px-4 py-2 text-xs font-black text-white transition hover:opacity-90"
                              style={{ backgroundColor: accent }}
                            >
                              اطلب <i className="fa-solid fa-arrow-left mr-1 text-[9px]" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section id="gallery" className="border-y border-stone-100 bg-white py-16 sm:py-20">
          <div className="container-x">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: accent }}>
                  المعرض
                </span>
                <h2 className="mt-2 text-3xl font-black text-stone-900 sm:text-4xl">من أعمالنا</h2>
              </div>
              {store.instagram && (
                <a
                  href={`https://instagram.com/${store.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 sm:flex"
                >
                  <i className="fa-brands fa-instagram" /> المزيد على إنستغرام
                </a>
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {gallery.map((item, index) => (
                <figure
                  key={item.id}
                  className={`group relative overflow-hidden rounded-2xl bg-stone-100 ${
                    index % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.caption || store.name}
                    className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                      index % 5 === 0 ? "h-64 lg:h-full" : "h-40 sm:h-52"
                    }`}
                  />
                  {item.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/80 to-transparent p-3 text-xs font-bold text-white">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      <section id="about" className="py-16 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[2rem] border border-stone-100 bg-white p-7 sm:p-9">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: accent }}>
              من نحن
            </span>
            <h2 className="mt-2 text-3xl font-black text-stone-900">
              {store.name}، حرفة وذوق
            </h2>
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-stone-600">
              {store.about || "متجر حلويات يشتغل بالطلب. تواصل معانا باش تعرف المزيد."}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-[11px] font-black text-stone-400">المدينة</p>
                <p className="mt-1 text-sm font-bold text-stone-800">{store.city || "الجزائر"}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-[11px] font-black text-stone-400">التوصيل</p>
                <p className="mt-1 text-sm font-bold text-stone-800">
                  {store.delivery || "حسب الاتفاق"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {whatsapp !== "#order" && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-3xl bg-emerald-500 p-5 text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 text-2xl">
                  <i className="fa-brands fa-whatsapp" />
                </span>
                <span>
                  <span className="block text-sm font-black">استفسر على واتساب</span>
                  <span className="block text-xs text-white/80">رد سريع على كل الأسئلة</span>
                </span>
                <i className="fa-solid fa-arrow-left mr-auto transition group-hover:-translate-x-1" />
              </a>
            )}

            {store.phone && (
              <a
                href={`tel:${store.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-4 rounded-3xl border border-stone-200 bg-white p-5 transition hover:border-stone-300"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl text-lg text-white"
                  style={{ backgroundColor: accent }}
                >
                  <i className="fa-solid fa-phone" />
                </span>
                <span>
                  <span className="block text-sm font-black text-stone-900">اتصل مباشرة</span>
                  <span dir="ltr" className="block text-xs font-bold text-stone-500">
                    {store.phone}
                  </span>
                </span>
              </a>
            )}

            <div className="rounded-3xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-black text-stone-900">ساعات العمل</p>
              <div className="mt-3 space-y-2 text-xs font-bold text-stone-500">
                <p className="flex justify-between">
                  <span>السبت - الخميس</span> <span className="text-stone-800">09:00 - 20:00</span>
                </p>
                <p className="flex justify-between">
                  <span>الجمعة</span> <span style={{ color: accent }}>مغلق</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER */}
      <section id="order" className="border-t border-stone-100 bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: accent }}>
              طلب
            </span>
            <h2 className="mt-2 text-3xl font-black text-stone-900 sm:text-4xl">
              احجز طلبك دابا
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-500">
              عمّر الفورم و{store.name} غادي يتواصل معاك باش يأكد الطلب، الثمن، وموعد التسليم.
              ما كاين حتى خلاص أونلاين — الخلاص عند التسليم.
            </p>

            <ul className="mt-7 space-y-3 text-sm font-bold text-stone-700">
              {[
                "اختر المنتج والكمية اللي بغيت",
                "حدد تاريخ المناسبة",
                "نتواصلو معاك للتأكيد",
              ].map((line, i) => (
                <li key={line} className="flex items-center gap-3">
                  <span
                    className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-[11px] font-black text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {i + 1}
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-stone-50 p-4 text-xs font-bold text-stone-500">
              <i className="fa-solid fa-circle-info ml-1" style={{ color: accent }} />
              الطلبات الكبيرة والأعراس: تواصل معانا مباشرة على واتساب.
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-100 bg-cream p-6 shadow-sm sm:p-8">
            {ordered ? (
              <div className="py-10 text-center">
                <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
                  <i className="fa-solid fa-check" />
                </span>
                <h3 className="mt-5 text-2xl font-black text-stone-900">تسجل طلبك! 🎉</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
                  {store.name} غادي يتواصل معاك قريباً باش يأكد التفاصيل. تقدر حتى تعجل
                  بالتواصل على واتساب.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                  {store.whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="btn !bg-emerald-500 text-white hover:!bg-emerald-600"
                    >
                      <i className="fa-brands fa-whatsapp" /> واتساب
                    </a>
                  )}
                  <a href="#menu" className="btn-ghost">
                    رجوع للقائمة
                  </a>
                </div>
              </div>
            ) : (
              <form action={createOrder} className="space-y-4">
                <input type="hidden" name="slug" value={store.slug} />

                {orderError && (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                    {orderError}
                  </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="customer_name">
                      الاسم *
                    </label>
                    <input
                      id="customer_name"
                      name="customer_name"
                      required
                      placeholder="اسمك الكامل"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="customer_phone">
                      الهاتف *
                    </label>
                    <input
                      id="customer_phone"
                      name="customer_phone"
                      required
                      inputMode="tel"
                      placeholder="05XXXXXXXX"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="items">
                    شنو بغيت؟
                  </label>
                  <select
                    id="items"
                    name="items"
                    className="input"
                    defaultValue={products.find((x) => String(x.id) === p)?.name ?? ""}
                  >
                    <option value="">اختر منتج...</option>
                    {products.map((product) => (
                      <option key={product.id} value={`${product.name} — ${money(product.price)}`}>
                        {product.name} — {money(product.price)} / {product.unit}
                      </option>
                    ))}
                    <option value="طلب خاص">طلب خاص / تشكيلة</option>
                  </select>
                </div>

                <div>
                  <label className="label" htmlFor="wanted_for">
                    تاريخ المناسبة
                  </label>
                  <input id="wanted_for" name="wanted_for" type="date" className="input" />
                </div>

                <div>
                  <label className="label" htmlFor="notes">
                    تفاصيل إضافية
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="الكمية، الكتابة على الكيك، النكهات، عنوان التوصيل..."
                    className="input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-full !py-4 text-base text-white shadow-lg"
                  style={{ backgroundColor: accent }}
                >
                  <i className="fa-solid fa-paper-plane" /> إرسال الطلب
                </button>
                <p className="text-center text-[11px] font-bold text-stone-400">
                  بالطلب كتوافق على التواصل معاك عبر الهاتف أو واتساب.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* MOBILE ORDER BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          {store.whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn !bg-emerald-500 !px-5 !py-3 text-sm text-white shadow-lg shadow-emerald-500/25 hover:!bg-emerald-600"
              aria-label="تواصل على واتساب"
            >
              <i className="fa-brands fa-whatsapp text-base" />
            </a>
          )}
          <a
            href="#order"
            className="btn flex-1 !py-3 text-sm text-white shadow-lg"
            style={{ backgroundColor: accent }}
          >
            <i className="fa-solid fa-bag-shopping" /> اطلب الآن
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-stone-900 pb-28 pt-10 text-white lg:pb-10">
        <div className="container-x flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-right">
          <div className="flex items-center gap-3">
            <span
              className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl text-sm font-black"
              style={{ backgroundColor: accent }}
            >
              {store.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={store.logo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                store.name.slice(0, 1)
              )}
            </span>
            <div>
              <p className="text-sm font-black">{store.name}</p>
              <p className="text-[11px] text-white/50">
                            {store.city || "الجزائر"} · {CATEGORY_LABELS[store.category] ?? "حلويات"}
          </p>
            </div>
          </div>

          <p className="text-[11px] font-medium text-white/40">
            متجر مدعوم بواسطة{" "}
            <Link href="/" className="font-black text-white/70 hover:text-white">
              طبقات
            </Link>{" "}
            · Tabaqat
          </p>
        </div>
      </footer>
    </div>
  );
}
