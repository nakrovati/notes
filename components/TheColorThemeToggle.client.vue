<script setup lang="ts">
const colorMode = useColorMode();

const items = [
  [
    {
      label: "Light",
      click: () => (colorMode.preference = "light"),
    },
    {
      label: "Dark",
      click: () => (colorMode.preference = "dark"),
    },
    {
      label: "System",
      click: () => (colorMode.preference = "system"),
    },
  ],
];
</script>

<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }"
    ><UIcon
      class="h-auto w-6"
      :name="
        colorMode.value === 'light' ? 'i-heroicons-sun' : 'i-heroicons-moon'
      "
      dynamic
    ></UIcon
  ></UDropdown>
</template>
