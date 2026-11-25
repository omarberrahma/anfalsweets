import { createClient, type Client } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";
import { hashPassword } from "./password";

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type Store = {
  id: number;
  user_id: number;
  slug: string;
  name: string;
  tagline: string;
  category: "cake" | "traditional" | "both";
  about: string;
  phone: string;
  whatsapp: string;
  city: string;
  instagram: string;
  logo_url: string;
  cover_url: string;
  accent: string;
  delivery: string;
  plan: string;
  created_at: string;
};

export type Product = {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image_url: string;
  featured: number;
  created_at: string;
};

export type GalleryItem = {
  id: number;
  store_id: number;
  image_url: string;
  caption: string;
};

export type Invoice = {
  id: number;
  store_id: number;
  number: string;
  plan: string;
  amount: number;
  months: number;
  period_start: string;
  period_end: string;
  status: "pending" | "paid";
  created_at: string;
};

export type Order = {
  id: number;
  store_id: number;
  customer_name: string;
  customer_phone: string;
  wanted_for: string;
  items: string;
  notes: string;
  status: "new" | "confirmed" | "done" | "cancelled";
  created_at: string;
};

export type DbParam = string | number | null;

/* ------------------------------ CONNECTION ------------------------------ */

/**
 * فالإنتاج كنستعملو Turso (libSQL) عبر TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.
 * محلياً، إلا ما كانش الـenv، كنخدمو على ملف SQLite محلي فـ.data/helw.db.
 *
 * على Vercel (serverless) الملفات ديال المشروع للقراءة فقط، لهذا إلا ما كانش Turso
 * كنخدمو على /tmp/helw.db — كيخدم مزيان ولكن المعطيات كتمسح ملي كيبرد السيرفر.
 */
const onServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const fallbackUrl = onServerless ? "file:/tmp/helw.db" : "file:.data/helw.db";
const url = process.env.TURSO_DATABASE_URL || fallbackUrl;
const authToken = process.env.TURSO_AUTH_TOKEN;

/** true = قاعدة بيانات مؤقتة (بلا Turso على Vercel) */
export const ephemeralDatabase = !process.env.TURSO_DATABASE_URL && onServerless;

if (url.startsWith("file:")) {
  const filePath = url.slice("file:".length);
  const dir = path.isAbsolute(filePath) ? path.dirname(filePath) : path.join(process.cwd(), path.dirname(filePath));
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    // نظام ملفات للقراءة فقط: نخليو المحاولة تفشل فالاستعلام بدل ما نطيحو كلشي
  }
}

const globalForDb = globalThis as unknown as {
  __helwDb?: Client;
  __helwReady?: Promise<void>;
};

export const db: Client =
  globalForDb.__helwDb ?? (globalForDb.__helwDb = createClient({ url, authToken }));

export function ensureReady(): Promise<void> {
  if (!globalForDb.__helwReady) {
    globalForDb.__helwReady = prepareDatabase().catch((error) => {
      // نخليو المحاولة القادمة تعاود، بدل ما نبقاو عالقين على خطأ واحد
      globalForDb.__helwReady = undefined;
      throw error;
    });
  }
  return globalForDb.__helwReady;
}

async function prepareDatabase() {
  await migrate();
  await seed();
}

