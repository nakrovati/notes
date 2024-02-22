<template>
  <div>
    <TheHeader />

    <UDivider></UDivider>

    <main>
      <UContainer :ui="{ padding: 'py-4' }">
        <slot />
      </UContainer>
    </main>
  </div>
</template>
