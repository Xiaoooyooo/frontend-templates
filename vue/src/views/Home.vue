<template>
  <h1 class="text-center text-lg font-bold leading-8">
    <VueIcon class="m-auto" height="50" width="50" />
    <span>{{ message }}</span>
  </h1>
  <p>Count is: {{ countStore.count }}</p>
  <button @click="countStore.increment">increment</button>
</template>

<script setup lang="ts">
  import { useCountStore } from "@/store/count";
  import VueIcon from "@/assets/icons/vue.svg?component";

  const countStore = useCountStore();
  const message = "Welcome Home";
</script>
