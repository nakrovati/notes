<script setup lang="ts">
const { data: notes } = await useFetch("/api/notes");
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-center text-2xl">Your notes</h1>
    <ul class="grid grid-cols-3 gap-x-4 gap-y-8">
      <li v-for="note in notes" :key="note.id">
        <NuxtLink :to="`/notes/${note.id}`">
          <UCard>
            <template #header>{{ note.title }}</template>
          </UCard>
        </NuxtLink>
      </li>
    </ul>
    <UButton to="/notes/create">Create new note</UButton>
  </div>
</template>
