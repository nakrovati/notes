import { LibsqlError } from "@libsql/client";
import { db } from "~~/config/db";
import { notesTable } from "~~/config/db/schema";
import { and, eq } from "drizzle-orm";

import type { Note } from "~/types";

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
        content: body.content,
        isProtected: body.isProtected,
        title: body.title,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(notesTable.userId, userId), eq(notesTable.id, noteId!)));
  } catch (error) {
    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
