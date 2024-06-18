<script setup lang="ts">
defineProps<{
  sortOrder: string;
}>();

defineEmits(["toggle-sort-order"]);

const sortType = defineModel<string>("sortType");

const sortTypes = ["title", "date-created", "date-modified"];
</script>

<template>
  <div class="flex justify-end gap-x-2">
    <USelect v-model="sortType" :options="sortTypes">
      <template #trailing>
        <UIcon name="i-heroicons-adjustments-horizontal" />
      </template>
    </USelect>

    <UButton
      variant="ghost"
      :icon="
        sortOrder === 'asc' ? 'i-heroicons-arrow-down' : 'i-heroicons-arrow-up'
      "
      aria-label="Toggle sort order"
      dynamic
      @click="$emit('toggle-sort-order')"
    />
  </div>
</template>
