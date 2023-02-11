<template>
  <div class="index">
    <div class="index-left">
      <el-tabs
        v-model="currentTab"
        type="card"
        @tab-click="handleClick"
        class="el-table"
      >
        <el-tab-pane
          v-for="item in data"
          :key="item.subjectID"
          :label="item.title"
          :name="item.subjectID"
        >
          <SubTab
            :questionList="questionList"
            @currentSubTab="clickSubTab"
            :loading="loading"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import SubTab from './subTab.vue';
import { getQuestionList } from '@/services';
import type { IGetQuestionsParams } from '@/types';
const loading = ref(true);

const data = [
  {
    title: 'javaScript',
    name: 'first',
    content: 'javaScript',
    subjectID: 0,
  },
  {
    title: 'CSS',
    name: 'second',
    content: 'CSS',
    subjectID: 1,
  },
  {
    title: 'HTML',
    name: 'third',
    content: 'HTML',
    subjectID: 2,
  },
  {
    title: 'ES6',
    name: 'fourth',
    content: 'ES6',
    subjectID: 3,
  },
  {
    title: 'React',
    name: 'fifth',
    content: 'React',
    subjectID: 4,
  },
  {
    title: 'Vue',
    name: 'sixth',
    content: 'Vue',
    subjectID: 5,
  },
  {
    title: 'Node',
    name: 'seventh',
    content: 'Node',
    subjectID: 6,
  },
  {
    title: 'webpack',
    name: 'eighth',
    content: 'webpack',
    subjectID: 7,
  },
  {
    title: 'TypeScript',
    name: 'ninth',
    content: 'TypeScript',
    subjectID: 8,
  },
  {
    title: '编程题',
    name: 'tenth',
    content: '编程题',
    subjectID: 9,
  },
  {
    title: '计算机基础',
    name: 'eleventh',
    content: '计算机基础',
    subjectID: 10,
  },
  {
    title: '计算机网络',
    name: 'twelfth',
    content: '计算机网络',
    subjectID: 11,
  },
];
const questionList = ref();
// 选中的主标签页
const currentTab = ref(0);
// 传参
const params: IGetQuestionsParams = {
  currentPage: 0,
  pageSize: 3,
  subjectID: 0,
  catalogID: 0,
};
// 获取题目列表
const getQuestionListData = async () => {
  const res = await getQuestionList(params);
  questionList.value = res.result;
  loading.value = false;
};
// 初始化
getQuestionListData();

// 切换子标签页
const clickSubTab = (val: any) => {
  params.catalogID = val;
  getQuestionListData();
};
// 切换主标签页
const handleClick = (tab: any) => {
  params.subjectID = tab.props.name;
  params.catalogID = 0;
  getQuestionListData();
};
</script>
<style scoped>
.el-table {
  background-color: #fff;
  padding: 20px;
  box-shadow: var(--el-box-shadow-light);
  border-radius: 5px;
  border: 1px solid var(--el-card-border-color);
}
:global(.el-tabs__content) {
  overflow: visible !important;
}
:global(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border-radius: 5px !important;
}
:global(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  border: 1px solid var(--el-color-primary) !important;
  border-radius: 5px;
}
</style>
