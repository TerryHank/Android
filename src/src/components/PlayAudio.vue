<template></template>

<script setup lang="ts">
import { useStore } from "src/stores/example-store";
import { watch } from "vue";

const store = useStore();
const playAudio = () => {
  // const audio = document.createElement("audio");
  // audio.src = `/android_asset/clickBtn.mp3`;
  // audio.play();
  // setTimeout(() => {
  //   audio.remove()
  // }, 10000)
  console.log("playAudio");
  if (window.android) window.android.playSound();
};

watch(
  () => store.playAudio,
  (val) => {
    if (val) {
      playAudio();
      store.playAudio = false;
    }
  }
);
</script>
