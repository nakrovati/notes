<script setup lang="ts">
import type { Form, FormSubmitEvent } from "#ui/types";

import {
  type Input,
  custom,
  email,
  forward,
  maxLength,
  minLength,
  objectAsync,
  string,
} from "valibot";

const errorToast = useToast();

const form = ref<Form<Schema>>();

const schema = objectAsync(
  {
    email: string([email("Invalid emial")]),
    password: string([
      minLength(8, "Must be at least 8 characters"),
      maxLength(50, "Must be at most 50 characters"),
    ]),
    password_confirmation: string(),
  },
  [
    forward(
      custom(
        (input) => input.password === input.password_confirmation,
        "Confirm password do not match",
      ),
      ["password_confirmation"],
    ),
  ],
);

type Schema = Input<typeof schema>;

const state = reactive({
  email: "",
  password: "",
  password_confirmation: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch("/api/account/signup", {
      body: event.data,
      method: "POST",
    });

    await navigateTo("/");
  } catch (error) {
    if (error.data?.message.includes("Email already used")) {
      form.value?.setErrors([{ message: error.data?.message, path: "email" }]);
      return;
    }

    errorToast.add({ color: "red", title: error.data?.message });
  }
}
</script>

<template>
  <div class="mx-auto max-w-lg">
    <h1 class="text-center text-4xl">Sign up</h1>
    <UForm
      ref="form"
      :schema="schema"
      class="flex flex-col gap-4"
      :state="state"
      @submit="onSubmit"
    >
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UFormGroup label="Confirm password" name="passwordConfirmation">
        <UInput v-model="state.password_confirmation" type="password" />
      </UFormGroup>

      <UButton size="lg" class="inline-block" type="submit">Sign up</UButton>
    </UForm>
  </div>
</template>
