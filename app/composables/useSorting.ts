import type { Ref } from "vue";

import type { Note } from "~/types";

export const useSorting = (notes: Ref<Note[]>) => {
  const sortOrder = ref<"asc" | "desc">("asc");
  const sortType = ref<"date-created" | "date-modified" | "title">(
    "date-modified",
  );

  function toggleSortOrder() {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  }

  const sortedNotes = computed(() => {
    return [...notes.value].sort((a, b) => {
      if (sortType.value === "date-created") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return sortOrder.value === "asc" ? dateB - dateA : dateA - dateB;
      } else if (sortType.value === "date-modified") {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();

        return sortOrder.value === "asc" ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder.value === "asc"
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
    });
  });

  return { sortOrder, sortType, sortedNotes, toggleSortOrder };
};
