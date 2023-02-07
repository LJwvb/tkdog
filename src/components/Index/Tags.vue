<template>
  <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
    <el-tab-pane
      v-for="typeItem in type"
      :key="typeItem"
      :label="typeItem"
      :name="typeItem"
    >
      <div v-for="item in nums" :key="item">
        <QuestionCard :content="typeItem" />
      </div>
    </el-tab-pane>
  </el-tabs>

  {{ props.content }}
</template>
<script lang="ts" setup>
// 接收父组件传递的数据
import { defineProps } from 'vue';

import QuestionCard from '@/components/QuestionCard/index.vue';

import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';
const type = ['最热', '最新', '精选'];
const nums = [1, 2, 3];

const activeName = ref('最热');
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
});
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>
<style scoped>
.tabs {
  margin-bottom: 20px;
}
</style>
