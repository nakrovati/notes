import { and, eq } from "drizzle-orm";

import { db } from "~/db";
import { notesTable } from "~/db/schema";

interface Body {
  content: string;
  title: string;
}

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
    const body = await readBody<Body>(event);

    await db
      .update(notesTable)
      .set({
        title: body.title,
        content: body.content,
      })
      .where(and(eq(notesTable.userId, userId), eq(notesTable.id, noteId!)));
  } catch (error) {
    throw createError({
      message: "An unknown server error occured",
      statusCode: 500,
    });
  }
});