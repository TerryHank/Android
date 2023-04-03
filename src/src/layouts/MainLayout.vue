<template>
  <q-layout view="lHh lpR lFf">
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" style="display: flex; flex-flow: column nowrap">
      <ParamSettingVue />
      <RealtimeCoordinate class="col" />
    </q-drawer>
    <q-header class="bg-transparent">
      <q-card class="q-ma-xs q-pa-lg text-h5 text-black flex">
        输入内容显示区
        <q-space />
        {{ store.content }}
      </q-card>
    </q-header>
    <PlayAudio />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import PlayAudio from "src/components/PlayAudio.vue";
import RealtimeCoordinate from "src/components/RealtimeCoordinate.vue";
import { useStore } from "src/stores/example-store";
import { ref } from "vue";
import ParamSettingVue from "../components/settings/ParamSetting.vue";

const leftDrawerOpen = ref(true);
const store = useStore();
function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

window.receiveSubBallCoordinate = (
  x: number,
  y: number,
  z: number,
  index: number,
  maxIndex: number
) => {
  store.subBallReceiver.forEach((receiver) => {
    receiver(x, y, z, index, maxIndex);
  });
};

window.getBase64 = (url: string) => {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "text/csv");
  console.log("下载");
  xhr.responseType = "blob";
  xhr.onload = function (e) {
    if (this.status == 200) {
      var blobFile = this.response;
      var reader = new FileReader();
      reader.readAsDataURL(blobFile);
      reader.onloadend = function () {
        var base64data = reader.result;
        window.download.getBase64FromBlobData(
          base64data,
          "data-" + new Date().getTime() + ".csv"
        );
      };
    }
  };
  xhr.send();
};
</script>
