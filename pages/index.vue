<script setup lang="ts">
definePageMeta({
  middleware: ["protected"],
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-center text-2xl">Your notes</h1>

    <NotesGrid />
    <UButton to="/notes/create">Create new note</UButton>
  </div>
</template>
