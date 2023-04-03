import { useStore } from "src/stores/example-store";
import {
  BoxGeometry,
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector3,
} from "three";
import { onMounted, computed, ref, watch } from "vue";
import { Coordinate } from "./models";
import PlaneService from "./Plane";

declare global {
  interface Window {
    receiveMainCoordinate: (
      x: number,
      y: number,
      z: number,
      isShowArrow: boolean
    ) => void;
    receiveSubBallCoordinate: (
      x: number,
      y: number,
      z: number,
      index: number,
      maxIndex: number
    ) => void;
  }
}

const store = useStore();
const minX = 0,
  maxX = 222,
  minY = 0,
  maxY = 154;

//const privousActivePlane = ref(-1);
const activePlane = ref(1);

let lastMainCoordinate = { x: 0, y: 0 };

const activeMaterial = new MeshBasicMaterial({
  color: "white",
});
const cubeMaterial = new MeshPhongMaterial({
  color: 0x805555,
  specular: 0x805555,
  shininess: 30,
});
const cubeMaterial2 = new MeshPhongMaterial({
  color: 0x808080,
  specular: 0x808080,
  shininess: 30,
});

let btnTouchTime: number = 0;
let lastBtn: string = "";
const touchButton = (name: string) => {
  if (new Date().getTime() - btnTouchTime < store.btnBounce * 1000) {
    return;
  }
  if (lastBtn == name) {
    return;
  }
  lastBtn = name;

  store.playAudio = true;
  const btn = name.replace("right", "");
  console.log(name, btn);
  btnTouchTime = new Date().getTime();
};

const getPositionBlock = (ballX: number, ballY: number) => {
  const shadowHalfWidth = store.ball.shadow;
  for (let y = 0; y < 4; y++) {
    let cubeX = 36;
    let cubeY = 46 + 30 * y;
    for (let x = 0; x < 6; x++) {
      let height = store.buttonHeight.medium;
      const halfWidth = 7;
      const halfHeight = 7;
      const name = `${x},${y}`;

      if (
        ballX > cubeX - shadowHalfWidth - halfWidth &&
        ballX < cubeX + shadowHalfWidth + halfWidth &&
        ballY < cubeY + shadowHalfWidth + halfHeight &&
        ballY > cubeY - shadowHalfWidth - halfHeight
      ) {
        return { name, x: cubeX, y: cubeY, z: height };
      }

      cubeX += 30;
    }
  }

  for (let x = 0; x < 9; x++) {
    if (x == 5) continue;
    let cubeX = 52 + 15 * x;
    let cubeY = 19;
    let height = store.buttonHeight.medium;

    const halfWidth = 7;
    const halfHeight = 7;
    const name = `${x},-1`;

    if (
      ballX > cubeX - shadowHalfWidth - halfWidth &&
      ballX < cubeX + shadowHalfWidth + halfWidth &&
      ballY < cubeY + shadowHalfWidth + halfHeight &&
      ballY > cubeY - shadowHalfWidth - halfHeight
    ) {
      return { name, x: cubeX, y: cubeY, z: height };
    }
  }
  return null;
};

const updateBall = () => {
  // 寻找最低的小球
  let minBall = balls[0];
  balls
    .filter((ball) => ball.position.z > 0)
    .forEach((ball) => {
      if (ball.position.z < minBall.position.z) {
        minBall = ball;
      }
    });

  store.scene?.getObjectByName("blockGroup")?.children.forEach((m) => {
    (<Mesh>m).material = cubeMaterial2;
  });

  balls
    .filter((m) => m.id !== minBall.id)
    .forEach((m) => {
      m.visible = false;
    });
  minBall.visible = true;

  const position = new Vector3();
  minBall.getWorldPosition(position);
  const block = getPositionBlock(position.x, position.y);
  if (block) {
    if (position.z > block.z) {
      store.pushRealTimeCoordinate(`${block.name} 上小球因高度超出不触发`);
      return;
    }

    store.pushRealTimeCoordinate(
      `${block.name} 上小球触发 ${position.x},${position.y},${position.z}`
    );
    const mesh = <Mesh>(
      store.scene?.getObjectByName("blockGroup")?.getObjectByName(block.name)
    );
    mesh.material = activeMaterial;
    setTimeout(() => {
      mesh.material = cubeMaterial2;
    }, 3000);
    touchButton(block.name);
    return;
  }
};

const receiveMainCoordinate = (
  x: number,
  y: number,
  z: number,
  isShowArrow: boolean
) => {
  if (!isShowArrow) {
    store.pushRealTimeCoordinate(
      `箭头坐标 ${parseInt(String(x))},${parseInt(String(y))} 但不更新`
    );
    return;
  }

  const arrow = store.scene?.getObjectByName("arrow");
  let ballX = arrow!.position.x + x;
  let ballY = arrow!.position.y + y;
  if (ballY < minY) ballY = minY;
  else if (ballY > maxY) ballY = maxY;

  if (ballX < 0) ballX = 0;
  else if (ballX > maxX) ballX = maxX;

  arrow?.position.set(ballX, ballY, arrow!.position.z);
  store.pushRealTimeCoordinate(
    `箭头坐标 ${parseInt(String(x))},${parseInt(String(y))} 映射后 ${parseInt(
      String(ballX)
    )},${parseInt(String(ballY))}`
  );
};

