import { LibsqlError } from "@libsql/client";
import { and, eq } from "drizzle-orm";

import { db } from "~/config/db";
import { Note, notesTable } from "~/config/db/schema";

type Body = Pick<Note, "content" | "isProtected" | "title">;

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
        isProtected: body.isProtected,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(notesTable.userId, userId), eq(notesTable.id, noteId!)));
  } catch (error) {
    if (error instanceof LibsqlError) {
      throw createError({
        message: "An unknown database error occured",
        statusCode: 500,
      });
    }
  }
});
