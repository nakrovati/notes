<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

import { type Input, objectAsync, string } from "valibot";

const route = useRoute();

const { data: note } = await useFetch(`/api/notes/${route.params.id}`);

const noteSchema = objectAsync({
  title: string(),
  content: string(),
});

type NoteSchema = Input<typeof noteSchema>;

const noteState = reactive({
  title: "",
  content: "",
});

noteState.title = note.value?.title!;
noteState.content = note.value?.content!;

async function handleSaveNote(event: FormSubmitEvent<NoteSchema>) {
  if (isNoteSaved.value) return;

  try {
    await $fetch(`/api/notes/${route.params.id}`, {
      method: "PATCH",
      body: {
        title: event.data.title,
        content: event.data.content,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

const isNoteSaved = ref(true);

async function saveNote() {
  try {
    await $fetch(`/api/notes/${route.params.id}`, {
      method: "PATCH",
      body: {
        title: noteState.title,
        content: noteState.content,
      },
    });

    isNoteSaved.value = true;
  } catch (error) {
    console.error(error);
  }
}

const debouncedAutoSaveNote = debounce(saveNote, 3000);

function autoSaveNote() {
  isNoteSaved.value = false;

  debouncedAutoSaveNote();
}

const isModalOpen = ref(false);

async function handleDeleteNote() {
  try {
    await $fetch(`/api/notes/${route.params.id}`, { method: "DELETE" });
    await navigateTo("/");
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div>
    <UForm
      :schema="noteSchema"
      :state="noteState"
      class="space-y-4"
      @submit="handleSaveNote"
    >
      <UFormGroup name="title">
        <div class="grid grid-cols-[1fr_auto_auto] gap-4">
          <UInput
            v-model="noteState.title"
            placeholder="Note title"
            @update:model-value="autoSaveNote"
          ></UInput>

          <UTooltip :text="isNoteSaved ? 'Auto saved' : 'Auto saving'">
            <UButton
              :icon="
                isNoteSaved
                  ? 'i-heroicons-check-circle'
                  : 'i-heroicons-arrow-path'
              "
              :loading="!isNoteSaved"
              variant="outline"
            />
          </UTooltip>

          <UButton
            icon="i-heroicons-adjustments-vertical"
            variant="outline"
            @click="isModalOpen = !isModalOpen"
          />
        </div>
      </UFormGroup>

      <UFormGroup name="content">
        <UTextarea
          v-model="noteState.content"
          autoresize
          :rows="10"
          :maxrows="20"
          @update:model-value="autoSaveNote"
      /></UFormGroup>

      <UButton type="submit">Save note</UButton>
    </UForm>

    <UModal v-model="isModalOpen">
      <div class="flex flex-col gap-8 p-4">
        <h1 class="text-2xl">{{ note?.title }}</h1>

        <section class="space-y-4">
          <h2 class="text-xl">Danger zone</h2>
          <UButton color="red" @click="handleDeleteNote">Delete note</UButton>
        </section>

        <UButton class="ml-auto" variant="outline" @click="isModalOpen = false"
          >Close</UButton
        >
      </div>
    </UModal>
  </div>
</template>
