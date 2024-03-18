import { LibsqlError } from "@libsql/client";
import { and, eq, sql } from "drizzle-orm";

import { db } from "~/config/db";
import { notesTable } from "~/config/db/schema";

const deleteNote = db
  .delete(notesTable)
  .where(
    and(
      eq(notesTable.userId, sql.placeholder("userId")),
      eq(notesTable.id, sql.placeholder("id")),
    ),
  )
  .prepare();

export default defineEventHandler(async (event) => {
  const noteId = event.context.params?.id;
  const userId = event.context.user?.id;

  if (!userId) {
    throw createError({
      message: "User not authenticated",
      statusCode: 401,
    });
  }

  try {
    const deletedNote = await deleteNote.execute({ id: noteId, userId });
    if (!deletedNote) {
      throw createError({
        message: "Note not found or user does not have permission",
        statusCode: 404,
      });
    }
  } catch (error) {
    if (error instanceof LibsqlError) {
      throw createError({
        message: "An unknown database error occured",
        statusCode: 500,
      });
    }
  }
});
