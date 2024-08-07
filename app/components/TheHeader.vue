<script setup lang="ts">
const route = useRoute();

const user = useUser();

async function handleLogout() {
  try {
    await $fetch("/api/account/logout", { method: "POST" });
    await navigateTo("/");
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

const items = [
  [
    {
      disabled: true,
      label: "Account",
      slot: "account",
    },
    {
      label: "Settings",
      to: "/settings",
    },
  ],
  [{ click: () => handleLogout(), label: "Logout" }],
];
</script>

<template>
  <header>
    <UContainer
      :ui="{
        base: 'flex justify-between items-center',
        padding: 'py-4',
        constrained: 'max-w-full',
      }"
    >
      <NuxtLink v-if="route.path !== '/'" to="/">Notes</NuxtLink>
      <div v-else>Notes</div>

      <div class="flex items-center gap-2">
        <TheColorThemeToggle />

        <template v-if="!user">
          <UButton variant="link" to="/signup">Sign up</UButton>
          <UButton to="/login">Login</UButton>
        </template>

        <UDropdown v-else :items="items">
          <UAvatar :alt="user.email" />

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
