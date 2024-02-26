import { and, eq, sql } from "drizzle-orm";

import { db } from "~/db";
import { notesTable } from "~/db/schema";

const getNote = db
  .select({
    id: notesTable.id,
    title: notesTable.title,
    content: notesTable.content,
    category: notesTable.category,
    userId: notesTable.userId,
    createdAt: notesTable.createdAt,
    updatedAt: notesTable.updatedAt,
  })
  .from(notesTable)
  .where(
    and(
      eq(notesTable.userId, sql.placeholder("userId")),
      eq(notesTable.id, sql.placeholder("id")),
    ),
  )
  .limit(1)
  .prepare();

export default defineEventHandler(async (event) => {
  const noteId = event.context.params?.id;
  const userId = event.context.session?.userId;

  if (!userId) {
    throw createError({
      message: "User not authenticated",
      statusCode: 401,
    });
  }

  try {
    const note = await getNote.execute({
      id: noteId,
      userId: userId,
    });

    return note[0];
  } catch (error) {
    throw createError({
      message: "An unknown server error occured",
      statusCode: 500,
    });
  }
});
