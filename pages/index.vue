<script setup lang="ts">
const { data: notes } = await useFetch("/api/notes");
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-center text-2xl">Your notes</h1>
    <ul class="grid grid-cols-3 gap-x-4 gap-y-8">
      <li v-for="note in notes" :key="note.id">
        <NuxtLink :to="`/notes/${note.id}`">
          <UCard class="h-52">
            <p class="line-clamp-6">{{ note.content }}</p>
          </UCard>
          <h2 class="font-bold">{{ note.title }}</h2>
          <time :datetime="note.createdAt" class="text-sm text-gray-400">
            {{ new Date(note.createdAt).toLocaleString() }}</time
          >
        </NuxtLink>
      </li>
    </ul>
    <UButton to="/notes/create">Create new note</UButton>
  </div>
</template>