/* ------------------------------- SCHEMA -------------------------------- */

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  `CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    )`,
  `CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'cake',
      about TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      whatsapp TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT '',
      instagram TEXT NOT NULL DEFAULT '',
      logo_url TEXT NOT NULL DEFAULT '',
      cover_url TEXT NOT NULL DEFAULT '',
      accent TEXT NOT NULL DEFAULT '#db2777',
      delivery TEXT NOT NULL DEFAULT '',
      plan TEXT NOT NULL DEFAULT 'start',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL DEFAULT 0,
      unit TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'عام',
      image_url TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  `CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT ''
    )`,
  `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      wanted_for TEXT NOT NULL DEFAULT '',
      items TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  `CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      number TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL,
      amount INTEGER NOT NULL DEFAULT 0,
      months INTEGER NOT NULL DEFAULT 1,
      period_start TEXT NOT NULL,
      period_end TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  "CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id)",
  "CREATE INDEX IF NOT EXISTS idx_gallery_store ON gallery(store_id)",
  "CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(store_id)",
  "CREATE INDEX IF NOT EXISTS idx_invoices_store ON invoices(store_id)",
];

async function migrate() {
  for (const statement of SCHEMA) {
    await db.execute(statement);
  }

  // قواعد قديمة: نزيدو عمود الخطة بلا ما نمسو المعطيات
  const columns = await db.execute("PRAGMA table_info(stores)");
  const names = (columns.rows as unknown as Array<{ name: string }>).map((row) => row.name);
  if (!names.includes("plan")) {
    await db.execute("ALTER TABLE stores ADD COLUMN plan TEXT NOT NULL DEFAULT 'start'");
  }
}

/* -------------------------------- SEED --------------------------------- */

async function insert(sql: string, args: DbParam[]): Promise<number> {
  const result = await db.execute({ sql, args });
  return Number(result.lastInsertRowid);
}

async function seed() {
  const count = await db.execute("SELECT COUNT(*) AS n FROM stores");
  const stores = Number((count.rows[0] as unknown as { n: number }).n);
  if (stores > 0) return;

  const password = hashPassword("demo1234");

  const insertUser = (name: string, email: string) =>
    insert("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [
      name,
      email,
      password,
    ]);

  const insertStore = (
    userId: number,
    slug: string,
    name: string,
    tagline: string,
    category: string,
    about: string,
    phone: string,
    whatsapp: string,
    city: string,
    instagram: string,
    logoUrl: string,
    coverUrl: string,
    accent: string,
    delivery: string,
  ) =>
    insert(
      `INSERT INTO stores (user_id, slug, name, tagline, category, about, phone, whatsapp, city, instagram, logo_url, cover_url, accent, delivery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        slug,
        name,
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
      ],
    );

  const insertProduct = (
    storeId: number,
    item: [string, string, number, string, string, string, number],
  ) =>
    insert(
      `INSERT INTO products (store_id, name, description, price, unit, category, image_url, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [storeId, ...item],
    );

  const insertGallery = (storeId: number, item: [string, string]) =>
    insert("INSERT INTO gallery (store_id, image_url, caption) VALUES (?, ?, ?)", [storeId, ...item]);

  const insertOrder = (
    storeId: number,
    customerName: string,
    customerPhone: string,
    wantedFor: string,
    items: string,
    notes: string,
    status: string,
    offset: string,
  ) =>
    insert(
      `INSERT INTO orders (store_id, customer_name, customer_phone, wanted_for, items, notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', ?))`,
      [storeId, customerName, customerPhone, wantedFor, items, notes, status, offset],
    );

  // ---- Compte 1 : حلويات أنفال (كيك ديزاين) ----
  const anfalId = await insertUser("أنفال بوزيد", "anfal@demo.dz");
  const anfalStoreId = await insertStore(
    anfalId,
    "anfal",
    "حلويات أنفال",
    "نصنع السعادة في كل طبقة 🎂",
    "cake",
    "بدأت رحلتنا بشغف بسيط لصناعة الكيك، واليوم نفخر بأن نكون جزءاً من ذكرياتكم السعيدة. نستخدم أجود أنواع الزبدة والشوكولاتة، ونصمم كل كيكة حسب ذوقكم.",
    "0771 07 76 17",
    "213771077617",
    "الجزائر العاصمة",
    "anfal.sweets",
    "/logo.png",
    "/images/anfal-cover.jpg",
    "#db2777",
    "توصيل داخل الجزائر العاصمة خلال 24 ساعة، والتوصيل للمدن الأخرى عبر Yalidine.",
  );

  const anfalProducts: Array<[string, string, number, string, string, string, number]> = [
    [
      "لاير كيك الفانيليا والتوت",
      "طبقات هشة من كيك الفانيليا محشوة بكريمة التوت الطازج.",
      4500,
      "الكيكة",
      "لاير كيك",
      "/images/anfal-cover.jpg",
      1,
    ],
    [
      "كيكة الشوكولاتة البلجيكية",
      "ثلاث طبقات غنية بثلاثة أنواع من الشوكولاتة البلجيكية الفاخرة.",
      5200,
      "الكيكة",
      "لاير كيك",
      "/images/cake-chocolate.jpg",
      1,
    ],
    [
      "ريد فيلفيت كلاسيك",
      "اللون الأحمر الشهير مع كريمة الجبن الناعمة والمميزة.",
      4800,
      "الكيكة",
      "لاير كيك",
      "/images/cake-redvelvet.jpg",
      0,
    ],
    [
      "بوكس الكب كيك (6 قطع)",
      "تشكيلة كب كيك هش مزين بكريمة الزبدة السويسرية.",
      1800,
      "العلبة",
      "كب كيك",
      "/images/cupcakes.jpg",
      1,
    ],
    [
      "كيك الزفاف الملكي",
      "تحف فنية متعددة الطوابق مصممة خصيصاً ليومكم الكبير.",
      18000,
      "الطلب",
      "مناسبات",
      "/images/wedding-cake.jpg",
      0,
    ],
  ];
  for (const product of anfalProducts) await insertProduct(anfalStoreId, product);

  const anfalGallery: Array<[string, string]> = [
    ["/images/anfal-cover.jpg", "لاير كيك أعياد ميلاد"],
    ["/images/cake-chocolate.jpg", "شوكولاتة بلجيكية"],
    ["/images/wedding-cake.jpg", "كيك زفاف ملكي"],
    ["/images/cupcakes.jpg", "تشكيلة كب كيك"],
    ["/images/cake-redvelvet.jpg", "ريد فيلفيت"],
  ];
  for (const item of anfalGallery) await insertGallery(anfalStoreId, item);

  // الخطة والفاتورة التجريبية ديال أنفال
  await db.execute({ sql: "UPDATE stores SET plan = 'pro' WHERE id = ?", args: [anfalStoreId] });
  const anfalInvoiceId = await insert(
    `INSERT INTO invoices (store_id, number, plan, amount, months, period_start, period_end, status)
     VALUES (?, '', 'pro', 1900, 1, date('now', '-12 days'), date('now', '+18 days'), 'paid')`,
    [anfalStoreId],
  );
  await db.execute({
    sql: "UPDATE invoices SET number = ? WHERE id = ?",
    args: [`TQ-${String(anfalInvoiceId).padStart(4, "0")}`, anfalInvoiceId],
  });

  await insertOrder(
    anfalStoreId,
    "سارة بن علي",
    "0551234567",
    "2026-12-05",
    "لاير كيك الفانيليا والتوت × 1",
    "نكتب عليها: عيد ميلاد سعيد يا أمينة",
    "new",
    "-1 day",
  );
  await insertOrder(
    anfalStoreId,
    "ياسين مرابط",
    "0661987654",
    "2026-11-30",
    "بوكس الكب كيك (6 قطع) × 2",
    "بدون مكسرات",
    "confirmed",
    "-3 days",
  );

  // ---- Compte 2 : حلويات لالة زهرة (حلويات تقليدية) ----
  const zohraId = await insertUser("زهرة بن عبد الله", "zohra@demo.dz");
  const zohraStoreId = await insertStore(
    zohraId,
    "lalla-zohra",
    "حلويات لالة زهرة",
    "حلويات تقليدية بالطريقة القديمة 🤎",
    "traditional",
    "نحضّر البقلاوة والمقروط والغريبية بالطرق التقليدية التي تعلمناها من جداتنا، بمكونات طبيعية 100% ولوز حقيقي. نستقبل طلبات الأعراس والمناسبات بالكمية.",
    "0550 12 34 56",
    "213550123456",
    "تلمسان",
    "lalla.zohra.tlm",
    "",
    "/images/traditional-cover.jpg",
    "#b45309",
    "التوصيل لجميع ولايات الغرب، والتوصيل المجاني للطلبات فوق 10 كيلو.",
  );

  const zohraProducts: Array<[string, string, number, string, string, string, number]> = [
    [
      "بقلاوة باللوز",
      "طبقات رقيقة من العجين المورق محشوة بلوز مطحون وعسل طبيعي.",
      3200,
      "الكيلو",
      "حلويات الأعراس",
      "/images/baklawa.jpg",
      1,
    ],
    [
      "مقروط بالتمر",
      "سميد محمص محشو بمعجون التمر، مقلي ومغطس في العسل.",
      2400,
      "الكيلو",
      "حلويات الأعراس",
      "/images/makroud.jpg",
      1,
    ],
    [
      "غريبية باللوز",
      "قرص هش يذوب في الفم، مصنوع من اللوز والسميد.",
      2800,
      "الكيلو",
      "حلويات المناسبات",
      "/images/ghribia.jpg",
      0,
    ],
    [
      "تشاراك العريان",
      "هلال من السميد محشو بالتمر ومزين بالسكر الناعم.",
      2600,
      "الكيلو",
      "حلويات المناسبات",
      "/images/kaak.jpg",
      0,
    ],
    [
      "تشكيلة أعراس (5 كيلو)",
      "خمسة كيلو منوعة من كل أنواع الحلويات التقليدية، معبأة في صواني.",
      14000,
      "الصينية",
      "حلويات الأعراس",
      "/images/traditional-cover.jpg",
      0,
    ],
  ];
  for (const product of zohraProducts) await insertProduct(zohraStoreId, product);

  const zohraGallery: Array<[string, string]> = [
    ["/images/traditional-cover.jpg", "تشكيلة حلويات الأعراس"],
    ["/images/baklawa.jpg", "بقلاوة باللوز"],
    ["/images/makroud.jpg", "مقروط بالتمر"],
    ["/images/ghribia.jpg", "غريبية"],
    ["/images/kaak.jpg", "تشاراك العريان"],
  ];
  for (const item of zohraGallery) await insertGallery(zohraStoreId, item);

  await insertOrder(
    zohraStoreId,
    "أمينة قدور",
    "0770334455",
    "2026-12-20",
    "بقلاوة باللوز × 3 كيلو، مقروط بالتمر × 2 كيلو",
    "عرس في تلمسان، التوصيل صباحاً",
    "new",
    "-2 days",
  );
  await insertOrder(
    zohraStoreId,
    "مراد حمدي",
    "0661223344",
    "2026-11-28",
    "تشكيلة أعراس (5 كيلو) × 1",
    "",
    "done",
    "-8 days",
  );
}

/* ------------------------------- HELPERS ------------------------------- */

export async function all<T>(sql: string, params: DbParam[] = []): Promise<T[]> {
  await ensureReady();
  const result = await db.execute({ sql, args: params });
  return result.rows as unknown as T[];
}

export async function get<T>(sql: string, params: DbParam[] = []): Promise<T | undefined> {
  const rows = await all<T>(sql, params);
  return rows[0];
}

export async function run(sql: string, params: DbParam[] = []) {
  await ensureReady();
  return db.execute({ sql, args: params });
}

export function money(price: number): string {
  return `${price.toLocaleString("en-US")} دج`;
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}
