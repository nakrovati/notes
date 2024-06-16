<script setup lang="ts">
import type { Form, FormSubmitEvent } from "#ui/types";

import { FetchError } from "ofetch";
import * as v from "valibot";

definePageMeta({
  layout: "form",
});

const errorToast = useToast();

const SignupSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string(),
      v.nonEmpty("Email is required"),
      v.maxLength(320, "Must be at most 320 characters"),
      v.email("Invalid emial"),
    ),
    password: v.pipe(
      v.string(),
      v.nonEmpty("Password is required"),
      v.minLength(8, "Must be at least 8 characters"),
      v.maxLength(50, "Must be at most 50 characters"),
    ),
    password_confirmation: v.string(),
  }),
  v.forward(
    v.check(
      (input) => input.password !== input.password_confirmation,
      "Confirm password do not match",
    ),
    ["password_confirmation"],
  ),
);

type SignupInput = v.InferInput<typeof SignupSchema>;

const form = ref<Form<SignupInput>>();

const state = reactive({
  email: "",
  password: "",
  password_confirmation: "",
});

async function onSubmit(event: FormSubmitEvent<SignupInput>) {
  try {
    await $fetch("/api/account/signup", {
      body: event.data,
      method: "POST",
    });

    await navigateTo("/");
  } catch (error) {
    if (error instanceof FetchError && error.data.message) {
      errorToast.add({ color: "red", title: error.data?.message });
    }
  }
}
</script>

<template>
  <div class="mx-auto max-w-lg">
    <h1 class="text-center text-4xl">Sign up</h1>
    <UForm
      ref="form"
      :schema="v.safeParser(SignupSchema)"
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

      <UFormGroup label="Confirm password" name="password_confirmation">
        <UInput v-model="state.password_confirmation" type="password" />
      </UFormGroup>

      <p>
        Already have an account?
        <ULink to="/login" class="text-primary">Log in</ULink>
      </p>

      <UButton size="lg" class="inline-block" type="submit">Sign up</UButton>
    </UForm>
  </div>
</template>
