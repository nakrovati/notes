<script setup lang="ts"></script>

<template>
  <header>
    <UContainer
      :ui="{
        base: 'flex justify-between',
        padding: 'py-4',
        constrained: 'max-w-full',
      }"
    >
      <NuxtLink v-if="$route.path !== '/'" to="/"> Notes </NuxtLink>
      <div v-else>Notes</div>

      <TheColorThemeToggle />
    </UContainer>
  </header>
</template>
