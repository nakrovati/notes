<script setup lang="ts">
const { data: notes } = await useFetch("/api/notes");
</script>

<template>
  <ul class="grid grid-cols-3 gap-x-4 gap-y-8">
    <li v-for="note in notes" :key="note.id">
      <NuxtLink :to="`/notes/${note.id}`">
        <NotesGridCard :note="note" />
      </NuxtLink>
    </li>
  </ul>
</template>
