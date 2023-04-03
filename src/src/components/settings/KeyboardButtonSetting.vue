<template>
  <div class="grid-container">
    <div class="grid-item" v-for="i in 9" :key="i">
      <div v-if="i == 1">
        {{ button.xIndex }},{{ button.yIndex }},{{ button.name }}
      </div>
      <div v-else-if="i == 2" style="margin: 6px 4px">
        <q-input filled dense v-model.number="button.rightTop.x" :debounce="400" />
      </div>
      <div v-else-if="i == 3" style="margin: 6px 4px">
        <q-input filled dense v-model.number="button.rightTop.y" :debounce="400" />
      </div>
      <div v-else-if="i == 5" style="margin: 6px 4px">
        <q-input filled dense v-model.number="button.height" :debounce="400" />
      </div>
      <div v-else-if="i == 7" style="margin: 6px 4px">
        <q-input filled dense v-model.number="button.leftBottom.x" :debounce="400" />
      </div>
      <div v-else-if="i == 8" style="margin: 6px 4px">
        <q-input filled dense v-model.number="button.leftBottom.y" :debounce="400" />
      </div>
      <div v-else-if="i == 9">
        <q-icon name="error" size="20px" color="red" v-if="error" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { KeyboardButton } from 'src/components/models'
import { useKeyboardStore } from 'src/stores/keyboard';

const props = defineProps<{ button: KeyboardButton }>()
const store = useKeyboardStore()
const error = computed(() => {
  if (props.button.rightTop.x <= props.button.leftBottom.x || props.button.rightTop.y <= props.button.leftBottom.y || props.button.height < 1) {
    return true;
  }
  // 检查上下左右是否有重叠
  for (const button of store.keyboard) {
    if (button.xIndex == props.button.xIndex && button.yIndex == props.button.yIndex) {
      continue
    }
    if (button.rightTop.x > props.button.leftBottom.x && button.rightTop.y > props.button.leftBottom.y && button.leftBottom.x < props.button.rightTop.x && button.leftBottom.y < props.button.rightTop.y) {
      return true
    }
  }
  return false
})
</script>

<style>
.grid-container {
  display: flex;
  flex-wrap: wrap;
  width: 150px;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33.33%;
  height: 50px;
  border: 1px solid #ccc;
}

.grid-container .q-field--filled .q-field__control {
  padding: 0 4px !important;
}
</style>