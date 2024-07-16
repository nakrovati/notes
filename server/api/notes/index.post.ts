import { LibsqlError } from "@libsql/client";
import { noteRepository } from "~~/server/repositories/noteRepository";
import { NoteCreationSchema } from "~~/server/validators/noteValidator";
import { uuidv7 } from "uuidv7";
import * as v from "valibot";

import type { NewNote } from "~/types";

export default defineEventHandler(async (event) => {
  const userId = event.context.session?.userId;

  if (!userId) {
    throw createError({
      message: "User not authenticated",
      statusCode: 401,
    });
  }

  const body = await readBody(event);

  try {
    const { content, title } = v.parse(NoteCreationSchema, body);
    const now = new Date().toISOString();

    const newNote: NewNote = {
      content,
      createdAt: now,
      id: uuidv7(),
      title,
      updatedAt: now,
      userId,
    };

    await noteRepository.create(newNote);

    return newNote;
  } catch (error) {
    if (error instanceof v.ValiError) {
      throw createError({
        data: {
          errors: v.flatten<typeof NoteCreationSchema>(error.issues).nested,
        },
        statusCode: 400,
      });
    }

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
