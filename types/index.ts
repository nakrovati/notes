import type { notesTable, userTable } from "~/config/db/schema";

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;

export type Note = typeof notesTable.$inferSelect;
export type NewNote = typeof notesTable.$inferInsert;
