import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable(
  "user",
  {
    id: text("id").primaryKey().notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
  },
  (table) => {
    return {
      uniqueEmail: uniqueIndex("unique_email").on(table.email),
    };
  },
);

export type User = typeof userTable.$inferSelect;

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
  content: text("content").notNull(),
  category: text("category"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type NewNote = typeof notesTable.$inferInsert;
