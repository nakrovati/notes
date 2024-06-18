<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

import * as v from "valibot";

definePageMeta({
  middleware: ["protected"],
});

const noteService = new NoteService();

const noteSchema = v.object({
  content: v.string(),
  title: v.string(),
});

type NoteSchema = v.InferInput<typeof noteSchema>;

const noteState = reactive({
  content: "",
  title: "",
});

async function handleCreateNote(event: FormSubmitEvent<NoteSchema>) {
  try {
    const note = await noteService.createNote(event.data);
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
