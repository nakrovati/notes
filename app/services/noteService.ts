import type { Note } from "~/types";

export class NoteService {
  async createNote(body: Pick<Note, "content" | "title">): Promise<Note> {
    try {
      const note = await $fetch("/api/notes", {
        body: {
          content: body.content,
          title: body.title,
        },
        method: "POST",
      });

      return note as Note; // Nuxt gives `note` type Simplify<SerializeObject<Note|undefined>> for some reason;
    } catch (error) {
      throw createError(error as Error);
    }
  }

  async deleteNote(noteId: string): Promise<void> {
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
  ): Promise<void> {
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
