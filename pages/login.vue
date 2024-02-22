<script setup lang="ts">
import type { Form, FormSubmitEvent } from "#ui/types";

import {
  type Input,
  email,
  maxLength,
  minLength,
  objectAsync,
  string,
} from "valibot";

const errorToast = useToast();

const schema = objectAsync({
  email: string([email("Invalid emial")]),
  password: string([
    minLength(8, "Must be at least 8 characters"),
    maxLength(50, "Must be at most 50 characters"),
  ]),
});

type Schema = Input<typeof schema>;

const state = reactive({
  email: "",
  password: "",
});

const form = ref<Form<Schema>>();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch("/api/login", {
      method: "POST",
      body: event.data,
    });

    await navigateTo("/");
  } catch (error) {
    if (error.data?.message.includes("Incorrect username or password")) {
      form.value?.setErrors([{ path: "email", message: error.data?.message }]);
      return;
    }

    errorToast.add({ title: error.data?.message, color: "red" });
  }
}
</script>

<template>
  <div class="mx-auto max-w-lg">
    <h1 class="text-center text-4xl">Log in</h1>
    <UForm
      ref="form"
      :schema="schema"
      class="flex flex-col gap-4"
      :state="state"
      @submit="onSubmit"
    >
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email"></UInput>
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password"></UInput>
      </UFormGroup>

      <UButton size="lg" class="inline-block" type="submit">Log in</UButton>
    </UForm>
  </div>
</template>
