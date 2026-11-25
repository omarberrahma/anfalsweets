import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { get, run, type Store, type User } from "./db";
import { hashPassword, verifyPassword } from "./password";

const COOKIE = "helw_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await run("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)", [
    token,
    userId,
    Date.now() + MAX_AGE * 1000,
  ]);
  return token;
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(COOKIE);
}

export async function getCurrentUser(): Promise<User | undefined> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return undefined;
  const row = await get<User & { expires_at: number }>(
    `SELECT u.*, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`,
    [token],
  );
  if (!row) return undefined;
  if (Number(row.expires_at) < Date.now()) {
    await run("DELETE FROM sessions WHERE token = ?", [token]);
    return undefined;
  }
  return row;
}

export async function getCurrentStore(): Promise<{ user: User; store: Store } | undefined> {
  const user = await getCurrentUser();
  if (!user) return undefined;
  const store = await get<Store>("SELECT * FROM stores WHERE user_id = ?", [user.id]);
  if (!store) return undefined;
  return { user, store };
}

export async function authenticate(email: string, password: string): Promise<User | undefined> {
  const user = await get<User>("SELECT * FROM users WHERE email = ?", [
    email.trim().toLowerCase(),
  ]);
  if (!user) return undefined;
  if (!verifyPassword(password, user.password_hash)) return undefined;
  return user;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<User | Error> {
  const cleanEmail = email.trim().toLowerCase();
  if (await get("SELECT id FROM users WHERE email = ?", [cleanEmail])) {
    return new Error("هذا البريد الإلكتروني مستعمل من قبل.");
  }
  const res = await run("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [
    name.trim(),
    cleanEmail,
    hashPassword(password),
  ]);
  return (await get<User>("SELECT * FROM users WHERE id = ?", [Number(res.lastInsertRowid)]))!;
}
