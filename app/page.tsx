import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreCard } from "@/components/store-card";
import { listPublicStores } from "@/lib/stores";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: "fa-palette",
    title: "هوية بلمستك",
    text: "شعارك، ألوانك، وصورتك الغلاف. متجرك يبان كأنه صمّمه مصمم محترف.",
  },
  {
    icon: "fa-cake-candles",
    title: "قائمة منتجات ذكية",
    text: "أضف الكيكات أو الحلويات بالكيلو، مع الصور والأسعار والوصف، وبدّل ما تشاء في أي وقت.",
  },
  {
    icon: "fa-images",
    title: "معرض أعمالك",
    text: "اعرض إبداعاتك السابقة باش يثق الزبون ويطلب من عندك هو بالضبط.",
  },
  {
    icon: "fa-clipboard-list",
    title: "طلبات منظمة",
    text: "كل طلب يوصلك بالاسم، الهاتف، تاريخ المناسبة والتفاصيل — ما تضيعش حتى طلب.",
  },
  {
    icon: "fa-whatsapp",
    title: "ربط مباشر بالواتساب",
    text: "الزبون يكمّل الطلب فوراً فـواتساب، بلا ما يعاود يكتب كلشي.",
  },
  {
    icon: "fa-chart-simple",
    title: "إحصائيات واضحة",
    text: "شوف عدد المنتجات، الطلبات الجديدة، والطلبات المكتملة من لوحة واحدة.",
  },
];

const steps = [
  {
    n: "01",
    title: "أنشئ حسابك",
    text: "بالبريد وكلمة السر فقط. تختار اسم المتجر والرابط اللي يعجبك.",
  },
  {
    n: "02",
    title: "عمّر متجرك",
    text: "زيد منتجاتك، الصور، الأسعار، ورقم الواتساب. كلشي كيتبدل بلا كود.",
  },
  {
    n: "03",
    title: "شارك الرابط وستقبل الطلبات",
    text: "حط الرابط فـإنستغرام وبايو. الطلبات كتوصلك مباشرة للوحة التحكم.",
  },
];

const plans = [
  {
    name: "البداية",
    price: "0",
    period: "دج / للأبد",
    text: "باش تجرّب المنصة وتطلق أول متجر ليك.",
    features: ["متجر إلكتروني واحد", "10 منتجات", "10 صور فالمعرض", "طلبات غير محدودة"],
    cta: "ابدأ مجاناً",
    highlight: false,
  },
  {
    name: "المحترف",
    price: "1 900",
    period: "دج / شهرياً",
    text: "للحرفيين اللي يبيعو بانتظام ويحتاجو حرية كاملة.",
    features: [
      "حتى 100 منتج و100 صورة",
      "شعار وألوان خاصة",
      "معرض أعمال كامل",
      "أولوية فالدليل العام",
      "دعم عبر واتساب",
    ],
    cta: "اختر المحترف",
    highlight: true,
  },
  {
    name: "الأعراس",
    price: "3 900",
    period: "دج / شهرياً",
    text: "لمحلات الحلويات اللي تخدم الأعراس والطلبات الكبيرة.",
    features: [
      "كل مزايا المحترف",
      "طلبات بالكمية والتشكيلات",
      "صفحة مخصصة للأعراس",
      "عدة مستخدمين للحساب",
    ],
    cta: "اختر الأعراس",
    highlight: false,
  },
];

const faqs = [
  {
    q: "واش خاصني بطاقة بنكية باش نخلص الاشتراك؟",
    a: "لا. الدفع كيتم بتحويل للحساب البريدي الجاري (CCP)، وصيفط لينا صورة الوصل فواتساب. من بعد ما نتأكدو كنفعّلو الاشتراك.",
  },
  {
    q: "شحال كنحتاج باش نطلق متجري؟",
    a: "5 دقائق فالغالب: أنشئ حساب، عمّر اسم المتجر والرابط، وزيد أول منتجاتك بالصور والأسعار.",
  },
  {
    q: "واش كتاخدو عمولة على الطلبات؟",
    a: "لا، حتى عمولة. كتخلص غير الاشتراك الشهري، والطلبات كتوصلك مباشرة فلوحة التحكم.",
  },
  {
    q: "كيفاش الزبون كيخلص الكيك؟",
    a: "الخلاص بينك وبين الزبون عند التسليم أو حسب الاتفاق. المنصة غير كتنظم الطلبات والتواصل.",
  },
  {
    q: "نقدر نبدل رابط متجري من بعد؟",
    a: "نعم، من إعدادات المتجر. الرابط الجديد كيولي فعال دغيا، وتقدر تشاركو من جديد.",
  },
];

