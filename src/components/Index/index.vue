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
            :isChangeTab="isChangeTab"
            :catalogID="Number(catalogID)"
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
import queryString from 'query-string';
import { isNaN } from '@/utils';

import type { IGetQuestionsParams } from '@/types';
const { subjectID, catalogID } = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);
const loading = ref(true);
// 是否切换主标签页
let isChangeTab = false;

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
const currentTab = ref(isNaN(Number(subjectID)) ? 0 : Number(subjectID));

// 传参
const params: IGetQuestionsParams = {
  currentPage: 0,
  pageSize: 3,
  subjectID: Number(subjectID) || 0,
  catalogID: Number(catalogID) || 0,
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
  isChangeTab = false;
  params.catalogID = val;
  getQuestionListData();
};
// 切换主标签页
const handleClick = (tab: any) => {
  isChangeTab = true;
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
::v-deep.el-tabs__content {
  overflow: visible !important;
}
::v-deep.el-tabs--card > .el-tabs__header {
  border-bottom: none !important;
}
::v-deep.el-tabs--card > .el-tabs__header .el-tabs__nav {
  border-radius: 5px !important;
}
::v-deep.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border: 1px solid var(--el-color-primary) !important;
  border-radius: 5px;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  border-bottom: 1px solid var(--el-border-color-light) !important;
}
</style>
