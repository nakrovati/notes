import { LibsqlError } from "@libsql/client";
import { noteRepository } from "~~/server/repositories/noteRepository";

export default defineEventHandler(async (event) => {
  const userId = event.context.session?.userId;

  if (!userId) {
    throw createError({
      message: "User not authenticated",
      statusCode: 401,
    });
  }

  try {
    const notes = await noteRepository.getByUserId(userId);

    const availableNotes = notes.filter((note) => note.userId === userId);

    return availableNotes;
  } catch (error) {
    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
