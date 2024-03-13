import { LibsqlError } from "@libsql/client";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { db } from "~/config/db";
import { type NewNote, notesTable } from "~/config/db/schema";

const insertNote = db
  .insert(notesTable)
  .values({
    id: sql.placeholder("id"),
    title: sql.placeholder("title"),
    content: sql.placeholder("content"),
    userId: sql.placeholder("userId"),
    createdAt: sql.placeholder("createdAt"),
    updatedAt: sql.placeholder("updatedAt"),
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
    const { title, content } = await readBody<Body>(event);
    const currentTime = new Date().toISOString();

    const newNote: NewNote = {
      id: uuidv4(),
      title,
      content,
      userId,
      createdAt: currentTime,
      updatedAt: currentTime,
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
