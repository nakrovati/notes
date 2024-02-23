import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: text("id").primaryKey().notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
});

export const notesTable = sqliteTable("notes", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  content: text("description").notNull(),
  category: text("status"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  createdAt: integer("created_at").notNull(),
});

export type User = typeof userTable.$inferSelect;
