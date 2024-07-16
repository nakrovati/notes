import { db } from "~~/config/db";
import { notesTable } from "~~/config/db/schema";
import { and, eq, sql } from "drizzle-orm";

import type { NewNote, Note } from "~/types";

class NoteRepository {
  #preparedCreate = db
    .insert(notesTable)
    .values({
      content: sql.placeholder("content"),
      createdAt: sql.placeholder("createdAt"),
      id: sql.placeholder("id"),
      title: sql.placeholder("title"),
      updatedAt: sql.placeholder("updatedAt"),
      userId: sql.placeholder("userId"),
    })
    .returning()
    .prepare();

  #preparedDelete = db
    .delete(notesTable)
    .where(and(eq(notesTable.id, sql.placeholder("id"))))
    .prepare();

  #preparedGetById = db.query.notesTable
    .findFirst({ where: eq(notesTable.id, sql.placeholder("id")) })
    .prepare();

  #preparedGetByUserId = db.query.notesTable
    .findMany({ where: eq(notesTable.userId, sql.placeholder("userId")) })
    .prepare();

  async create(note: NewNote): Promise<Note> {
    const [createdNote] = await this.#preparedCreate.execute(note);
    return createdNote;
  }

  async delete(id: string): Promise<number> {
    const { rowsAffected } = await this.#preparedDelete.execute({ id });
    return rowsAffected;
  }

  async getById(id: string): Promise<Note | undefined> {
    const note = await this.#preparedGetById.execute({ id });
    return note;
  }

  async getByUserId(userId: string): Promise<Note[]> {
    const notes = await this.#preparedGetByUserId.execute({ userId });
    return notes;
  }

  async update(
    noteId: string,
    fields: Partial<
      Pick<Note, "content" | "isProtected" | "title" | "updatedAt">
    >,
  ): Promise<Note> {
    const [updatedNote] = await db
      .update(notesTable)
      .set(fields)
      .where(eq(notesTable.id, noteId))
      .returning();

    return updatedNote;
  }
}

export const noteRepository = new NoteRepository();
