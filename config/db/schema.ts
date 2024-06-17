import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable(
  "user",
  {
    createdAt: text("created_at").notNull(),
    email: text("email").notNull(),
    id: text("id").primaryKey().notNull(),
    password: text("password").notNull(),
  },
  (table) => {
    return {
      unqEmail: unique().on(table.email),
    };
  },
);

export type User = typeof userTable.$inferSelect;

export const sessionTable = sqliteTable("session", {
  expiresAt: integer("expires_at").notNull(),
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const notesTable = sqliteTable(
  "notes",
  {
    category: text("category"),
    content: text("content").notNull(),
    createdAt: text("created_at").notNull(),
    id: text("id").primaryKey().notNull(),
    isProtected: integer("is_protected").notNull().default(1),
    title: text("title").notNull(),
    updatedAt: text("updated_at").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  }),
);

export type NewNote = typeof notesTable.$inferInsert;
export type Note = typeof notesTable.$inferSelect;
