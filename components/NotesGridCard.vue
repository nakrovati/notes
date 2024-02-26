<script setup lang="ts">
defineProps<{
  content: string;
  createdAt: string;
  title: string;
}>();
</script>

<template>
  <UCard class="h-52">
    <p class="line-clamp-6">{{ content }}</p>
  </UCard>
  <h2 class="font-bold">{{ title }}</h2>
  <time :datetime="createdAt" class="text-sm text-gray-400">
    {{ new Date(createdAt).toLocaleString() }}</time
  >
</template>
