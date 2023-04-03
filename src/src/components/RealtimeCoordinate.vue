<template>
  <q-card class="q-ma-xs q-pb-sm column">
    <q-card-section class="text-h6 flex">
      小球实时坐标
      <q-space />
      <q-btn rounded :color="updateLog ? 'primary' : 'green'" text-color="white" :label="updateLog ? '暂停更新' : '开始更新'"
        @click="store.updateCoordinate = !store.updateCoordinate" />
    </q-card-section>

    <q-card-section style="padding: 0; flex-grow: 1; background-color: #f2f2f2">
      <q-input borderless type="textarea" :model-value="content" autogrow disable />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useStore } from 'src/stores/example-store';
import { computed } from 'vue';


const store = useStore()

const updateLog = computed(() => {
  return store.updateCoordinate;
})
const content = computed(() => {
  return store.realTimeCoordinate.join('\n')
})
</script>
