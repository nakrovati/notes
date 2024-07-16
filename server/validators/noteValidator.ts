import sanitize from "sanitize-html";
import * as v from "valibot";

export const NoteUpdateSchema = v.object({
  content: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty("Content is required"),
      v.maxLength(1000, "Must be at most 1000 characters"),
      v.transform((input) => sanitize(input)),
    ),
  ),
  isProtected: v.optional(
    v.pipe(
      v.boolean(),
      v.transform((input) => +input),
    ),
  ),
  title: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty("Title is required"),
      v.maxLength(100, "Must be at most 100 characters"),
      v.trim(),
    ),
  ),
});

export const NoteCreationSchema = v.object({
  content: v.pipe(
    v.string(),
    v.nonEmpty("Content is required"),
    v.transform((content) => sanitize(content)),
  ),
  title: v.pipe(
    v.string(),
    v.nonEmpty("Title is required"),
    v.maxLength(100, "Must be at most 100 characters"),
    v.trim(),
  ),
});
