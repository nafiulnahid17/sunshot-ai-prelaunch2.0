import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const waitlist = sqliteTable("waitlist", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("website"),
  createdAt: text("created_at").notNull(),
});
