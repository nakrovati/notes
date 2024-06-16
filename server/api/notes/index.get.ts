import { LibsqlError } from "@libsql/client";
import { eq, sql } from "drizzle-orm";

import { db } from "~/config/db";
import { notesTable } from "~/config/db/schema";

const getNotes = db
  .select({
    category: notesTable.category,
    content: notesTable.content,
    createdAt: notesTable.createdAt,
    id: notesTable.id,
    title: notesTable.title,
    updatedAt: notesTable.updatedAt,
    userId: notesTable.userId,
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
    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
