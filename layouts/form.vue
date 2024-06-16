<template>
  <div>
    <TheHeader />

    <UDivider></UDivider>

    <main>
      <UContainer :ui="{ padding: 'py-4', constrained: 'max-w-96' }">
        <slot />
      </UContainer>
    </main>
  </div>
</template>
