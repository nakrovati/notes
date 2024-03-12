<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

import { type Input, objectAsync, string } from "valibot";

definePageMeta({
  middleware: ["protected"],
});

const noteSchema = objectAsync({
  title: string(),
  content: string(),
});

type NoteSchema = Input<typeof noteSchema>;

const noteState = reactive({
  title: "",
  content: "",
});

async function handleCreateNote(event: FormSubmitEvent<NoteSchema>) {
  try {
    const note = await $fetch("/api/notes", {
      method: "POST",
      body: {
        title: event.data.title,
        content: event.data.content,
      },
    });

    await navigateTo(`/notes/${note.id}`);
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <UForm
    :schema="noteSchema"
    :state="noteState"
    class="space-y-4"
    @submit="handleCreateNote"
  >
    <UFormGroup name="title">
      <UInput v-model="noteState.title" placeholder="Note title" />
    </UFormGroup>

    <UFormGroup name="content">
      <UTextarea
        v-model="noteState.content"
        autoresize
        :rows="10"
        :maxrows="20"
      />
    </UFormGroup>

    <UButton type="submit">Create note</UButton>
  </UForm>
</template>
