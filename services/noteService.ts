import type { Note } from "~/config/db/schema";

export class NoteService {
  async createNote(body: Pick<Note, "content" | "title">) {
    try {
      const note = await $fetch("/api/notes", {
        body: {
          content: body.content,
          title: body.title,
        },
        method: "POST",
      });

      return note;
    } catch (error) {
      throw createError(error as Error);
    }
  }

  async deleteNote(noteId: string) {
    try {
      await $fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw createError(error as Error);
    }
  }

  async updateNote(
    noteId: string,
    body: Partial<Pick<Note, "category" | "content" | "isProtected" | "title">>,
  ) {
    try {
      await $fetch(`/api/notes/${noteId}`, {
        body,
        method: "PATCH",
      });
    } catch (error) {
      throw createError(error as Error);
    }
  }
}
