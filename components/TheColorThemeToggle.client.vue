<script setup lang="ts">
const colorMode = useColorMode();

const items = [
  [
    {
      click: () => (colorMode.preference = "light"),
      label: "Light",
    },
    {
      click: () => (colorMode.preference = "dark"),
      label: "Dark",
    },
    {
      click: () => (colorMode.preference = "system"),
      label: "System",
    },
  ],
];
</script>

<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <UIcon
      class="size-6"
      :name="
        colorMode.value === 'light' ? 'i-heroicons-sun' : 'i-heroicons-moon'
      "
      dynamic
    />
  </UDropdown>
</template>
