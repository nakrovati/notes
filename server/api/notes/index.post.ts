import { LibsqlError } from "@libsql/client";
import { db } from "~~/config/db";
import { notesTable } from "~~/config/db/schema";
import { sql } from "drizzle-orm";
import { uuidv7 } from "uuidv7";

import type { NewNote } from "~/types";

const insertNote = db
  .insert(notesTable)
  .values({
    content: sql.placeholder("content"),
    createdAt: sql.placeholder("createdAt"),
    id: sql.placeholder("id"),
    title: sql.placeholder("title"),
    updatedAt: sql.placeholder("updatedAt"),
    userId: sql.placeholder("userId"),
  })
  .prepare();

interface Body {
  content: string;
  title: string;
}

export default defineEventHandler(async (event) => {
  const userId = event.context.session?.userId;

  if (!userId) {
    throw createError({
      message: "User not authenticated",
      statusCode: 401,
    });
  }

  try {
    const { content, title } = await readBody<Body>(event);
    const currentTime = new Date().toISOString();

    const newNote: NewNote = {
      content,
      createdAt: currentTime,
      id: uuidv7(),
      title,
      updatedAt: currentTime,
      userId,
    };

    await insertNote.execute(newNote);

    return newNote;
  } catch (error) {
    if (error instanceof LibsqlError) {
      if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
        throw createError({
          message: "Id already used",
          statusCode: 400,
        });
      }

      console.log(error);
    }

    throw error;
  }
});
