import { defineStore } from "pinia";

export interface RecordData {
  timestamp: number;
  x1: number;
  y1: number;
  z1: number;
  x2: number;
  y2: number;
  z2: number;
  x3: number;
  y3: number;
  z3: number;
  x4: number;
  y4: number;
  z4: number;
  label: string;
}

export const useRecordStore = defineStore("record", {
  state: () => ({
    data: <RecordData[]>[],
  }),
  actions: {
    clear() {
      this.data.splice(0, this.data.length);
    },
  },
});
