import { env } from "cloudflare:workers";

export type WaitlistInsert = {
  email: string;
  source?: string;
};

export async function addToWaitlist({ email, source = "website" }: WaitlistInsert) {
  if (!env.DB) throw new Error("Waitlist database is unavailable");

  const existing = await env.DB.prepare(
    "SELECT id FROM waitlist WHERE email = ? LIMIT 1"
  ).bind(email).first<{ id: number }>();

  if (existing) return { inserted: false };

  await env.DB.prepare(
    "INSERT INTO waitlist (email, source, created_at) VALUES (?, ?, ?)"
  ).bind(email, source, new Date().toISOString()).run();

  return { inserted: true };
}
