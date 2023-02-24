<template>
  <el-tabs v-model="active" class="tabs">
    <el-tab-pane
      v-for="(typeItem, index) in props.questionList"
      :key="typeItem.catalog.catalogID"
      :label="typeItem.catalog.catalogName"
      :name="index"
    >
      <div v-for="item in typeItem.questionList" :key="item?.id">
        <QuestionCard :question="item" />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { defineProps, watchEffect } from 'vue';

import QuestionCard from '@/components/QuestionCard/index.vue';
import { isNaN } from '@/utils';

import { ref } from 'vue';
// 接收父组件传递的数据
const props = defineProps({
  questionList: {
    type: Array as any,
    default: () => [],
  },
  catalogID: {
    type: Number,
    default: 0,
  },
  subjectID: {
    type: Number,
    default: 0,
  },
  itemSubjectID: {
    type: Number,
    default: 0,
  },
});
// 默认选中的子标签
const active = ref<any>(0);
watchEffect(() => {
  if (props.itemSubjectID === props.subjectID) {
    active.value = isNaN(props.catalogID)
      ? 0
      : props.questionList.findIndex(
          (item: any) => item.catalog.catalogID === props.catalogID,
        );
  }
});
</script>
<style scoped></style>
