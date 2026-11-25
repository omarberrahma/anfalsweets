import { all, get, run, type Invoice, type Store } from "./db";
import { getPlan, type Plan, type PlanKey } from "./plans";

export type PlanUsage = {
  plan: Plan;
  products: number;
  gallery: number;
  atProductLimit: boolean;
  atGalleryLimit: boolean;
};

export async function planUsage(store: Store): Promise<PlanUsage> {
  const plan = getPlan(store.plan);
  const products = await get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM products WHERE store_id = ?",
    [store.id],
  );
  const gallery = await get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM gallery WHERE store_id = ?",
    [store.id],
  );

  const productCount = Number(products?.n ?? 0);
  const galleryCount = Number(gallery?.n ?? 0);

  return {
    plan,
    products: productCount,
    gallery: galleryCount,
    atProductLimit: plan.productLimit !== null && productCount >= plan.productLimit,
    atGalleryLimit: plan.galleryLimit !== null && galleryCount >= plan.galleryLimit,
  };
}

export async function listInvoices(storeId: number): Promise<Invoice[]> {
  return all<Invoice>("SELECT * FROM invoices WHERE store_id = ? ORDER BY id DESC", [storeId]);
}

export async function getInvoice(storeId: number, id: number): Promise<Invoice | undefined> {
  return get<Invoice>("SELECT * FROM invoices WHERE id = ? AND store_id = ?", [id, storeId]);
}

async function createInvoice(storeId: number, planKey: PlanKey): Promise<Invoice> {
  const plan = getPlan(planKey);
  const status = plan.price === 0 ? "paid" : "pending";
  const result = await run(
    `INSERT INTO invoices (store_id, number, plan, amount, months, period_start, period_end, status)
     VALUES (?, '', ?, ?, 1, date('now'), date('now', '+1 month'), ?)`,
    [storeId, planKey, plan.price, status],
  );
  const id = Number(result.lastInsertRowid);
  await run("UPDATE invoices SET number = ? WHERE id = ?", [
    `TQ-${String(id).padStart(4, "0")}`,
    id,
  ]);
  return (await getInvoice(storeId, id))!;
}

export async function changePlan(storeId: number, planKey: PlanKey): Promise<Invoice> {
  await run("UPDATE stores SET plan = ? WHERE id = ?", [planKey, storeId]);
  return createInvoice(storeId, planKey);
}
