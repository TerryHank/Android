import { defineStore } from "pinia";
import { Coordinate } from "src/components/models";
import { Scene } from "three";

export const useStore = defineStore("recPro", {
  state: () => ({
    buttonHeight: {
      high: 20,
      medium: 16,
      low: 12,
    },
    axisRate: {
      x: 1,
      y: 1,
      z: 1,
    },
    axisOffset: {
      x: 1,
      y: 1,
      z: 1,
    },
    axisRate2: {
      x: 1,
      y: 1,
      z: 1,
    },
    axisOffset2: {
      x: 1,
      y: 1,
      z: 1,
    },
    // 实时坐标
    realTimeCoordinate: <string[]>[],
    maxCoordinate: 10,
    updateCoordinate: true,
    scene: <Scene | null>null,
    minX: 0,
    maxX: 1000,
    minY: 0,
    maxY: 1000,
    threshold: 5,
    btnBounce: 4.5,
    content: "",
    playAudio: false,
    L1: 3,
    L2: 8,
    enableScene: 0,
    subBallReceiver: <Map<string, SubBallEvent>>new Map<string, SubBallEvent>(),
    ball: {
      size: 4,
      touchSize: 6,
      shadow: 2
    }
  }),
  getters: {
    getAxisRate: (state) => state.axisRate,
    getAxisOffset: (state) => state.axisOffset,
    getButtonHeight: (state) => state.buttonHeight,
    heightKey: (state) => {
      return (
        state.buttonHeight.high +
        "_" +
        state.buttonHeight.medium +
        "_" +
        state.buttonHeight.low
      );
    },
    totalKey: (state) => {
      return (
        state.axisRate.x +
        "_" +
        state.axisRate.y +
        "_" +
        state.axisRate.z +
        "_" +
        state.axisOffset.x +
        "_" +
        state.axisOffset.y +
        "_" +
        state.axisOffset.z +
        "_" +
        state.axisRate2.x +
        "_" +
        state.axisRate2.y +
        "_" +
        state.axisRate2.z +
        "_" +
        state.axisOffset2.x +
        "_" +
        state.axisOffset2.y +
        "_" +
        state.axisOffset2.z +
        "_" +
        state.buttonHeight.high +
        "_" +
        state.buttonHeight.medium +
        "_" +
        state.buttonHeight.low +
        "_" +
        state.minX +
        "_" +
        state.maxX +
        "_" +
        state.minY +
        "_" +
        state.maxY +
        "_" +
        state.threshold +
        "_" +
        state.btnBounce +
        "_" +
        state.L1 +
        "_" +
        state.L2 +
        "_" +
        state.ball.size +
        "_" +
        state.ball.touchSize +
        "_" +
        state.ball.shadow
      );
    },
  },
  actions: {
    pushRealTimeCoordinate (coordinate: string) {
      if (!this.updateCoordinate) return;
      this.realTimeCoordinate.unshift(coordinate);
      if (this.realTimeCoordinate.length >= this.maxCoordinate) {
        this.realTimeCoordinate.pop();
      }
    },
  },
});
