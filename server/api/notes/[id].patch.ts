import { LibsqlError } from "@libsql/client";
import { noteRepository } from "~~/server/repositories/noteRepository";
import { NoteUpdateSchema } from "~~/server/validators/noteValidator";
import * as v from "valibot";

export default defineEventHandler(async (event) => {
  const noteId = event.context.params?.id;
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
    });
  }

  if (!noteId) {
    throw createError({
      message: "Note id is required",
      statusCode: 400,
    });
  }

  const body = await readBody(event);

  try {
    const fields = v.parse(NoteUpdateSchema, body);
    const now = new Date().toISOString();

    await noteRepository.update(noteId, {
      ...fields,
      updatedAt: now,
    });

    setResponseStatus(event, 204);
  } catch (error) {
    if (error instanceof v.ValiError) {
      throw createError({
        data: {
          errors: v.flatten<typeof NoteUpdateSchema>(error.issues).nested,
        },
        statusCode: 400,
      });
    }

    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
