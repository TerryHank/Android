<template>
  <q-card class="q-mx-xs q-py-sm">
    <q-card-section class="text-h6"> 右侧参数设置 </q-card-section>
    <q-card-section>
      按键高度
      <div class="row">
        <q-input
          dense
          class="col q-mr-sm"
          type="number"
          stack-label
          v-model="store.buttonHeight.high"
          label="键盘默认高度"
        />
        <q-input
          dense
          class="col q-mr-sm"
          type="number"
          stack-label
          v-model="store.buttonHeight.medium"
          label="触摸默认高度"
        />
        <q-input
          dense
          class="col"
          type="number"
          stack-label
          v-model="store.buttonHeight.low"
          label="键盘中间默认"
        />
      </div>
    </q-card-section>
    <q-card-section>
      三轴倍率
      <div class="row">
        <q-input
          dense
          class="col q-mr-sm"
          type="number"
          stack-label
          v-model="store.axisRate.x"
          label="X1"
        />
        <q-input
          dense
          class="col q-mr-sm"
          type="number"
          stack-label
          v-model="store.axisRate.y"
          label="Y1"
        />
        <q-input
          dense
          class="col"
          type="number"
          stack-label
          v-model="store.axisRate.z"
          label="Z1"
        />
        <q-input
          dense
          class="col q-mr-sm"
          type="number"
          stack-label
          v-model="store.axisRate2.x"
          label="X2"
        />
        <q-input
          dense
          class="col q-mr-sm"
          type="number"
          stack-label
          v-model="store.axisRate2.y"
          label="Y2"
        />
        <q-input
          dense
          class="col"
          type="number"
          stack-label
          v-model="store.axisRate2.z"
          label="Z2"
        />
      </div>
    </q-card-section>
    <q-card-section>
      三轴偏移
      <div class="row">
        <q-input
          dense
          class="col q-mr-sm"
          ref="inputa"
          type="number"
          stack-label
          v-model="store.axisOffset.x"
          label="X1"
        />
        <q-input
          dense
          class="col q-mr-sm"
          type="number"
          stack-label
          v-model="store.axisOffset.y"
          label="Y1"
        />
        <q-input
          dense
          class="col"
          type="number"
          stack-label
          v-model="store.axisOffset.z"
          label="Z1"
        />
        <q-input
          dense
          class="col q-mr-sm"
          ref="inputa"
          type="number"
          stack-label
          v-model="store.axisOffset2.x"
          label="X2"
        />
        <q-input
          dense
          class="col q-mr-sm"
          type="number"
          stack-label
          v-model="store.axisOffset2.y"
          label="Y2"
        />
        <q-input
          dense
          class="col"
          type="number"
          stack-label
          v-model="store.axisOffset2.z"
          label="Z2"
        />
      </div>
    </q-card-section>
    <q-card-section class="row q-px-md" v-if="$route.fullPath == '/record'">
      <q-btn dense flat text-color="orange" label="返回场景" @click="$router.push('/')" />
    </q-card-section>
    <q-card-section class="row q-px-md" v-else>
      <q-btn
        dense
        flat
        text-color="red"
        label="键位设置"
        @click="enableKeyboard = !enableKeyboard"
      />
      <q-btn
        dense
        flat
        text-color="green"
        label="切换场景"
        @click="store.enableScene = store.enableScene ? 0 : 1"
      />
      <q-btn dense flat text-color="blue" label="坐标映射" @click="showLimit = true" />
      <q-btn
        dense
        flat
        text-color="orange"
        label="打标数据"
        @click="$router.push('/record')"
      />
    </q-card-section>

    <q-dialog v-model="showLimit">
      <q-card>
        <q-card-section>
          <q-input type="number" stack-label v-model="store.btnBounce" label="按钮防抖" />
          <q-input type="number" stack-label v-model="store.L1" label="L1" />
          <q-input type="number" stack-label v-model="store.L2" label="L2" />
          <q-input
            type="number"
            stack-label
            v-model.number="store.ball.size"
            label="小球面积"
          />
          <q-input
            type="number"
            stack-label
            v-model.number="store.ball.shadow"
            label="阴影大小"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="enableKeyboard">
      <q-card style="max-width: 1000px">
        <q-card-section class="q-ma-sm">
          <q-btn color="primary" label="重置到初始值" @click="keyboard.pushDefault()" />
        </q-card-section>
        <q-card-section class="row" style="flex-wrap: nowrap" v-for="i in 3">
          <div v-for="j in i == 2 ? 6 : 5" style="margin-right: 10px">
            <keyboard-button-setting
              :button="keyboardMapper.get((j - 1) + ',' + (i - 1))!"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { QInput } from "quasar";
import { computed, onMounted, Ref, ref, watch } from "vue";
import { useStore } from "src/stores/example-store";
import KeyboardButtonSetting from "./KeyboardButtonSetting.vue";
import { useKeyboardStore } from "src/stores/keyboard";
import { useRouter } from "vue-router";

const store = useStore();
const load = ref(false);
const showLimit = ref(false);
const enableKeyboard = ref(false);

const keyboard = useKeyboardStore();
const keyboardMapper = computed(() => keyboard.keyboardMapper);

const inputa: Ref<QInput | undefined> = ref();
const inputb: Ref<QInput | undefined> = ref();
watch(
  () => store.totalKey,
  (val) => {
    if (load.value)
      localStorage.setItem(
        "settings",
        JSON.stringify({
          buttonHeight: store.buttonHeight,
          axisRate: store.axisRate,
          axisOffset: store.axisOffset,
          axisRate2: store.axisRate2,
          axisOffset2: store.axisOffset2,
          limit: {
            minX: store.minX,
            maxX: store.maxX,
            minY: store.minY,
            maxY: store.maxY,
            threshold: store.threshold,
            btnBounce: store.btnBounce,
          },
          L1: store.L1,
          L2: store.L2,
          ball: {
            size: store.ball.size,
            touchSize: store.ball.touchSize,
            shadow: store.ball.shadow,
          },
        })
      );
    console.log("save");
  }
);

watch(
  () => keyboard.keyboardKey,
  (val) => {
    if (load.value) {
      localStorage.setItem("keyboard", JSON.stringify(keyboard.keyboard));
    }
  }
);

onMounted(() => {
  if (localStorage.getItem("settings")) {
    const settings = JSON.parse(localStorage.getItem("settings") as string);
    store.buttonHeight = settings.buttonHeight;
    store.axisRate = settings.axisRate;
    store.axisOffset = settings.axisOffset;
    store.axisRate2 = settings.axisRate2;
    store.axisOffset2 = settings.axisOffset2;
    store.minX = settings.limit.minX;
    store.maxX = settings.limit.maxX;
    store.minY = settings.limit.minY;
    store.maxY = settings.limit.maxY;
    store.threshold = settings.limit.threshold;
    store.btnBounce = settings.limit.btnBounce;
    store.L1 = settings.L1;
    store.L2 = settings.L2;
    store.ball = settings.ball ?? store.ball;
  }

  if (localStorage.getItem("keyboard")) {
    keyboard.keyboard = JSON.parse(localStorage.getItem("keyboard") as string);
  }
  if (keyboard.keyboard.length == 0) {
    keyboard.pushDefault();
  }
  load.value = true;
});
</script>

<style scoped>
.q-card__section--vert {
  padding: 4px 12px !important;
}
</style>
