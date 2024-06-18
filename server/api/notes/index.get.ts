import { LibsqlError } from "@libsql/client";
import { db } from "~~/config/db";
import { notesTable } from "~~/config/db/schema";
import { eq, sql } from "drizzle-orm";

const getNotes = db
  .select()
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
    const notes = await getNotes.execute({
      userId,
    });

    return notes;
  } catch (error) {
    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
