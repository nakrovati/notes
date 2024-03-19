<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

import { type Input, objectAsync, string } from "valibot";

const route = useRoute();
const user = useUser();

const noteService = new NoteService();

const noteId = route.params.id.toString();

const { data: note, error } = await useFetch(`/api/notes/${noteId}`);
if (error.value) {
  throw createError(error.value);
}

const noteSchema = objectAsync({
  title: string(),
  content: string(),
});

type NoteSchema = Input<typeof noteSchema>;

const noteState = reactive({
  title: "",
  content: "",
  updatedAt: "",
});

noteState.title = note.value?.title!;
noteState.content = note.value?.content!;
noteState.updatedAt = new Date().toISOString();

async function handleSaveNote(event: FormSubmitEvent<NoteSchema>) {
  if (isNoteSaved.value) return;

  try {
    await noteService.updateNote(noteId, event.data);
  } catch (error) {
    console.error(error);
  }
}

const isNoteSaved = ref(true);

async function saveNote() {
  try {
    await noteService.updateNote(noteId, noteState);

    noteState.updatedAt = new Date().toISOString();
    isNoteSaved.value = true;
  } catch (error) {
    console.error(error);
  }
}

const debouncedAutoSaveNote = debounce(saveNote, 3000);

function autoSaveNote() {
  if (!user.value) return;

  isNoteSaved.value = false;

  debouncedAutoSaveNote();
}

const isModalOpen = ref(false);

async function handleDeleteNote() {
  try {
    await noteService.deleteNote(noteId);
    await navigateTo("/");
  } catch (error) {
    console.error(error);
  }
}

const deleteNoteItems = [
  [
    {
      label: "Delete note",
      click: () => {
        handleDeleteNote();
      },
    },
  ],
];

async function handleChangeProtection() {
  try {
    await noteService.updateNote(noteId, {
      isProtected: +!note.value?.isProtected,
    });
  } catch (error) {
    console.error(error);
  }
}

const changeProtectionItems = [
  [
    {
      label: "Change protection",
      click: () => {
        handleChangeProtection();
      },
    },
  ],
];
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
        <div class="flex gap-4">
          <UInput
            v-model="noteState.title"
            placeholder="Note title"
            :disabled="!user?.id"
            :ui="{ wrapper: 'w-full' }"
            @update:model-value="autoSaveNote"
          />

          <template v-if="user?.id === note?.userId">
            <UTooltip
              :text="
                isNoteSaved
                  ? `Auto saved at ${new Date(noteState.updatedAt).toLocaleString()}`
                  : 'Auto saving'
              "
            >
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
          </template>
        </div>
      </UFormGroup>

      <UFormGroup name="content">
        <UTextarea
          v-model="noteState.content"
          autoresize
          :rows="10"
          :disabled="!user?.id"
          :maxrows="20"
          @update:model-value="autoSaveNote"
        />
      </UFormGroup>

      <UButton type="submit" :disabled="!user?.id">Save note</UButton>
    </UForm>

    <UModal v-model="isModalOpen">
      <UCard>
        <template #header>
          <h1 class="text-2xl">{{ note?.title }}</h1>
        </template>

        <section class="space-y-4">
          <h2 class="text-lg">Danger zone</h2>
          <ul class="space-y-2">
            <li
              class="grid grid-rows-[auto_auto] items-center gap-1 sm:grid-cols-[1fr_auto] sm:grid-rows-none"
            >
              <div>
                <h3 class="font-semibold">Change note protection.</h3>
                <p>
                  {{
                    note?.isProtected
                      ? `Note "${note.title} protected"`
                      : `Note "${note?.title} not protected"`
                  }}
                </p>
              </div>
              <UDropdown :items="changeProtectionItems">
                <UButton color="red" @click="handleChangeProtection">
                  Change protection
                </UButton>
              </UDropdown>
            </li>
            <li
              class="grid grid-rows-[auto_auto] items-center gap-1 sm:grid-cols-[1fr_auto] sm:grid-rows-none"
            >
              <div>
                <h3 class="font-semibold">Delete note</h3>
                <p>This action cannot be undone.</p>
              </div>

              <UDropdown :items="deleteNoteItems">
                <UButton color="red">Delete note</UButton>
              </UDropdown>
            </li>
          </ul>
        </section>

        <template #footer>
          <UButton
            class="ml-auto"
            variant="outline"
            @click="isModalOpen = false"
          >
            Close
          </UButton>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
