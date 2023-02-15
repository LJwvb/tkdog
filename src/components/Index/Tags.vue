<template>
  <el-tabs v-model="active" class="tabs" @tab-click="handleClick">
    <el-tab-pane v-for="typeItem in types" :key="typeItem.id" :label="typeItem.name" :name="typeItem.id">
      <!-- <div v-for="item in nums" :key="item">
        <QuestionCard :content="typeItem" />
      </div> -->
      <el-skeleton :loading="props.loading" animated :rows="40" style="width: 100%; height: 600px">
        <el-empty description="暂时没有题目啊！ 等你上传" v-if="isEmpty" />
        <div v-for="item in props.questionList" :key="item?.id">
          <QuestionCard :question="item" />
        </div>
      </el-skeleton>
    </el-tab-pane>
    <el-pagination background layout="prev, pager, next" :page-size="limit" :total="totalCount"
      :current-page="currentPage" @current-change="pageChange" />
  </el-tabs>
  <!-- {{ props.content }} -->
</template>
<script lang="ts" setup>
// 接收父组件传递的数据
import { defineProps, watchEffect } from 'vue';
import QuestionCard from '@/components/QuestionCard/index.vue';
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import type { IQuestion } from '@/types';
// 默认选中的子标签
const active = ref<any>(0);
const isEmpty = ref(false);

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
//接收父组件传递的数据
const props = defineProps({
  questionList: {
    type: Array as unknown as () => IQuestion[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: true,
  },
  isChangeTab: {
    type: Boolean,
    default: false,
  },
});
watchEffect(() => {
  if (props.isChangeTab) {
    active.value = 0;
  }
  if (props.questionList.length === 0) {
    isEmpty.value = true;
  } else {
    isEmpty.value = false;
  }
});

// 定义子组件向父组件传递数据的方法
const emit = defineEmits(['currentSubTab']);
// 子组件向父组件传递数据
const handleClick = (tab: TabsPaneContext) => {
  emit('currentSubTab', tab.props.name);
};

// 当前页
let currentPage = ref(1);
// 总条数
let totalCount = ref(20);
// 每页显示限制
let limit = ref(1);
const pageChange = (p: number) => {
  currentPage.value = p;
  console.log(p);

  // 发起接口请求数据 , 请求参数中使用 currentPage.value 作为查询当前页码
};

// const handleClick = (tab: TabsPaneContext, event: Event) => {
//   console.log(tab, event);
//   console.log(tab.props.name);
// };
</script>
<style>
.tabs {
  margin-bottom: 20px;
}
</style>
