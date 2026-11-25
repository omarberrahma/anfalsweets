import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="blobs grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-10 text-7xl font-black text-brand-200">404</p>
        <h1 className="mt-2 text-2xl font-black text-stone-900">هاد الصفحة ما كايناش</h1>
        <p className="mt-2 text-sm text-stone-500">
          يمكن المتجر تبدّل رابطو، ولا كتبت شي حاجة غالطة.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            الرئيسية
          </Link>
          <Link href="/explore" className="btn-ghost">
            تصفح المتاجر
          </Link>
        </div>
      </div>
    </div>
  );
}
