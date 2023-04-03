<template>
  <q-table style="flex-grow: 1; width: 100%" :rows="tableData" :columns="tableColumns" row-key="timestamp"
    :pagination="pageable" :virtual-scroll-throttle="scrollThrottle" :virtual-scroll-item-size="scrollItemHeight"
    :virtual-scroll-sticky-size="scrollStickySize" :virtual-scroll-render-slice-size="scrollRenderSliceSize"
    :virtual-scroll-render-slice-threshold="scrollRenderSliceThreshold">
    <template v-slot:body-cell-timestamp="props">
      <q-td :props="props">
        <div :class="{ active: Math.abs(props.row.timestamp / 1000 - replayTime) < 0.15 }">
          {{ props.row.timestamp / 1000 }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-label="props">
      <q-td :props="props">
        <q-input filled dense v-model="props.row.label" maxlength="1" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { useRecordStore, RecordData } from "src/stores/record";
import { computed, ref } from "vue";

const scrollThrottle = 16;
const scrollItemHeight = 50;
const scrollStickySize = 50;
const scrollRenderSliceSize = 16;
const scrollRenderSliceThreshold = 1;
const pageable = {
  rowsPerPage: 7,
  rowsPerPageOptions: [7, 14, 21, 48, 60],
};
const store = useRecordStore();
const data = computed(() => store.data);
const props = defineProps<{
  displayAll: boolean;
  replayTime: number;
}>();

const tableData = computed(() => {
  if (!props.displayAll) {
    // 根据时间戳排序，取离当前 replayTime 最近的一条数据，与前后三条数据
    const sortedData = data.value.sort((a, b) => a.timestamp - b.timestamp);

    // 找到最接近 replayTime 的数据项所在的索引
    let index = 0;
    for (let i = 0; i < sortedData.length; i++) {
      if (sortedData[i].timestamp <= props.replayTime * 1000) {
        index = i;
      } else {
        break;
      }
    }

    // 取出最接近 replayTime 的一条数据项
    const result = [sortedData[index]];

    // 获取前后三条数据，并将它们加入结果数组result中
    for (let i = index - 3; i <= index + 3; i++) {
      if (i < index && i >= 0) {
        result.unshift(sortedData[i]);
      } else if (i > index && i < sortedData.length) {
        result.push(sortedData[i]);
      }
    }

    // 返回结果数组
    return result.sort((a, b) => a.timestamp - b.timestamp);
  }

  return data.value;
});
const tableColumns = [
  { name: "timestamp", label: "时间戳", field: "timestamp", width: 100, sortable: true },
  { name: "x1", label: "X1", field: "x1", width: 100, sortable: false },
  { name: "y1", label: "Y1", field: "y1", width: 100, sortable: false },
  { name: "z1", label: "Z1", field: "z1", width: 100, sortable: false },
  { name: "x2", label: "X2", field: "x2", width: 100, sortable: false },
  { name: "y2", label: "Y2", field: "y2", width: 100, sortable: false },
  { name: "z2", label: "Z2", field: "z2", width: 100, sortable: false },
  { name: "x3", label: "X3", field: "x3", width: 100, sortable: false },
  { name: "y3", label: "Y3", field: "y3", width: 100, sortable: false },
  { name: "z3", label: "Z3", field: "z3", width: 100, sortable: false },
  { name: "x4", label: "X4", field: "x4", width: 100, sortable: false },
  { name: "y4", label: "Y4", field: "y4", width: 100, sortable: false },
  { name: "z4", label: "Z4", field: "z4", width: 100, sortable: false },
  { name: "label", label: "标记", field: "label", width: 120, sortable: false },
];
</script>

<style lang="sass">
thead tr:first-child th:first-child, thead tr:last-child th:last-child
  /* bg color is important for th; just specify one */
  background-color: #fff

td:first-child, td:last-child
  background-color: #f5f5dc

th:first-child,
td:first-child
  position: sticky !important
  left: 0
  z-index: 1

th:last-child,
td:last-child
  position: sticky !important
  right: 0
  z-index: 1
td:last-child
  padding: 0 12px
td .active
  background-color: orange
  color: white

// 第四个边框加粗
// tr:nth-child(4n)
//   background-color: orange
</style>
