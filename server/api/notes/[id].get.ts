import { LibsqlError } from "@libsql/client";
import { eq, sql } from "drizzle-orm";

import { db } from "~/config/db";
import { notesTable } from "~/config/db/schema";

const getNote = db
  .select({
    category: notesTable.category,
    content: notesTable.content,
    createdAt: notesTable.createdAt,
    id: notesTable.id,
    isFavourite: notesTable.isFavourite,
    isProtected: notesTable.isProtected,
    title: notesTable.title,
    updatedAt: notesTable.updatedAt,
    userId: notesTable.userId,
  })
  .from(notesTable)
  .where(eq(notesTable.id, sql.placeholder("id")))
  .limit(1)
  .prepare();

export default defineEventHandler(async (event) => {
  const noteId = event.context.params?.id;
  const userId = event.context.session?.userId;

  try {
    const notes = await getNote.execute({ id: noteId });

    if (notes.length === 0) {
      throw createError({
        message: "Note not found",
        statusCode: 404,
      });
    }

    if (notes[0].isProtected && notes[0].userId !== userId) {
      throw createError({
        message: "Note is protected",
        statusCode: 403,
      });
    }

    return notes[0];
  } catch (error) {
    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
