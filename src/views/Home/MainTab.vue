<template>
  <div class="index">
    <div class="index-left">
      <el-tabs v-model="currentTab" type="card" class="el-table">
        <el-tab-pane
          v-for="item in questionList"
          :key="item.subject.subjectID"
          :label="item.subject.subjectName"
          :name="item.subject.subjectID"
        >
          <SubTab
            :questionList="item.catalogList"
            :catalogID="Number(catalogID)"
            :subjectID="Number(subjectID)"
            :itemSubjectID="item.subject.subjectID"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import SubTab from '@/components/SubTab/index.vue';
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
