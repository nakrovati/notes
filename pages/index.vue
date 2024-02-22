<script setup lang="ts">
async function handleLogout() {
  await $fetch("/api/logout", { method: "POST" });
  await navigateTo("/login");
}
</script>

<template>
  <div>
    <h1>Index Page!</h1>
    <div>
      <UButton variant="link" to="/signup">Sign up</UButton>
      <UButton variant="link" to="/login">Login</UButton>
      <UButton @click="handleLogout">Logout</UButton>
    </div>
  </div>
</template>
