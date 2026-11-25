import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signupAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth-shell";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "إنشاء متجر" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { error } = await searchParams;

  return (
    <AuthShell
      title="أنشئ متجرك مجاناً"
      subtitle="دقيقة واحدة وتكون عندك صفحة احترافية باسمك."
      footer={
        <>
          عندك حساب من قبل؟{" "}
          <Link href="/login" className="font-black text-brand-700 hover:underline">
            سجّل الدخول
          </Link>
        </>
      }
    >
      {error && (
        <p className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          <i className="fa-solid fa-circle-exclamation ml-1" /> {error}
        </p>
      )}

      <form action={signupAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              اسمك الكامل
            </label>
            <input id="name" name="name" required placeholder="أنفال بوزيد" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="storeName">
              اسم المتجر
            </label>
            <input
              id="storeName"
              name="storeName"
              required
              placeholder="حلويات أنفال"
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="slug">
            رابط المتجر
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
            <span dir="ltr" className="text-xs font-bold text-stone-400">
              tabaqat.app/s/
            </span>
            <input
              id="slug"
              name="slug"
              required
              dir="ltr"
              pattern="[a-z0-9\-]{3,30}"
              placeholder="anfal"
              className="w-full border-0 bg-transparent p-0 text-sm font-bold text-stone-800 outline-none placeholder:font-medium placeholder:text-stone-300"
            />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-stone-400">
            حروف إنجليزية صغيرة، أرقام وشرطة فقط.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="category">
            شنو كتصنع؟
          </label>
          <select id="category" name="category" className="input" defaultValue="cake">
            <option value="cake">كيك ديزاين ولاير كيك</option>
            <option value="traditional">حلويات تقليدية</option>
            <option value="both">بجوج</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            dir="ltr"
            autoComplete="email"
            placeholder="you@example.com"
            className="input ltr:text-left"
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            كلمة السر
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="6 أحرف على الأقل"
            className="input"
          />
        </div>

        <button type="submit" className="btn-primary w-full !py-4">
          <i className="fa-solid fa-store" /> إنشاء المتجر
        </button>
        <p className="text-center text-[11px] font-medium text-stone-400">
          بالضغط على إنشاء المتجر كتوافق على شروط الاستعمال.
        </p>
      </form>
    </AuthShell>
  );
}
