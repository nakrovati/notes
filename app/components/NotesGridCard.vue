<script setup lang="ts">
import { type Note } from "~/types";

defineProps<{
  note: Note;
}>();
</script>

<template>
  <UCard class="h-64">
    <p class="line-clamp-6">{{ note.content }}</p>
  </UCard>
  <h2 class="font-bold">{{ note.title }}</h2>
  <time :datetime="note.updatedAt" class="text-sm text-gray-400">
    {{ new Date(note.updatedAt).toLocaleString() }}</time
  >
</template>
