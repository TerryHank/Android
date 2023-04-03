<template>
  <div class="fullscreen bg-white column" style="flex-wrap: nowrap">
    <div class="q-gutter-sm q-ma-md flex">
      <q-btn text-color="orange" label="返回场景" @click="$router.push('/')" />

      <q-btn v-if="!start" @click="startRecording">开始录制</q-btn>
      <q-btn v-else @click="stopRecording">停止录制</q-btn>
      <q-btn :disabled="recordedChunks.length == 0 || start" @click="replayRecording">
        回放录制
      </q-btn>
      <q-input filled dense v-model="replaySpeed" label="播放倍速" style="width: 120px" />
      <q-checkbox v-model="displayAll" label="展示所有数据" />

      <q-btn @click="exportText">导出文本</q-btn>
    </div>
    <div class="flex" style="position: relative; flex-grow: 1">
      <div class="videoPlayer">
        <div class="scene-container">
          <scene ref="scene"></scene>
        </div>
        <div class="btn-container q-gutter-xs full-width">
          <q-btn color="white" text-color="black" label="向后0.5" @click="videoPlayer!.currentTime -= 0.5" />
          <q-btn color="white" text-color="black" label="向后0.2" @click="videoPlayer!.currentTime -= 0.2" />
          <q-btn color="white" text-color="black" label="向后0.1" @click="videoPlayer!.currentTime -= 0.1" />

          <q-btn color="white" text-color="black" label="播放" v-if="!replaying"
            @click="videoPlayer!.play(), replaying = true" />
          <q-btn color="white" text-color="black" label="暂停" v-else @click="videoPlayer!.pause(), replaying = false" />
          <q-btn color="white" text-color="black" label="向前0.1" @click="videoPlayer!.currentTime += 0.1" />
          <q-btn color="white" text-color="black" label="向前0.2" @click="videoPlayer!.currentTime += 0.2" />
          <q-btn color="white" text-color="black" label="向前0.5" @click="videoPlayer!.currentTime += 0.5" />
          <q-space />
          <div class="bg-white text-black q-pa-sm">
            时间 {{ videoPlayer?.currentTime }}
          </div>
        </div>
        <video ref="videoPlayer" class="full-width full-height" autoplay controls @pause="replaying = false"
          @play="replaying = !start"></video>
      </div>
      <div class="flex" style="width: 400px; height: 100%; flex-wrap: nowrap; position: relative">
        <record-table :data="data" :display-all="displayAll" :replay-time="replayTime"></record-table>
      </div>
    </div>
    <q-dialog v-model="showText">
      <q-card>
        <q-card-section>
          <div class="text-h6">导出内容</div>
        </q-card-section>
        <q-card-section v-html="content"> </q-card-section>
        <q-card-actions align="right" class="bg-white" style="position: sticky; bottom: 0">
          <q-btn flat label="下载" color="primary" @click="downloadContent" />
          <q-btn flat label="关闭" color="primary" @click="showText = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import RecordTable from "src/components/RecordTable.vue";
import { useQuasar } from "quasar";
import { useRecordStore, RecordData } from "src/stores/record";
import Scene from "src/components/Scene.vue";
import { useStore } from "src/stores/example-store";
const videoPlayer = ref<HTMLVideoElement>();
const mediaRecorder = ref<MediaRecorder | null>(null);
const recordedChunks = ref<Blob[]>([]);
const start = ref(false);

const scene = ref();

const startTime = ref(0);
const startRecording = () => {
  store.clear();
  recordedChunks.value = [];
  videoPlayer.value!.srcObject = null;
  videoPlayer.value!.src = "";

  // 优先获取前置摄像头
  const constraints = {
    video: {
      facingMode: "user",
    },
  };
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    videoPlayer.value!.srcObject = stream;
    startTime.value = new Date().getTime();
    const options = { mimeType: "video/webm;codecs:h.264" };
    mediaRecorder.value = new MediaRecorder(stream, options);
    // mediaRecorder.value.setVideoEncoder(MediaRecorder.VideoEncoder.H264);
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data);
      }
    };
    mediaRecorder.value.start(1000);
    start.value = true;
  });
};

