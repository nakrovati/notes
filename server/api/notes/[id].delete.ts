import { LibsqlError } from "@libsql/client";
import { noteRepository } from "~~/server/repositories/noteRepository";

export default defineEventHandler(async (event) => {
  const noteId = event.context.params?.id;
  const userId = event.context.user?.id;

  if (!noteId) {
    throw createError({
      message: "Note id is required",
      statusCode: 400,
    });
  }

  if (!userId) {
    throw createError({
      statusCode: 401,
    });
  }

  try {
    const note = await noteRepository.getById(noteId);
    if (!note) {
      throw createError({
        message: "Note not found",
        statusCode: 404,
      });
    }

    if (note.userId !== userId) {
      throw createError({
        message: "You do not have permission to delete this note",
        statusCode: 403,
      });
    }

    const deletedRows = await noteRepository.delete(noteId);
    if (!deletedRows) {
      throw createError({
        message: "Note not found",
        statusCode: 404,
      });
    }

    setResponseStatus(event, 204);
  } catch (error) {
    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
