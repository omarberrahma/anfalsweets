"use server";

import { redirect } from "next/navigation";
import {
  authenticate,
  clearSessionCookie,
  createSession,
  register,
  setSessionCookie,
} from "@/lib/auth";
import { get, run } from "@/lib/db";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) fail("/login", "عمّر البريد الإلكتروني وكلمة السر.");

  const user = await authenticate(email, password);
  if (!user) fail("/login", "البريد الإلكتروني أو كلمة السر غير صحيحة.");

  await setSessionCookie(await createSession(user.id));
  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const storeName = String(formData.get("storeName") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const category = String(formData.get("category") ?? "cake");

  if (!name || !email || !password || !storeName || !slug) {
    fail("/signup", "عمّر جميع الخانات المطلوبة.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("/signup", "البريد الإلكتروني غير صحيح.");
  if (password.length < 6) fail("/signup", "كلمة السر لازم تكون 6 أحرف على الأقل.");
  if (!/^[a-z0-9-]{3,30}$/.test(slug)) {
    fail("/signup", "رابط المتجر لازم يكون بالإنجليزية والأرقام والشرطة فقط (3 إلى 30 حرف).");
  }
  if (!["cake", "traditional", "both"].includes(category)) fail("/signup", "الصنف غير صحيح.");
  if (await get("SELECT id FROM stores WHERE slug = ?", [slug])) {
    fail("/signup", "هذا الرابط مستعمل من قبل، جرّب رابطاً آخر.");
  }

  const user = await register(name, email, password);
  if (user instanceof Error) fail("/signup", user.message);

  try {
    await run(
      `INSERT INTO stores (user_id, slug, name, tagline, category, phone, whatsapp, city, accent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        slug,
        storeName,
        category === "traditional" ? "حلويات تقليدية بالطريقة القديمة 🤎" : "نصنع السعادة في كل طبقة 🎂",
        category,
        "",
        "",
        "",
        category === "traditional" ? "#b45309" : "#db2777",
      ],
    );
  } catch {
    await run("DELETE FROM users WHERE id = ?", [user.id]);
    fail("/signup", "تعذّر إنشاء المتجر، حاول مرة أخرى.");
  }

  await setSessionCookie(await createSession(user.id));
  redirect("/dashboard?welcome=1");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
