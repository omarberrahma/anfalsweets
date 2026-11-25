import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth-shell";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { error } = await searchParams;

  return (
    <AuthShell
      title="مرحباً بعودتك 👋"
      subtitle="دخل لحسابك وتابع طلبات ومنتجات متجرك."
      footer={
        <>
          ما عندكش حساب؟{" "}
          <Link href="/signup" className="font-black text-brand-700 hover:underline">
            أنشئ متجرك مجاناً
          </Link>
        </>
      }
    >
      {error && (
        <p className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          <i className="fa-solid fa-circle-exclamation ml-1" /> {error}
        </p>
      )}

      <form action={loginAction} className="space-y-5">
        <div>
          <label className="label" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="input ltr:text-left"
            dir="ltr"
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
            autoComplete="current-password"
            placeholder="••••••••"
            className="input"
          />
        </div>
        <button type="submit" className="btn-primary w-full !py-4">
          دخول
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 text-xs font-bold text-stone-500">
        <p className="mb-2 text-stone-700">حسابات تجريبية:</p>
        <p dir="ltr" className="text-left">anfal@demo.dz · demo1234</p>
        <p dir="ltr" className="text-left">zohra@demo.dz · demo1234</p>
      </div>
    </AuthShell>
  );
}
