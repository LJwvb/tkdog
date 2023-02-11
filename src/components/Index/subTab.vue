<template>
  <el-tabs v-model="active" class="tabs" @tab-click="handleClick">
    <el-tab-pane
      v-for="typeItem in types"
      :key="typeItem.id"
      :label="typeItem.name"
      :name="typeItem.id"
    >
      <el-skeleton
        :loading="props.loading"
        animated
        :rows="40"
        style="width: 100%; height: 600px"
      >
        <div v-for="item in props.questionList" :key="item?.id">
          <QuestionCard :question="item" />
        </div>
      </el-skeleton>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';

import QuestionCard from '@/components/QuestionCard/index.vue';

import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import type { IQuestion } from '@/types';
// 默认选中的子标签
const active = ref<any>(0);

const types = [
  {
    name: '最热',
    id: 0,
  },
  {
    name: '最新',
    id: 1,
  },
  {
    name: '精选',
    id: 2,
  },
];
// 接收父组件传递的数据
const props = defineProps({
  questionList: {
    type: Array as unknown as () => IQuestion[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: true,
  },
});

// 定义子组件向父组件传递数据的方法
const emit = defineEmits(['currentSubTab']);
// 子组件向父组件传递数据
const handleClick = (tab: TabsPaneContext) => {
  emit('currentSubTab', tab.props.name);
};
</script>
<style scoped>
.tabs {
  margin-bottom: 20px;
}
</style>
