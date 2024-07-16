import { LibsqlError } from "@libsql/client";
import { noteRepository } from "~~/server/repositories/noteRepository";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      message: "User not authenticated",
      statusCode: 401,
    });
  }

  try {
    const notes = await noteRepository.findByUserId(user.id);

    const availableNotes = notes.filter((note) => note.userId === user.id);

    return availableNotes;
  } catch (error) {
    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
