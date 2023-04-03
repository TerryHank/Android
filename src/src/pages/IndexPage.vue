<template>
  <q-page class="row items-center justify-evenly" style="position: relative">
    <scene v-if="store.enableScene == 0" />
    <touch-scene v-else />
  </q-page>
</template>

<script setup lang="ts">
import Scene from "src/components/Scene.vue";
import TouchScene from "src/components/TouchScene.vue";
import { useStore } from "src/stores/example-store";
import { ref } from "vue";

const store = useStore();
</script>
