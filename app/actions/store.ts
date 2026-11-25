"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentStore } from "@/lib/auth";
import { get, run } from "@/lib/db";
import type { Store } from "@/lib/db";
import { planUsage } from "@/lib/subscriptions";

async function requireStore(): Promise<Store> {
  const session = await getCurrentStore();
  if (!session) redirect("/login");
  return session.store;
}

function text(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function refresh(slug: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/gallery");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/settings");
  revalidatePath("/explore");
  revalidatePath(`/s/${slug}`);
}

/* ------------------------------- PRODUCTS ------------------------------- */

export async function saveProduct(formData: FormData) {
  const store = await requireStore();
  const id = Number(text(formData.get("id"), "0"));
  const name = text(formData.get("name"));
  const description = text(formData.get("description"));
  const price = Math.max(0, Math.round(Number(text(formData.get("price"), "0")) || 0));
  const unit = text(formData.get("unit")) || "الوحدة";
  const category = text(formData.get("category")) || "عام";
  const imageUrl = text(formData.get("image_url"));
  const featured = text(formData.get("featured")) === "on" ? 1 : 0;

  if (!name) redirect("/dashboard/products?error=" + encodeURIComponent("اسم المنتج مطلوب."));

  if (id) {
    await run(
      `UPDATE products SET name = ?, description = ?, price = ?, unit = ?, category = ?, image_url = ?, featured = ?
       WHERE id = ? AND store_id = ?`,
      [name, description, price, unit, category, imageUrl, featured, id, store.id],
    );
  } else {
    const usage = await planUsage(store);
    if (usage.atProductLimit) {
      redirect(
        "/dashboard/products?error=" +
          encodeURIComponent(
            `وصلت للحد ديال خطة ${usage.plan.name} (${usage.plan.productLimit} منتجات). رقّي الخطة باش تزيد منتجات جداد.`,
          ),
      );
    }
    await run(
      `INSERT INTO products (store_id, name, description, price, unit, category, image_url, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [store.id, name, description, price, unit, category, imageUrl, featured],
    );
  }

  refresh(store.slug);
  redirect("/dashboard/products?ok=" + encodeURIComponent(id ? "تم تحديث المنتج." : "تمت إضافة المنتج."));
}

export async function deleteProduct(formData: FormData) {
  const store = await requireStore();
  const id = Number(text(formData.get("id"), "0"));
  await run("DELETE FROM products WHERE id = ? AND store_id = ?", [id, store.id]);
  refresh(store.slug);
  redirect("/dashboard/products?ok=" + encodeURIComponent("تم حذف المنتج."));
}

export async function toggleFeatured(formData: FormData) {
  const store = await requireStore();
  const id = Number(text(formData.get("id"), "0"));
  await run("UPDATE products SET featured = 1 - featured WHERE id = ? AND store_id = ?", [id, store.id]);
  refresh(store.slug);
  redirect("/dashboard/products");
}

/* -------------------------------- GALLERY ------------------------------- */

export async function addGalleryItem(formData: FormData) {
  const store = await requireStore();
  const imageUrl = text(formData.get("image_url"));
  const caption = text(formData.get("caption"));

  if (!imageUrl) {
    redirect("/dashboard/gallery?error=" + encodeURIComponent("رابط الصورة مطلوب."));
  }

  const usage = await planUsage(store);
  if (usage.atGalleryLimit) {
    redirect(
      "/dashboard/gallery?error=" +
        encodeURIComponent(
          `وصلت للحد ديال خطة ${usage.plan.name} (${usage.plan.galleryLimit} صور). رقّي الخطة باش تزيد صور.`,
        ),
    );
  }

  await run("INSERT INTO gallery (store_id, image_url, caption) VALUES (?, ?, ?)", [
    store.id,
    imageUrl,
    caption,
  ]);
  refresh(store.slug);
  redirect("/dashboard/gallery?ok=" + encodeURIComponent("تمت إضافة الصورة."));
}

export async function deleteGalleryItem(formData: FormData) {
  const store = await requireStore();
  const id = Number(text(formData.get("id"), "0"));
  await run("DELETE FROM gallery WHERE id = ? AND store_id = ?", [id, store.id]);
  refresh(store.slug);
  redirect("/dashboard/gallery?ok=" + encodeURIComponent("تم حذف الصورة."));
}

/* -------------------------------- ORDERS -------------------------------- */

const VALID_STATUS = ["new", "confirmed", "done", "cancelled"];

export async function updateOrderStatus(formData: FormData) {
  const store = await requireStore();
  const id = Number(text(formData.get("id"), "0"));
  const status = text(formData.get("status"));
  if (!VALID_STATUS.includes(status)) redirect("/dashboard/orders");
  await run("UPDATE orders SET status = ? WHERE id = ? AND store_id = ?", [status, id, store.id]);
  refresh(store.slug);
  redirect("/dashboard/orders?ok=" + encodeURIComponent("تم تحديث حالة الطلب."));
}

export async function deleteOrder(formData: FormData) {
  const store = await requireStore();
  const id = Number(text(formData.get("id"), "0"));
  await run("DELETE FROM orders WHERE id = ? AND store_id = ?", [id, store.id]);
  refresh(store.slug);
  redirect("/dashboard/orders?ok=" + encodeURIComponent("تم حذف الطلب."));
}

/* ----------------------------- PUBLIC ORDER ----------------------------- */

export async function createOrder(formData: FormData) {
  const slug = text(formData.get("slug"));
  const store = await get<Store>("SELECT * FROM stores WHERE slug = ?", [slug]);
  if (!store) redirect("/explore");

  const customerName = text(formData.get("customer_name"));
  const customerPhone = text(formData.get("customer_phone"));
  const wantedFor = text(formData.get("wanted_for"));
  const items = text(formData.get("items"));
  const notes = text(formData.get("notes"));

  if (!customerName || !customerPhone) {
    redirect(`/s/${slug}?orderError=${encodeURIComponent("الاسم ورقم الهاتف ضروريان.")}#order`);
  }

  await run(
    `INSERT INTO orders (store_id, customer_name, customer_phone, wanted_for, items, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [store.id, customerName, customerPhone, wantedFor, items, notes],
  );

  revalidatePath(`/s/${slug}`);
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  redirect(`/s/${slug}?ordered=1#order`);
}

/* ------------------------------- SETTINGS ------------------------------- */

export async function saveSettings(formData: FormData) {
  const store = await requireStore();

  const name = text(formData.get("name")) || store.name;
  const slug = text(formData.get("slug")).toLowerCase() || store.slug;
  const tagline = text(formData.get("tagline"));
  const category = text(formData.get("category"), store.category);
  const about = text(formData.get("about"));
  const phone = text(formData.get("phone"));
  const whatsapp = text(formData.get("whatsapp"));
  const city = text(formData.get("city"));
  const instagram = text(formData.get("instagram"));
  const logoUrl = text(formData.get("logo_url"));
  const coverUrl = text(formData.get("cover_url"));
  const accent = text(formData.get("accent")) || store.accent;
  const delivery = text(formData.get("delivery"));
  const back = "/dashboard/settings";

  if (!/^[a-z0-9-]{3,30}$/.test(slug)) {
    redirect(back + "?error=" + encodeURIComponent("رابط المتجر غير صحيح (حروف إنجليزية وأرقام)."));
  }
  if (!["cake", "traditional", "both"].includes(category)) {
    redirect(back + "?error=" + encodeURIComponent("الصنف غير صحيح."));
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(accent)) {
    redirect(back + "?error=" + encodeURIComponent("اللون لازم يكون بصيغة hex مثل #db2777."));
  }
  const taken = await get<{ id: number }>("SELECT id FROM stores WHERE slug = ? AND id <> ?", [
    slug,
    store.id,
  ]);
  if (taken) {
    redirect(back + "?error=" + encodeURIComponent("هذا الرابط مستعمل من طرف متجر آخر."));
  }

  await run(
    `UPDATE stores SET name = ?, slug = ?, tagline = ?, category = ?, about = ?, phone = ?, whatsapp = ?,
      city = ?, instagram = ?, logo_url = ?, cover_url = ?, accent = ?, delivery = ? WHERE id = ?`,
    [
      name,
      slug,
      tagline,
      category,
      about,
      phone,
      whatsapp,
      city,
      instagram,
      logoUrl,
      coverUrl,
      accent,
      delivery,
      store.id,
    ],
  );

  revalidatePath(`/s/${store.slug}`);
  revalidatePath(`/s/${slug}`);
  refresh(slug);
  redirect(back + "?ok=" + encodeURIComponent("تم حفظ معلومات المتجر."));
}
