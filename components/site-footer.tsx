import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200/70 bg-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-500">
            منصة جزائرية تساعد أصحاب الكيك ديزاين والحلويات التقليدية على إطلاق متجرهم
            الإلكتروني، وعرض منتجاتهم، واستقبال الطلبات — بلا تعقيد وبلا عمولة على الطلبات.
          </p>
          <div className="mt-5 flex gap-3">
            {["fa-instagram", "fa-facebook-f", "fa-tiktok"].map((icon) => (
              <span
                key={icon}
                className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"
              >
                <i className={`fa-brands ${icon}`} aria-hidden />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black text-stone-900">المنصة</h3>
          <ul className="space-y-3 text-sm font-medium text-stone-500">
            <li><Link className="hover:text-brand-700" href="/#features">المزايا</Link></li>
            <li><Link className="hover:text-brand-700" href="/#pricing">الأسعار</Link></li>
            <li><Link className="hover:text-brand-700" href="/explore">متاجر الحرفيين</Link></li>
            <li><Link className="hover:text-brand-700" href="/signup">إنشاء متجر</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black text-stone-900">الحساب</h3>
          <ul className="space-y-3 text-sm font-medium text-stone-500">
            <li><Link className="hover:text-brand-700" href="/login">تسجيل الدخول</Link></li>
            <li><Link className="hover:text-brand-700" href="/dashboard">لوحة التحكم</Link></li>
            <li><a className="hover:text-brand-700" href="https://wa.me/213771077617">الدعم عبر واتساب</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-100 py-6">
        <div className="container-x flex flex-col items-center justify-between gap-2 text-xs font-medium text-stone-400 sm:flex-row">
          <p>© 2026 طبقات (Tabaqat). جميع الحقوق محفوظة.</p>
          <p>صُنع بحب في الجزائر 🇩🇿</p>
        </div>
      </div>
    </footer>
  );
}
