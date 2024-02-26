import { eq, sql } from "drizzle-orm";

import { db } from "~/db";
import { notesTable } from "~/db/schema";

const getNotes = db
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
  .where(eq(notesTable.userId, sql.placeholder("userId")))
  .prepare();

export default defineEventHandler(async (event) => {
  const userId = event.context.session?.userId;

  if (!userId) {
    throw createError({
      message: "User not authenticated",
      statusCode: 401,
    });
  }

  try {
    const note = await getNotes.execute({
      userId,
    });

    return note;
  } catch (error) {
    throw createError({
      message: "An unknown server error occured",
      statusCode: 500,
    });
  }
});
