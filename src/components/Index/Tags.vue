<template>
  <el-tabs v-model="active" class="tabs" @tab-click="handleClick">
    <el-tab-pane
      v-for="typeItem in types"
      :key="typeItem.id"
      :label="typeItem.name"
      :name="typeItem.id"
    >
      <div v-for="item in nums" :key="item">
        <QuestionCard :content="''" />
      </div>
    </el-tab-pane>
  </el-tabs>
  {{ props.questionList }}
</template>
<script lang="ts" setup>
import { defineProps, reactive } from 'vue';

import QuestionCard from '@/components/QuestionCard/index.vue';

import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';
// 默认选中的子标签
const active = ref(0);

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
const nums = [1, 2, 3];
// 接收父组件传递的数据
const props = defineProps({
  questionList: {
    type: Array,
    default: () => [],
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
