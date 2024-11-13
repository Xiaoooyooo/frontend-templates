<template>
  <header>This is header</header>
  <main>
    <!-- <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView> -->
    <RouterView />
  </main>
  <footer>this is footer</footer>
</template>

<script setup lang="ts"></script>
