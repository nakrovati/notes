import { eq, sql } from "drizzle-orm";

import { db } from "~/config/db";
import { notesTable } from "~/config/db/schema";

const getNote = db
  .select({
    id: notesTable.id,
    title: notesTable.title,
    content: notesTable.content,
    category: notesTable.category,
    userId: notesTable.userId,
    createdAt: notesTable.createdAt,
    updatedAt: notesTable.updatedAt,
    isProtected: notesTable.isProtected,
  })
  .from(notesTable)
  .where(eq(notesTable.id, sql.placeholder("id")))
  .limit(1)
  .prepare();

export default defineEventHandler(async (event) => {
  const noteId = event.context.params?.id;
  const userId = event.context.session?.userId;

  const notes = await getNote.execute({
    id: noteId,
  });

  if (notes.length === 0) {
    throw createError({
      statusMessage: "Note not found",
      statusCode: 404,
    });
  }

  if (notes[0].isProtected && notes[0].userId !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: "Note is protected",
    });
  }

  return notes[0];
});
