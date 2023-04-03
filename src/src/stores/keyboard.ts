import { KeyboardButton } from "./../components/models";
import { useStore } from "./example-store";
import { defineStore } from "pinia";

const normal = useStore();

const textArr = ["123*+ ", "4560=C", "789÷- "].map((str) => str.split(""));
const size = [
  [
    [18, 20],
    [18, 13],
    [18, 18],
    [18, 18],
    [18, 18],
    [0, 0],
  ],
  [
    [13, 14],
    [18, 18],
    [18, 18],
    [18, 18],
    [18, 18],
    [18, 18],
  ],
  [
    [18, 20],
    [18, 13],
    [18, 18],
    [18, 18],
    [18, 18],
    [0, 0],
  ],
];
const defaultPosition = () => {
  let array = [];
  for (let y = 0; y < 3; y++) {
    let cubeX = 2;
    let cubeY = 60 - 18 * y;
    for (let x = 0; x < 6; x++) {
      if (textArr[y][x] == " ") continue;

      cubeX += size[0][x][0] / 2;
      if (y == 0) {
        cubeY = 60 - size[0][x][1] / 2;
      } else if (y == 1) {
        cubeY = 31;
        if (x == 0) cubeX = 8.5;
        if (x == 5) cubeX = 2 + size[0][x][0] / 2 + 18 * 6 + 2;
      } else if (y == 2) {
        cubeY = 2 + size[0][x][1] / 2;
      }

      // 添加一个长方体
      let height = normal.buttonHeight.high;
      if (y == 1 && x > 0 && x < 5) {
        height = normal.buttonHeight.low;
      }

      const halfWidth = size[y][x][0] / 2;
      const halfHeight = size[y][x][1] / 2;
      const name = textArr[y][x];

      array.push(<KeyboardButton>{
        xIndex: x,
        yIndex: y,
        name,
        height,
        leftBottom: {
          x: cubeX - halfWidth,
          y: cubeY - halfHeight,
        },
        rightTop: {
          x: cubeX + halfWidth,
          y: cubeY + halfHeight,
        },
      });

      if (x == 0 && y == 1) {
        cubeX += 2;
      }

      cubeX += 2 + 18 - size[0][x][0] / 2;
    }
  }
  return array;
};

export const useKeyboardStore = defineStore("keyboard", {
  state: () => ({
    keyboard: <KeyboardButton[]>[],
  }),
  getters: {
    keyboardMapper: (state) => {
      let map = new Map<string, KeyboardButton>();
      state.keyboard.forEach((item) => {
        map.set(item.xIndex + "," + item.yIndex, item);
      });
      return map;
    },
    keyboardKey: (state) => {
      return state.keyboard
        .map((item) => {
          return (
            item.name +
            "_" +
            item.height +
            "_" +
            item.leftBottom.x +
            "_" +
            item.leftBottom.y +
            "_" +
            item.rightTop.x +
            "_" +
            item.rightTop.y
          );
        })
        .join("+");
    },
  },
  actions: {
    pushDefault() {
      this.keyboard = defaultPosition();
    },
  },
});
