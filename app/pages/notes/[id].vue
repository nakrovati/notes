<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

import * as v from "valibot";

const route = useRoute();
const user = useUser();

if (!route.params.id) {
  throw createError({
    message: "Note not found",
    statusCode: 404,
  });
}

const noteService = new NoteService();

const { data: note, error } = await useFetch(`/api/notes/${route.params.id}`);
if (error.value || !note.value) {
  throw createError({
    message: "Note not found",
    statusCode: 404,
  });
}

const noteSchema = v.object({
  content: v.string(),
  title: v.string(),
});

type NoteSchema = v.InferInput<typeof noteSchema>;

const noteState = reactive({
  content: "",
  title: "",
  updatedAt: "",
});

noteState.title = note.value.title;
noteState.content = note.value.content;
noteState.updatedAt = new Date().toISOString();

async function handleSaveNote(event: FormSubmitEvent<NoteSchema>) {
  if (!user.value || !note.value || isNoteSaved.value) return;

  try {
    await noteService.updateNote(note.value.id, event.data);
  } catch (error) {
    console.error(error);
  }
}

const isNoteSaved = ref(true);

const debouncedAutoSaveNote = useDebounceFn(async () => {
  if (!user.value || !note.value) return;

  isNoteSaved.value = false;

  try {
    await noteService.updateNote(note.value?.id, noteState);

    noteState.updatedAt = new Date().toISOString();
    isNoteSaved.value = true;
  } catch (error) {
    console.error(error);
  }
}, 3000);

const isModalOpen = ref(false);

async function handleDeleteNote() {
  if (!user.value || !note.value) return;

  try {
    await noteService.deleteNote(note.value.id);
    await navigateTo("/");
  } catch (error) {
    console.error(error);
  }
}

const deleteNoteItems = [
  [
    {
      click: () => {
        handleDeleteNote();
      },
      label: "Delete note",
    },
  ],
];

async function handleChangeProtection() {
  if (user || !note.value) return;

  try {
    await noteService.updateNote(note.value.id, {
      isProtected: +!note.value?.isProtected,
    });
  } catch (error) {
    console.error(error);
  }
}

const changeProtectionItems = [
  [
    {
      click: () => {
        handleChangeProtection();
      },
      label: "Change protection",
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
            @update:model-value="debouncedAutoSaveNote"
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
          @update:model-value="debouncedAutoSaveNote"
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
