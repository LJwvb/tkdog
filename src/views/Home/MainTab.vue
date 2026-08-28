<template>
  <div class="index">
    <div
      v-loading="loading"
      class="index-left"
      element-loading-text="加载中..."
    >
      <el-tabs
        v-model="currentTab"
        type="card"
        class="el-table"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in subjectIDList"
          :key="item.subjectID"
          :label="item.subjectName"
          :name="item.subjectID"
        >
          <SubTab
            :questionList="questionList"
            :catalogIDList="catalogIDList"
            :catalogID="Number(catalogID)"
            :subjectID="Number(subjectID)"
            :itemSubjectID="Number(item?.subjectID)"
            :currentPage="currentPage"
            :total="total"
            type="home"
            @tabClick="tabClick"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import SubTab from '@/components/SubTab/index.vue';
import { getQuestionList } from '@/services';
import queryString from 'query-string';
import { parseHashQuery } from '@/utils';
import type { IQuestion, IGetQuestionsParams } from '@/types';

const { subjectID, catalogID } = parseHashQuery();
const loading = ref(true);

const questionList = ref<IQuestion[]>();
const subjectIDList = ref<Array<{ subjectID?: number; subjectName?: string }>>(
  [],
);
const catalogIDList = ref<Array<{ catalogID?: number; catalogName?: string }>>(
  [],
);
const currentPage = ref(1);
const total = ref(0);

// 选中的主标签页
const currentTab = ref<number>(Number(subjectID) || 0);
// 选中的子标签页
const currentSubTab = ref<number>(Number(catalogID) || 0);
// 获取题目列表
const getQuestionListData = async (params: IGetQuestionsParams) => {
  const res = await getQuestionList(params);
  questionList.value = res.result;
  subjectIDList.value =
    res.subjectNameList as unknown as typeof subjectIDList.value;
  catalogIDList.value =
    res.catalogNameList as unknown as typeof catalogIDList.value;
  loading.value = false;
};
const handleClick = (tab: { props: { name?: string | number } }) => {
  currentTab.value = Number(tab.props.name) || 0;
  currentSubTab.value = 0;
};

const tabClick = (val: number) => {
  currentSubTab.value = val;
};

watchEffect(() => {
  const params = {
    type: 'home',
    subjectID: currentTab.value,
    catalogID: currentSubTab.value,
    currentPage: currentPage.value,
    pageSize: 3,
  };
  loading.value = true;
  getQuestionListData(params);
});
</script>
<style scoped>
.el-table {
  background-color: #fff;
  padding: 20px;
  box-shadow: var(--el-box-shadow-light);
  border-radius: 5px;
  border: 1px solid var(--el-card-border-color);
  min-height: 400px;
}
.index-left {
  width: 100%;
}
:deep(.el-tabs__content) {
  overflow: visible !important;
}
:deep(.el-tabs--card > .el-tabs__header) {
  border-bottom: none !important;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border-radius: 5px !important;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  border: 1px solid var(--el-color-primary) !important;
  border-radius: 5px;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: 1px solid var(--el-border-color-light) !important;
}
</style>
