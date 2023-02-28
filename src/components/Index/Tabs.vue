<template>
  <el-tabs v-model="currentTab" type="card" class="el-table">
    <el-tab-pane v-for="item in questionList" :key="item.subject.subjectID" :label="item.subject.subjectName"
      :name="item.subject.subjectID">
      <Tags :questionList="item.catalogList" :catalogID="Number(catalogID)" :subjectID="Number(subjectID)"
        :itemSubjectID="item.subject.subjectID" />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Tags from './Tags.vue';
import { getQuestionList } from '@/services';
import queryString from 'query-string';
import { isNaN } from '@/utils';

const { subjectID, catalogID } = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);
const loading = ref(true);

const questionList = ref();

// 选中的主标签页
const currentTab = ref(isNaN(Number(subjectID)) ? 0 : Number(subjectID));

// 获取题目列表
const getQuestionListData = async () => {
  if (questionList.value) return;
  const res = await getQuestionList({});
  questionList.value = res.result;
  loading.value = false;
};
// 初始化
getQuestionListData();
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
