<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps({
  // eslint-disable-next-line vue/require-default-prop
  error: Object as () => NuxtError,
});
</script>

<template>
  <div class="space-y-4 text-center">
    <h1 class="mt-8 text-8xl font-bold">{{ error?.statusCode }}</h1>
    <p>{{ error?.message }}</p>
    <UButton to="/">Go home</UButton>
  </div>
</template>
