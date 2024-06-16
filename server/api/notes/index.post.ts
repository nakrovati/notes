import { LibsqlError } from "@libsql/client";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { db } from "~/config/db";
import { type NewNote, notesTable } from "~/config/db/schema";

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
      id: uuidv4(),
      title,
      updatedAt: currentTime,
      userId,
    };

    await insertNote.execute({ ...newNote });

    return newNote;
  } catch (error) {
    if (error instanceof LibsqlError) {
      if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
        throw createError({
          message: "Id already used",
          statusCode: 500,
        });
      }

      throw createError({
        message: "An unknown database error occured",
        statusCode: 500,
      });
    }
  }
});
