<template>
  <div>
    <TheHeader />
    <main>
      <UContainer :ui="{ padding: 'py-4' }">
        <slot />
      </UContainer>
    </main>
  </div>
</template>
