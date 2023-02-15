<template>
  <div class="tabs">
    <el-row :gutter="24">
      <el-col :span="17">
        <div class="grid-content">
          <el-tabs v-model="currentTab" type="card" @tab-click="handleClick" class="el-table">
            <el-tab-pane v-for="item in data" :key="item.subjectID" :label="item.title" :name="item.subjectID">
              <Tags :questionList="questionList" @currentSubTab="clickSubTab" :loading="loading"
                :isChangeTab="isChangeTab" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { getQuestionList } from '@/services';
import type { IGetQuestionsParams } from '@/types';
import Tags from './Tags.vue';
const loading = ref(true);
//是否切换主标签页
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
const currentTab = ref(0);
//传参
const params: IGetQuestionsParams = {
  currentPage: 0,
  pageSize: 3,
  subjectID: 0,
  catalogID: 0,
};
//题目列表
const getQuestionListData = async () => {
  const res = await getQuestionList(params);
  questionList.value = res.result;
  loading.value=false;
};
//初始化
getQuestionListData();
// 切换子标签页
const clickSubTab = (val: any) => {
  isChangeTab=false;
  params.catalogID = val;
  getQuestionListData();
};
//切换主标签
const handleClick = (tab: any) => {
  isChangeTab=true;
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

.el-col-17 {
  max-width: 100%;
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
