<script setup lang="ts">
import { useSorting } from "~/composables/useSorting";
import { type Note } from "~/config/db/schema";

const user = useUser();

const { data: notes } = await useFetch("/api/notes");

const { sortType, sortOrder, sortedNotes, toggleSortOrder } = useSorting(
  notes as Ref<Note[]>,
);
</script>

<template>
  <section class="space-y-4">
    <h1 class="text-center text-2xl">All notes</h1>

    <template v-if="notes">
      <NotesPanelToolbar
        v-model:sort-type="sortType"
        :sort-order="sortOrder"
        @toggle-sort-order="toggleSortOrder"
      />

      <NotesGrid :notes="sortedNotes" />
    </template>

    <UButton :to="user ? '/notes/create' : '/login'">Create new note</UButton>
  </section>
</template>