const getHeight = (x: number, y: number) => {
  if (x === 0 && y === 0) return store.buttonHeight.high;
  if (x === 0 && y === 3) return store.buttonHeight.high;
  if (x === 3 && y === 0) return store.buttonHeight.high;
  if (x === 3 && y === 3) return store.buttonHeight.high;
  if (x > 0 && y > 0 && x < 3 && y < 3) return store.buttonHeight.low;
  return store.buttonHeight.medium;
};
const getAxisHeight = (x: number, y: number) => {
  return getPositionBlock(x, y)?.z ?? 1;
};

const noSubballData = ref(false);
let subBallDataTimer: any = null;
const noDataDelta = 100;
watch(
  () => noSubballData.value,
  (val) => {
    balls.forEach((m) => {
      m.getObjectByName("shadow")!.visible = !val;
    });
  }
);

const receiveSubBallCoordinate = (
  x: number,
  y: number,
  z: number,
  index: number,
  maxIndex: number
) => {
  const ball = balls[index];
  if (x > 2000 && y > 2000) {
    const visible = balls.filter((m) => m.visible);
    if (
      ball.position.z !== 9999 &&
      !(visible.length === 1 && visible[0].id === ball.id)
    ) {
      let minBall = balls[0];
      balls
        .filter((ball) => ball.position.z > 0 && ball.position.z < 9999)
        .forEach((ball) => {
          if (ball.position.z < minBall.position.z) {
            minBall = ball;
          }
        });
      if (minBall.id !== ball.id) {
        ball.position.z = 9999;
        ball.visible = false;
      }
    }
    updateBall();
    return;
  }

  clearTimeout(subBallDataTimer);
  subBallDataTimer = setTimeout(() => {
    noSubballData.value = true;
  }, noDataDelta);
  noSubballData.value = false;

  const arrow = store.scene!.getObjectByName("arrow");

  const preX =
    parseInt(String(store.axisRate2.x)) * x +
    parseInt(String(store.axisOffset2.x));
  const preY =
    parseInt(String(store.axisRate2.y)) * y +
    parseInt(String(store.axisOffset2.y));
  const preZ =
    parseInt(String(store.axisRate2.z)) * z +
    parseInt(String(store.axisOffset2.z));

  const ballX =
    ((parseInt(String(preX)) - store.minX) / (store.maxX - store.minX)) *
      (maxX - minX) +
    minX;
  const ballY =
    ((parseInt(String(preY)) - store.minY) / (store.maxY - store.minY)) *
      (maxY - minY) +
    minY;

  let finishX = ballX,
    finishY = ballY,
    finishZ = preZ;

  // 显示最低的小球
  finishX = finishX < minX ? minX : finishX > maxX ? maxX : finishX;
  finishY = finishY < minY ? minY : finishY > maxY ? maxY : finishY;

  ball.position.set(finishX, finishY, finishZ);

  const distance = ball.position.z - 1;
  ball.children[0].scale.set(1, distance / 100, 1);

  // 当传完一系列后再更新
  if (index == maxIndex) updateBall();

  store.pushRealTimeCoordinate(
    `${index}号小球 ${parseInt(String(x))},${parseInt(String(y))},${parseInt(
      String(z)
    )} 映射后 ${parseInt(String(finishX))},${parseInt(
      String(finishY)
    )},${parseInt(String(finishZ))}`
  );
};

let balls: Mesh[] = [];
const createBall = (scene: Scene) => {
  // 清空小球
  balls = [];
  const material = new MeshPhongMaterial({
    color: "red",
    shininess: 30,
  });
  const materialBasic = new MeshBasicMaterial({
    color: "red",
  });
  const ball = new SphereGeometry(store.ball.size, 32, 32);

  const arrowBall = new SphereGeometry(0.1, 12, 12);
  const arrowBallMesh = new Mesh(arrowBall, materialBasic);
  arrowBallMesh.name = "arrow";
  arrowBallMesh.position.set(111, 72, 0);
  scene.add(arrowBallMesh);

  for (let i = 0; i < 4; i++) {
    const ballMesh = new Mesh(ball, materialBasic);
    ballMesh.position.set(0, 0, 100);
    ballMesh.visible = false;

    // 小球与投影的连线 是圆柱体
    const ballLine = new CylinderGeometry(0.4, 0.4, 100, 16);
    const ballLineMesh = new Mesh(ballLine, materialBasic);
    ballLineMesh.position.set(0, 0, 0);
    // 设置中心点
    ballLineMesh.geometry.translate(0, -50, 0);

    ballLineMesh.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2);
    ballMesh.add(ballLineMesh);
    const smallBall = new SphereGeometry(store.ball.shadow, 16, 16);
    const smallBallMesh = new Mesh(smallBall, materialBasic);
    ballLineMesh.add(smallBallMesh);
    smallBallMesh.position.set(0, 0, 0);
    // 设置中心点
    smallBallMesh.geometry.translate(0, -100, 0);
    smallBallMesh.name = "shadow";
    ballLineMesh.scale.set(1, 0.3, 1);
    arrowBallMesh.add(ballMesh);
    balls.push(ballMesh);
  }
  console.log(balls);
};

const initReceiveFunction = () => {
  window.receiveMainCoordinate = receiveMainCoordinate;
  store.subBallReceiver.set("ball2", receiveSubBallCoordinate);
};
const removeReceiveFunction = () => {
  store.subBallReceiver.delete("ball2");
};

export default {
  createBall,
  updateBall,
  initReceiveFunction,
  removeReceiveFunction,
};
