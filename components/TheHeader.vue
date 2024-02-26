<script setup lang="ts">
const user = useUser();

async function handleLogout() {
  try {
    await $fetch("/api/logout", { method: "POST" });
    await navigateTo("/");
    user.value = null;
  } catch (error) {
    console.error(error);
  }
}

const items = [
  [
    {
      label: "Account",
      slot: "account",
      disabled: true,
    },
  ],
  [{ label: "Logout", click: () => handleLogout() }],
];
</script>

<template>
  <header>
    <UContainer
      :ui="{
        base: 'flex justify-between',
        padding: 'py-4',
        constrained: 'max-w-full',
      }"
    >
      <NuxtLink v-if="$route.path !== '/'" to="/"> Notes </NuxtLink>
      <div v-else>Notes</div>

      <div class="flex gap-2">
        <TheColorThemeToggle />

        <template v-if="!user">
          <UButton variant="link" to="/signup">Sign up</UButton>
          <UButton to="/login">Login</UButton>
        </template>

        <UDropdown v-else :items="items">
          <UAvatar :alt="user.email"></UAvatar>

          <template #account>
            <div class="text-left">
              <p>Signed in as</p>
              <p class="truncate font-medium text-gray-900 dark:text-white">
                {{ user.email }}
              </p>
            </div>
          </template>
        </UDropdown>
      </div>
    </UContainer>
  </header>
</template>
