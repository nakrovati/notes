import { LibsqlError } from "@libsql/client";
import { db } from "~~/config/db";
import { notesTable } from "~~/config/db/schema";
import { eq, sql } from "drizzle-orm";

const getNote = db.query.notesTable
  .findFirst({
    where: eq(notesTable.id, sql.placeholder("id")),
  })
  .prepare();

export default defineEventHandler(async (event) => {
  const noteId = event.context.params?.id;
  const userId = event.context.session?.userId;

  try {
    const existingNote = await getNote.execute({ id: noteId });

    if (!existingNote) {
      throw createError({
        message: "Note not found",
        statusCode: 404,
      });
    }

    if (existingNote.isProtected && existingNote.userId !== userId) {
      throw createError({
        message: "Note is protected",
        statusCode: 403,
      });
    }

    return existingNote;
  } catch (error) {
    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