const stopRecording = () => {
  mediaRecorder.value?.stop();
  (<MediaStream>videoPlayer.value!.srcObject!)
    .getTracks()
    .forEach((track) => track.stop());
  videoPlayer.value!.srcObject = null;
  videoPlayer.value!.src = "";
  start.value = false;
};

const replaying = ref(false);
const replayTime = ref(0);
const replaySpeed = ref(0.1);
const displayAll = ref(false);
const replayRecording = () => {
  const blob = new Blob(recordedChunks.value, { type: "video/mp4" });
  videoPlayer.value!.src = URL.createObjectURL(blob);
  videoPlayer.value!.play();
  videoPlayer.value!.playbackRate = replaySpeed.value;
  replaying.value = true;

  videoPlayer.value!.addEventListener("timeupdate", () => {
    replayTime.value = videoPlayer.value!.currentTime;
  });
  videoPlayer.value!.addEventListener("ended", () => {
    replaying.value = false;
    videoPlayer.value!.src = "end";
    videoPlayer.value!.onended = null;
    videoPlayer.value!.ontimeupdate = null;
  });
};
watch(
  () => replaySpeed.value,
  (val) => {
    videoPlayer.value!.playbackRate = val;
  }
);
let tmp: RecordData = <RecordData>{};
const store = useRecordStore();
const data = store.data;

const pushData = () => {
  if (start.value) {
    tmp.timestamp = new Date().getTime() - startTime.value;
    tmp.label = "";
    data.push(tmp);
  }
  tmp = <RecordData>{};
};
const receiveData = (
  x: number,
  y: number,
  z: number,
  index: number,
  maxIndex: number
) => {
  if (index == 0) {
    tmp.x1 = Number(x.toFixed(4));
    tmp.y1 = Number(y.toFixed(4));
    tmp.z1 = Number(z.toFixed(4));
  } else if (index == 1) {
    tmp.x2 = Number(x.toFixed(4));
    tmp.y2 = Number(y.toFixed(4));
    tmp.z2 = Number(z.toFixed(4));
  } else if (index == 2) {
    tmp.x3 = Number(x.toFixed(4));
    tmp.y3 = Number(y.toFixed(4));
    tmp.z3 = Number(z.toFixed(4));
  } else if (index == 3) {
    tmp.x4 = Number(x.toFixed(4));
    tmp.y4 = Number(y.toFixed(4));
    tmp.z4 = Number(z.toFixed(4));
  }

  if (index == maxIndex) {
    pushData();
  }
};
const downloadContent = () => {
  // 创建blob并下载
  const header = "x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4,label\n";
  const text = data
    .map((d) => {
      return `${d.x1},${d.y1},${d.z1},${d.x2},${d.y2},${d.z2},${d.x3},${d.y3},${d.z3},${d.x4},${d.y4},${d.z4},${d.label}`;
    })
    .join("\n");
  const blob = new Blob([header + text], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const dom = document.createElement("a");
  dom.href = url;
  dom.download = "data.csv";
  dom.click();
};
const store2 = useStore();
onMounted(() => {
  store2.subBallReceiver.set("record", receiveData);
});
onBeforeUnmount(() => {
  store2.subBallReceiver.delete("record");
});

const quasar = useQuasar();

const showText = ref(false);
const content = ref("");
const exportText = () => {
  showText.value = true;
  const header = "x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4,label<br />";
  const text = data
    .map((d) => {
      return `${d.x1},${d.y1},${d.z1},${d.x2},${d.y2},${d.z2},${d.x3},${d.y3},${d.z3},${d.x4},${d.y4},${d.z4},${d.label}`;
    })
    .join("<br />");
  content.value = header + text;
};
</script>

<style lang="sass">
.videoPlayer
  flex-grow: 1
  height: 100%
  width: calc( 100% -  400px)
  position: relative
.scene-container
  position: absolute
  bottom: 0
  right: 0
  width: 300px
  height: 200px
  z-index: 9999
.btn-container
  position: absolute
  top: 0
  left: 0
  padding: 10px
  display: flex
  flex-flow: row
  z-index: 9999
</style>
