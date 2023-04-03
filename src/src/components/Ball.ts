import { useStore } from "src/stores/example-store";
import { useKeyboardStore } from "src/stores/keyboard";
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
import { onMounted, computed, ref } from "vue";
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
  interface SubBallEvent {
    (x: number, y: number, z: number, index: number, maxIndex: number): void;
  }
}

const store = useStore();
const minX = 0,
  maxX = 122,
  minY = -18,
  maxY = 60;

//const privousActivePlane = ref(-1);
const activePlane = ref(1);

let lastMainCoordinate = { x: 0, y: 0 };

const activeMaterial = new MeshPhongMaterial({
  color: 0xffffff,
  specular: 0xffffff,
  shininess: 30,
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
const touchButton = (name: string) => {
  if (new Date().getTime() - btnTouchTime < store.btnBounce * 1000) {
    return;
  }
  store.playAudio = true;
  const btn = name.replace("right", "");
  console.log(name, btn);
  btnTouchTime = new Date().getTime();
  if (btn == "C") {
    store.content = "";
  } else if (btn == "=") {
    const exp = store.content.replaceAll("÷", "/");
    // 计算表达式
    try {
      store.content = eval(exp);
    } catch (error) {
      store.content = "表达式错误";
    }
  } else {
    store.content = store.content + btn;
  }
};

const keyboard = useKeyboardStore();
const getPositionBlock = (ballX: number, ballY: number) => {
  const button = keyboard.keyboard.find((button) => {
    const { x: leftX, y: leftY } = button.leftBottom;
    const { x: rightX, y: rightY } = button.rightTop;
    if (
      ballX >= leftX &&
      ballX <= rightX &&
      ballY >= leftY &&
      ballY <= rightY
    ) {
      return true;
    }
    return false;
  });

  if (button) {
    const centerX = (button.leftBottom.x + button.rightTop.x) / 2;
    const centerY = (button.leftBottom.y + button.rightTop.y) / 2;
    const height = button.height;
    return { name: button.name, x: centerX, y: centerY, z: height };
  }
  return null;
};

const blockBallTimer = new Map<string, number>();
const ballState: Vector3[][] = [];
const updateBall = () => {
  if (activePlane.value == 0) {
    balls.forEach((m) => (m.visible = false));
    // 寻找最低的小球
    let minBall = balls[0];
    balls.forEach((ball) => {
      if (ball.position.y < minBall.position.y) {
        minBall = ball;
      }
    });
    minBall.visible = true;

    // 射线获取距离下方的高度
    const activeList: string[] = [];
    store.scene
      ?.getObjectByName("blockGroup")
      ?.children.filter((m) => m.name.startsWith("left"))
      .forEach((m) => {
        const x = m.position.x;
        const z = m.position.y;
        if (
          minBall.position.x > x - 6 &&
          minBall.position.x < x + 6 &&
          minBall.position.y > z - 6 &&
          minBall.position.y < z + 6
        ) {
          const distance = minBall.position.z - store.buttonHeight.low;
          minBall.children[0].scale.set(1, distance / 100, 1);
          if (distance < 2) {
            (<Mesh>m).material = activeMaterial;
            touchButton(m.name);
            activeList.push(m.name);
          } else {
            (<Mesh>m).material = cubeMaterial;
          }
        } else {
          if (!activeList.includes(m.name)) (<Mesh>m).material = cubeMaterial;
        }
      });
  } else if (activePlane.value == 1) {
    store.scene?.getObjectByName("blockGroup")?.children.forEach((m) => {
      (<Mesh>m).material = cubeMaterial2;
    });
    balls.forEach((ball) => {
      if (
        ball.position.z < 0 ||
        ball.position.z > 80 ||
        ball.visible == false
      ) {
        return;
      }

      const block = getPositionBlock(ball.position.x, ball.position.y);
      if (block) {
        if (ball.position.z > block.z) {
          store.pushRealTimeCoordinate(`${block.name} 上小球因高度超出不触发`);
          return;
        }
        if (blockBallTimer.get(block.name) != undefined) {
          if (new Date().getTime() - blockBallTimer.get(block.name)! < 200) {
            store.pushRealTimeCoordinate(
              `${block.name} 上小球因 200ms 内有小球不触发`
            );
            return;
          }
        }
        blockBallTimer.set(block.name, new Date().getTime());
        if (ballState.length == 0) return;

        if (ballState[0].find((m) => m.distanceTo(ball.position) < store.L1)) {
          store.pushRealTimeCoordinate(
            `${block.name} 上小球因上一次同步在L1范围内不触发`
          );
          return;
        }

        if (ballState[0].find((m) => m.distanceTo(ball.position) < store.L2)) {
          const mesh = <Mesh>(
            store.scene
              ?.getObjectByName("blockGroup")
              ?.getObjectByName(block.name)
          );
          mesh.material = activeMaterial;
          touchButton(block.name);
          return;
        }

        store.pushRealTimeCoordinate(
          `${block.name} 上小球因上一次同步不在L2范围内不触发`
        );
      }
    });

    ballState.unshift(balls.map((ball) => ball.position.clone()));
    if (ballState.length > 5) ballState.pop();
  } else {
    balls.forEach((ball) => {
      ball.visible = false;
    });
  }
};

const receiveMainCoordinate = (
  x: number,
  y: number,
  z: number,
  isShowArrow: boolean
) => {
  // if (!isShowArrow) {
  //   store.pushRealTimeCoordinate(
  //     `箭头坐标 ${parseInt(String(x))},${parseInt(String(y))} 但不更新`
  //   );
  //   return;
  // }
  // let ballX = lastMainCoordinate.x + x;
  // let ballY = lastMainCoordinate.y + y;
  // if (ballY < minY) ballY = minY;
  // else if (ballY > maxY) ballY = maxY;
  // // if (ballX < 0 && ballX > -82) {
  // //   if (activePlane.value !== 0) {
  // //     if (Math.abs(x) < store.threshold) {
  // //       store.pushRealTimeCoordinate(
  // //         `箭头坐标 ${parseInt(String(x))},${parseInt(
  // //           String(y)
  // //         )} 映射后 ${parseInt(String(ballX))},${parseInt(String(ballY))}`
  // //       );
  // //       return;
  // //     }
  // //     privousActivePlane.value = activePlane.value;
  // //   }
  // //   activePlane.value = 0;
  // //   PlaneService.activePlane(0);
  // //   PlaneService.deactivePlane(1);
  // // } else
  // if (ballX > 0 && ballX < 82) {
  //   // if (activePlane.value !== 1) {
  //   //   if (Math.abs(x) < store.threshold) {
  //   //     store.pushRealTimeCoordinate(
  //   //       `箭头坐标 ${parseInt(String(x))},${parseInt(
  //   //         String(y)
  //   //       )} 映射后 ${parseInt(String(ballX))},${parseInt(String(ballY))}`
  //   //     );
  //   //     return;
  //   //   }
  //   //   privousActivePlane.value = activePlane.value;
  //   // }
  //   activePlane.value = 1;
  //   PlaneService.activePlane(1);
  //   // PlaneService.deactivePlane(0);
  // } else {
  //   if (ballX < 0) ballX = 0;
  //   else if (ballX > 82) ballX = 82;
  // }
  // store.pushRealTimeCoordinate(
  //   `箭头坐标 ${parseInt(String(x))},${parseInt(String(y))} 映射后 ${parseInt(
  //     String(ballX)
  //   )},${parseInt(String(ballY))}`
  // );
  // lastMainCoordinate = { x: ballX, y: ballY };
  // updateBall();
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

const receiveSubBallCoordinate = (
  x: number,
  y: number,
  z: number,
  index: number,
  maxIndex: number
) => {
  // 当传完一系列后再更新
  if (index <= maxIndex) updateBall();

  const ball = balls[index];
  if (x > 2000 && y > 2000) {
    ball.visible = false;
    return;
  }

  const preX =
    parseInt(String(store.getAxisRate.x)) * x +
    parseInt(String(store.getAxisOffset.x));
  const preY =
    parseInt(String(store.getAxisRate.y)) * y +
    parseInt(String(store.getAxisOffset.y));
  const preZ =
    parseInt(String(store.getAxisRate.z)) * z +
    parseInt(String(store.getAxisOffset.z));

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

  if (finishX < 0 || finishX > 122) {
    finishX = finishX < 0 ? 0 : 122;
  }
  if (finishY < minY || finishY > maxY) {
    finishY = finishY < minY ? minY : maxY;
  }
  ball.position.set(finishX, finishY, finishZ);
  ball.visible = true;

  const distance = finishZ - getAxisHeight(finishX, finishY);
  //console.log(distance);
  ball.children[0].scale.set(1, distance / 100, 1);

  store.pushRealTimeCoordinate(
    `${index}号小球 ${parseInt(String(x))},${parseInt(String(y))},${parseInt(
      String(z)
    )} 映射后 ${parseInt(String(finishX))},${parseInt(
      String(finishY)
    )},${parseInt(String(finishZ))} 偏移${parseInt(
      String(store.getAxisOffset.x)
    )} 调整前${parseInt(String(x))}后${preX}`
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
  const ball = new SphereGeometry(2, 32, 32);

  for (let i = 0; i < 4; i++) {
    const ballMesh = new Mesh(ball, materialBasic);
    ballMesh.position.set(0, 0, 100);
    ballMesh.visible = false;

    // 小球与投影的连线 是圆柱体
    const ballLine = new CylinderGeometry(0.2, 0.2, 100, 16);
    const ballLineMesh = new Mesh(ballLine, materialBasic);
    ballLineMesh.position.set(0, 0, 0);
    // 设置中心点
    ballLineMesh.geometry.translate(0, -50, 0);

    ballLineMesh.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2);
    ballMesh.add(ballLineMesh);
    const smallBall = new SphereGeometry(1, 16, 16);
    const smallBallMesh = new Mesh(smallBall, materialBasic);
    ballLineMesh.add(smallBallMesh);
    smallBallMesh.position.set(0, 0, 0);
    // 设置中心点
    smallBallMesh.geometry.translate(0, -100, 0);

    ballLineMesh.scale.set(1, 0.3, 1);
    scene.add(ballMesh);
    balls.push(ballMesh);
  }
};

const initReceiveFunction = () => {
  window.receiveMainCoordinate = receiveMainCoordinate;
  store.subBallReceiver.set("ball", receiveSubBallCoordinate);
};
const removeReceiveFunction = () => {
  store.subBallReceiver.delete("ball");
};
export default {
  createBall,
  updateBall,
  initReceiveFunction,
  removeReceiveFunction,
};
