import Link from "next/link";
import { Logo } from "./logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden overflow-hidden bg-stone-900 lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/anfal-cover.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-900/30" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo light />
          <div>
            <h2 className="max-w-md text-4xl font-black leading-tight">
              متجرك يبان احترافي، والطلبات كتوصل وحدها.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              انضم لأصحاب الكيك ديزاين والحلويات التقليدية اللي اختارو طبقات باش يبيعو
              أونلاين بلا تعقيد.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["قائمة منتجات", "معرض أعمال", "طلبات منظمة", "واتساب مباشر"].map((tag) => (
                <span key={tag} className="chip bg-white/10 text-white/80 ring-1 ring-white/15">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs font-medium text-white/40">© 2026 طبقات · Tabaqat</p>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-cream px-5 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-3xl font-black text-stone-900">{title}</h1>
          <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm font-medium text-stone-500">{footer}</div>
          <p className="mt-10 text-center text-xs font-bold text-stone-400">
            <Link href="/" className="hover:text-brand-700">
              <i className="fa-solid fa-arrow-right ml-1 text-[10px]" /> رجوع للصفحة الرئيسية
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
