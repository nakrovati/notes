import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { db } from "~/db";
import { type NewNote, notesTable } from "~/db/schema";

const insertNote = db
  .insert(notesTable)
  .values({
    id: sql.placeholder("id"),
    title: sql.placeholder("title"),
    content: sql.placeholder("content"),
    userId: sql.placeholder("userId"),
    createdAt: sql.placeholder("createdAt"),
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

    const newNote: NewNote = {
      id: uuidv4(),
      title,
      content,
      userId,
      createdAt: Date.now(),
    };

    await insertNote.execute({ ...newNote });

    return newNote;
  } catch (error) {
    throw createError({
      message: "An unknown server error occured",
      statusCode: 500,
    });
  }
});
