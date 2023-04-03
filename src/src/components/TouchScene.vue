<template>
  <div ref="video_container"></div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { useStore } from "src/stores/example-store";
import {
  SphereGeometry,
  LinearFilter,
  RGBAFormat,
  MeshBasicMaterial,
  Mesh,
  DoubleSide,
  Scene,
  PerspectiveCamera,
  Vector3,
  WebGLRenderer,
  Clock,
  TextureLoader,
  PlaneGeometry,
  TubeGeometry,
  BoxGeometry,
  MeshPhongMaterial,
  DirectionalLight,
  Fog,
  Sprite,
  SpriteMaterial,
  Plane,
  Group,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import BallService from "./TouchBall";
import PlaneService from "./Plane";

const video_container = ref();
const quasar = useQuasar();

let scene: Scene;
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;

let stop = false;
// 创建一个时钟对象Clock
var clock = new Clock();
// 设置渲染频率为30FBS，也就是每秒调用渲染器render方法大约30次
var FPS = 24;
var renderT = 1 / FPS; //单位秒  间隔多长时间渲染渲染一次
// 声明一个变量表示render()函数被多次调用累积时间
// 如果执行一次renderer.render，timeS重新置0
var timeS = 0;

var ticks = 0;

const operation = () => {
  if (ticks++ % 10 == 0) {
    const arrow = scene.getObjectByName("arrow")!;
    const childrens = arrow.children;
    let minBall = childrens[0];
    childrens
      .filter((ball) => ball.position.z > 0)
      .forEach((ball) => {
        if (ball.position.z < minBall.position.z) {
          minBall = ball;
        }
      });
    minBall.visible = true;
  }
};

const animate = () => {
  if (stop) return;

  requestAnimationFrame(animate);

  var T = clock.getDelta();
  timeS = timeS + T;
  if (timeS > renderT) {
    // operation();

    renderer.render(scene, camera);
    //renderer.render每执行一次，timeS置0
    timeS = 0;
  }
};

const store = useStore();
watch(
  () => store.heightKey,
  (val) => {
    scene.clear();
    initItems();
  }
);

const initLogoText = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 256 + 30;
  canvas.height = 128;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  // 华文楷体
  context!.font = "48px 'STKaiti', '华文楷体', serif";
  context!.fillStyle = "rgba(255,0,0, 0.8)";
  context!.textAlign = "center";
  context!.textBaseline = "middle";
  // 原宇科技 四个字 每个字 32* 32
  context!.fillText("原", 64 * 0 + 32, 64);
  context!.fillText("宇", 64 * 1 + 32, 64);
  context!.fillText("科", 64 * 2 + 32, 64);
  context!.fillText("技", 64 * 3 + 32, 64);

  const texture = new TextureLoader().load(canvas.toDataURL("image/png"));
  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: DoubleSide,
  });

  const textPlane = new PlaneGeometry(48 * 4 + 10 * 3, 90);
  const textMesh = new Mesh(textPlane, material);

  textMesh.position.set(122, 150, 30);
  textMesh.rotation.x = Math.PI / 2;
  scene.add(textMesh);

  canvas.remove();
};

const initRight = () => {
  // 金属材质，灰色 受光照影响

  const cubeMaterial = new MeshPhongMaterial({
    color: 0x808080,
    specular: 0x808080,
    shininess: 30,
  });

  const group = new Group();
  group.name = "blockGroup";
  scene.add(group);

  for (let y = 0; y < 4; y++) {
    let cubeX = 30;
    let cubeY = 40 + 30 * y;
    for (let x = 0; x < 6; x++) {
      // 添加一个长方体
      let height = store.buttonHeight.medium;

      const cube = new BoxGeometry(12, 12, height);
      const cubeMeshHigh = new Mesh(cube, cubeMaterial);
      cubeMeshHigh.position.set(cubeX + 6, cubeY + 6, height / 2);
      cubeMeshHigh.name = `${x},${y}`;
      group.add(cubeMeshHigh);

      cubeX += 30;
    }
  }

  for (let x = 0; x < 9; x++) {
    if (x == 5) continue;
    let cubeX = 46 + 15 * x;
    let cubeY = 13;
    let height = store.buttonHeight.medium;

    const cube = new BoxGeometry(12, 12, height);
    const cubeMeshHigh = new Mesh(cube, cubeMaterial);
    cubeMeshHigh.position.set(cubeX + 6, cubeY + 6, height / 2);
    cubeMeshHigh.name = `${x},-1`;
    group.add(cubeMeshHigh);
  }
};

const initItems = () => {
  scene.add(camera);

  PlaneService.createPlane(scene, 222, 154);
  BallService.createBall(scene);

  const light = new DirectionalLight(0xffffff, 1);
  light.position.set(20, 20, 10);
  scene.add(light);
  camera.position.x = 111;

  initRight();
  //initLeft()

  initLogoText();
};

let init = false;
let size = {
  width: 0,
  height: 0,
};
const initScene = () => {
  const container = video_container.value; //获取容器
  // 1. 创建场景
  scene = new Scene();
  store.scene = scene;
  const mainDom = document.querySelector(".q-page");

  if (!init) {
    size.width = mainDom!.clientWidth;
    size.height = mainDom!.clientHeight;
  }
  camera = new PerspectiveCamera(80, size.width / size.height, 0.1, 3000);
  camera.position.set(111, -70, 60);
  camera.lookAt(111, 77, 0);

  // 4. 创建渲染器
  renderer = new WebGLRenderer();
  renderer.setSize(size.width, size.height - 40);
  renderer.setClearColor(0xb9d3ff, 1);

  container.appendChild(renderer.domElement);

  // 6. 添加控件
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  // 以 41,0,0 为中心
  controls.target.set(111, 77, 0);
  controls.update();
  init = true;
  initItems();
  animate();
};

onMounted(() => {
  initScene();
  setTimeout(() => {
    const origin = store.buttonHeight.low;
    store.buttonHeight.low = 10;
    setTimeout(() => {
      store.buttonHeight.low = origin;
    }, 500);
  }, 5000);
  setTimeout(() => {
    BallService.initReceiveFunction();
  }, 500);
});

onBeforeUnmount(() => {
  stop = true;
  BallService.removeReceiveFunction();
});
</script>
