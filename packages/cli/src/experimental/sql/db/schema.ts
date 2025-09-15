import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const emailClientTable = sqliteTable("smtp_clients", {
  id: int().primaryKey({ autoIncrement: true }),
  host: text().notNull().unique(),
  hostName: text(),
  port: int().notNull().default(587),
  secure: integer({ mode: 'boolean' }).notNull().default(false),
  username: text().notNull(),
  password: text().notNull()
});
