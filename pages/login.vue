<script setup lang="ts">
import type { Form, FormSubmitEvent } from "#ui/types";

import { FetchError } from "ofetch";
import * as v from "valibot";

definePageMeta({
  layout: "form",
});

const errorToast = useToast();

const LoginSchema = v.object({
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
});

type LoginInput = v.InferInput<typeof LoginSchema>;

const state = reactive({
  email: "",
  password: "",
});

const form = ref<Form<LoginInput>>();

async function onSubmit(event: FormSubmitEvent<LoginInput>) {
  try {
    await $fetch("/api/account/login", {
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
    <h1 class="text-center text-4xl">Log in</h1>
    <UForm
      ref="form"
      :schema="v.safeParser(LoginSchema)"
      class="flex flex-col gap-4"
      :state="state"
      @submit="onSubmit"
    >
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" type="email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <p>
        Don't have an account?
        <ULink to="/signup" class="text-primary">Sign up</ULink>
      </p>

      <UButton size="lg" class="inline-block" type="submit">Log in</UButton>
    </UForm>
  </div>
</template>
