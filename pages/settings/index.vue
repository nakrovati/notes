<script setup lang="ts">
definePageMeta({
  middleware: "protected",
});

async function deleteAccount() {
  try {
    await $fetch("/api/delete", { method: "DELETE" });
    await navigateTo("/");
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-center text-2xl">Account settings</h1>
    <section class="space-y-4">
      <div class="space-y-2">
        <h2 class="text-lg">Danger zone</h2>
        <UButton color="red" @click="deleteAccount">Delete account</UButton>
      </div>
    </section>
  </div>
</template>
