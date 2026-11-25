import { all, get, type GalleryItem, type Order, type Product, type Store } from "./db";

export type PublicStore = Store & {
  product_count: number;
  gallery_count: number;
};

export type StoreWithUser = Store & { owner_name: string; owner_email: string };

export async function listPublicStores(): Promise<PublicStore[]> {
  return all<PublicStore>(`
    SELECT s.*,
      (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id) AS product_count,
      (SELECT COUNT(*) FROM gallery g WHERE g.store_id = s.id) AS gallery_count
    FROM stores s
    ORDER BY s.id ASC
  `);
}

export async function getStoreBySlug(slug: string): Promise<PublicStore | undefined> {
  return get<PublicStore>(
    `SELECT s.*,
      (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id) AS product_count,
      (SELECT COUNT(*) FROM gallery g WHERE g.store_id = s.id) AS gallery_count
    FROM stores s WHERE s.slug = ?`,
    [slug],
  );
}

export async function getStoreWithUser(storeId: number): Promise<StoreWithUser | undefined> {
  return get<StoreWithUser>(
    `SELECT s.*, u.name AS owner_name, u.email AS owner_email
     FROM stores s JOIN users u ON u.id = s.user_id WHERE s.id = ?`,
    [storeId],
  );
}

export async function getProducts(storeId: number, featuredOnly = false): Promise<Product[]> {
  return all<Product>(
    `SELECT * FROM products WHERE store_id = ? ${featuredOnly ? "AND featured = 1" : ""}
     ORDER BY featured DESC, id ASC`,
    [storeId],
  );
}

export async function getGallery(storeId: number): Promise<GalleryItem[]> {
  return all<GalleryItem>("SELECT * FROM gallery WHERE store_id = ? ORDER BY id ASC", [storeId]);
}

export async function getOrders(storeId: number): Promise<Order[]> {
  return all<Order>("SELECT * FROM orders WHERE store_id = ? ORDER BY id DESC", [storeId]);
}

export async function getStoreStats(storeId: number) {
  const products = await get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM products WHERE store_id = ?",
    [storeId],
  );
  const gallery = await get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM gallery WHERE store_id = ?",
    [storeId],
  );
  const orders = await get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM orders WHERE store_id = ?",
    [storeId],
  );
  const newOrders = await get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM orders WHERE store_id = ? AND status = 'new'",
    [storeId],
  );
  return {
    products: Number(products?.n ?? 0),
    gallery: Number(gallery?.n ?? 0),
    orders: Number(orders?.n ?? 0),
    newOrders: Number(newOrders?.n ?? 0),
  };
}

export const CATEGORY_LABELS: Record<string, string> = {
  cake: "كيك ديزاين",
  traditional: "حلويات تقليدية",
  both: "كيك وحلويات تقليدية",
};

export function waLink(whatsapp: string, text: string) {
  const digits = whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