function HeroMockup() {
  return (
    <div className="relative">
      <div className="absolute -top-6 -left-6 h-40 w-40 rounded-full bg-brand-200/40 blur-2xl" />
      <div className="absolute -bottom-8 -right-4 h-44 w-44 rounded-full bg-gold/20 blur-2xl" />

      <div className="relative rounded-[2rem] border border-white bg-white/80 p-3 shadow-soft backdrop-blur">
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="mr-auto rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold text-stone-500 ltr:text-left">
            tabaqat.app/s/anfal
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl ring-1 ring-stone-100">
          <div className="relative h-52 sm:h-60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/anfal-cover.jpg" alt="متجر حلويات" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="chip bg-white/20 text-white backdrop-blur">كيك ديزاين</span>
              <h3 className="mt-2 text-xl font-black">حلويات أنفال</h3>
              <p className="text-xs text-white/80">نصنع السعادة في كل طبقة</p>
            </div>
            <span className="absolute top-4 left-4 chip bg-emerald-500 text-white shadow-lg">
              <i className="fa-brands fa-whatsapp" /> اطلب الآن
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-white p-3">
            {[
              ["/images/cake-chocolate.jpg", "شوكولاتة"],
              ["/images/cupcakes.jpg", "كب كيك"],
              ["/images/cake-redvelvet.jpg", "ريد فيلفيت"],
            ].map(([src, label]) => (
              <div key={label} className="overflow-hidden rounded-xl bg-stone-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={label} className="h-16 w-full object-cover" />
                <p className="px-2 py-1.5 text-[10px] font-bold text-stone-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -right-3 top-24 rounded-2xl bg-white px-4 py-3 shadow-soft ring-1 ring-stone-100 sm:-right-8">
        <p className="flex items-center gap-2 text-xs font-black text-stone-900">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
            <i className="fa-solid fa-check text-[11px]" />
          </span>
          طلب جديد
        </p>
        <p className="mt-1 text-[10px] font-medium text-stone-500">سارة بن علي · لاير كيك</p>
      </div>

      <div className="absolute -left-3 bottom-24 rounded-2xl bg-white px-4 py-3 shadow-soft ring-1 ring-stone-100 sm:-left-8">
        <p className="text-[10px] font-bold text-stone-500">منتجات المتجر</p>
        <p className="text-lg font-black text-brand-700">24</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const stores = await listPublicStores();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="blobs relative overflow-hidden">
        <div className="container-x grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="chip border border-brand-100 bg-white text-brand-700 shadow-sm">
              <i className="fa-solid fa-star text-gold" /> منصة جزائرية لأصحاب الحلويات
            </span>

            <h1 className="mt-6 text-4xl font-black leading-[1.15] text-stone-900 sm:text-5xl lg:text-6xl">
              متجرك الإلكتروني
              <br />
              للحلويات،
              <span className="relative mx-2 inline-block text-brand-600">
                جاهز في دقائق
                <svg
                  className="absolute -bottom-2 right-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 8C40 2 80 2 120 6c25 2 50 1 78-3"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-stone-600">
              <strong className="font-black text-stone-800">طبقات</strong> تعطي أصحاب الكيك
              ديزاين والحلويات التقليدية صفحة احترافية باسمهم: قائمة منتجات، معرض أعمال،
              وطلبات توصل مباشرة — بلا مبرمج وبلا عمولة على الطلبات.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary !px-8 !py-4 !text-base">
                <i className="fa-solid fa-store" /> أنشئ متجرك مجاناً
              </Link>
              <Link href="/s/anfal" className="btn-ghost !px-8 !py-4 !text-base">
                شوف متجر تجريبي <i className="fa-solid fa-arrow-left text-xs" />
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-stone-200/80 pt-6">
              {[
                ["5 دقائق", "والمتجر جاهز"],
                ["0 دج", "عمولة على الطلبات"],
                ["100%", "عربي ودارج"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-black text-stone-900">{value}</dt>
                  <dd className="mt-1 text-xs font-bold text-stone-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroMockup />
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="border-y border-stone-100 bg-white py-16">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black text-stone-900 sm:text-4xl">لمن صُنعت طبقات؟</h2>
            <p className="mt-3 text-stone-500">
              كل حرفي عندو خصوصياتو، ولهذا المنصة كتتكيف معاك — كيك ولا حلويات تقليدية.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                img: "/images/wedding-cake.jpg",
                tag: "كيك ديزاينر",
                title: "بيع التصاميم، ماشي غير الكيك",
                text: "إبراز التصاميم الفاخرة، طلبات بتاريخ المناسبة، وتفاصيل التزيين والكتابة على الكيك.",
                points: ["لاير كيك وتصاميم مخصصة", "طلب بتاريخ التسليم", "معرض أعمال يجذب الزبون"],
              },
              {
                img: "/images/traditional-cover.jpg",
                tag: "حلويات تقليدية",
                title: "الأعراس والمناسبات بالكيلو",
                text: "بقلاوة، مقروط، غريبية، تشكيلات الأعراس — بيع بالكيلو أو بالصينية مع طلبات بالكمية.",
                points: ["بيع بالكيلو والعلبة", "تشكيلات المناسبات", "طلبات كبيرة بسهولة"],
              },
            ].map((item) => (
              <article
                key={item.tag}
                className="group relative overflow-hidden rounded-[2rem] border border-stone-100 bg-stone-50"
              >
                <div className="relative h-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent" />
                  <span className="absolute top-4 right-4 chip bg-white/95 text-stone-800">
                    {item.tag}
                  </span>
                  <h3 className="absolute bottom-4 right-5 text-2xl font-black text-white">
                    {item.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-stone-600">{item.text}</p>
                  <ul className="mt-4 space-y-2">
                    {item.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm font-bold text-stone-700">
                        <i className="fa-solid fa-circle-check text-brand-500" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip bg-brand-50 text-brand-700">كل ما تحتاجه</span>
            <h2 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
              منصة واحدة، متجر كامل
            </h2>
            <p className="mt-3 text-stone-500">
              بلا إضافات، بلا تعقيد. الأدوات اللي كتحتاجها فعلاً باش تبيع أونلاين.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-soft"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-lg text-brand-600">
                  <i className={`fa-solid ${f.icon}`} aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-black text-stone-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="bg-stone-900 py-20 text-white">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="chip bg-white/10 text-white/80">3 خطوات</span>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">من الفكرة للمتجر في نفس النهار</h2>
              <p className="mt-3 text-stone-300">
                ما تحتاجش مبرمج ولا مصمم. غير عمّر المعلومات وصوّر منتجاتك.
              </p>
            </div>
            <Link href="/signup" className="btn bg-white !text-stone-900 hover:bg-brand-50">
              ابدأ الآن <i className="fa-solid fa-arrow-left text-xs" />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
              >
                <span className="text-3xl font-black text-brand-400">{s.n}</span>
                <h3 className="mt-3 text-lg font-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO STORES */}
      <section className="py-20">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="chip bg-brand-50 text-brand-700">متاجر حقيقية على المنصة</span>
              <h2 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
                شوف كيفاش كيبان متجرك
              </h2>
            </div>
            <Link href="/explore" className="btn-ghost">
              كل المتاجر <i className="fa-solid fa-arrow-left text-xs" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
            <div className="flex flex-col justify-center rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-7 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-xl text-brand-600 shadow-sm">
                <i className="fa-solid fa-plus" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-black text-stone-900">متجرك أنت هو التالي</h3>
              <p className="mt-2 text-sm text-stone-500">أنشئ متجرك وضع رابطك هنا مجاناً.</p>
              <Link href="/signup" className="btn-primary mx-auto mt-5 !px-5 !py-2.5">
                أنشئ متجرك
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <span className="chip bg-brand-50 text-brand-700">أسئلة متكررة</span>
            <h2 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
              واش عندك سؤال؟
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
              هادي أكثر الحوايج اللي كيسقسيو عليها أصحاب الكيك ديزاين والحلويات التقليدية قبل ما
              يبداو.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/signup" className="btn-primary !px-5 !py-2.5 text-xs">
                <i className="fa-solid fa-store" /> أنشئ متجرك
              </Link>
              <Link href="/s/anfal" className="btn-ghost !px-5 !py-2.5 text-xs">
                شوف مثال حقيقي
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-stone-200 bg-white p-5 transition open:border-brand-200 open:bg-brand-50/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-stone-900">
                  {item.q}
                  <i
                    className="fa-solid fa-plus text-xs text-brand-600 transition group-open:rotate-45"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-y border-stone-100 bg-white py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip bg-brand-50 text-brand-700">أسعار واضحة</span>
            <h2 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
              ابدأ مجاناً، وكبّر وقت ما تكبر
            </h2>
            <p className="mt-3 text-stone-500">
              بلا عمولة على الطلبات. تخلص غير على الاشتراك، وتقدر توقف في أي وقت.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[2rem] border p-7 ${
                  plan.highlight
                    ? "border-brand-300 bg-brand-50/60 shadow-soft"
                    : "border-stone-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 right-6 rounded-full bg-brand-600 px-4 py-1 text-[11px] font-black text-white shadow-lg">
                    الأكثر اختياراً
                  </span>
                )}
                <h3 className="text-lg font-black text-stone-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-stone-500">{plan.text}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-stone-900">{plan.price}</span>
                  <span className="text-xs font-bold text-stone-500">{plan.period}</span>
                </p>
                <ul className="mt-6 space-y-3 border-t border-stone-200/70 pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-medium text-stone-600">
                      <i className="fa-solid fa-check mt-0.5 text-brand-500" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-7 w-full ${plan.highlight ? "btn-primary" : "btn-ghost"}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 px-6 py-14 text-center text-white sm:px-14">
            <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
              <i className="fa-solid fa-cake-candles absolute -bottom-16 -left-10 text-[16rem]" />
            </div>

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-black sm:text-4xl">
                حلوياتك تستاهل متجر يليق بيها
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">
                أنشئ حسابك اليوم، وشارك رابط متجرك مع زبائنك فأقل من 5 دقائق.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/signup" className="btn bg-white !px-8 !py-4 !text-stone-900 hover:bg-brand-50">
                  إنشاء متجر مجاني
                </Link>
                <Link
                  href="/explore"
                  className="btn border border-white/40 !px-8 !py-4 text-white hover:bg-white/10"
                >
                  تصفح المتاجر
                </Link>
              </div>
              <p className="mt-6 text-xs font-bold text-white/60">
                حساب تجريبي جاهز: anfal@demo.dz · كلمة السر: demo1234
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
