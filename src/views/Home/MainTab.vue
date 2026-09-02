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
            :loadingMore="loadingMore"
            :noMore="noMore"
            :listHeight="'72.7vh'"
            type="home"
            @tabClick="tabClick"
            @loadMore="loadMore"
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
import { parseHashQuery } from '@/utils';
import type { IQuestion, IGetQuestionsParams } from '@/types';

const { subjectID, catalogID } = parseHashQuery();
const loading = ref(true);
const loadingMore = ref(false);
const noMore = ref(false);

const questionList = ref<IQuestion[]>([]);
const subjectIDList = ref<Array<{ subjectID?: number; subjectName?: string }>>(
  [],
);
const catalogIDList = ref<Array<{ catalogID?: number; catalogName?: string }>>(
  [],
);
const currentPage = ref(1);
const total = ref(0);
const pageSize = 10;

// 每个 tab 组合的数据缓存，key 为 `${subjectID}_${catalogID}`
interface ITabCache {
  list: IQuestion[];
  page: number;
  total: number;
  noMore: boolean;
}
const tabCache = ref<Map<string, ITabCache>>(new Map());
// 标记是否初始加载完成
const inited = ref(false);

// 选中的主标签页
const currentTab = ref<number>(Number(subjectID) || 0);
// 选中的子标签页
const currentSubTab = ref<number>(Number(catalogID) || 0);

// 获取题目列表
const getQuestionListData = async (
  params: IGetQuestionsParams,
  append = false,
) => {
  const res = await getQuestionList(params);
  if (append) {
    questionList.value = [...questionList.value, ...res.result];
  } else {
    questionList.value = res.result;
  }
  subjectIDList.value =
    res.subjectNameList as unknown as typeof subjectIDList.value;
  catalogIDList.value =
    res.catalogNameList as unknown as typeof catalogIDList.value;
  total.value = res.total || 0;
  noMore.value = questionList.value.length >= total.value;
  loading.value = false;
  loadingMore.value = false;

  // 存入缓存
  const cacheKey = `${params.subjectID}_${params.catalogID}`;
  tabCache.value.set(cacheKey, {
    list: [...questionList.value],
    page: currentPage.value,
    total: total.value,
    noMore: noMore.value,
  });
};

// 从缓存恢复数据
const restoreFromCache = (subjectID: number, catalogID: number): boolean => {
  const cacheKey = `${subjectID}_${catalogID}`;
  const cached = tabCache.value.get(cacheKey);
  if (cached && cached.list.length > 0) {
    questionList.value = cached.list;
    currentPage.value = cached.page;
    total.value = cached.total;
    noMore.value = cached.noMore;
    loading.value = false;
    return true;
  }
  return false;
};

// 保存当前数据到缓存
const saveToCache = () => {
  if (questionList.value.length > 0) {
    const cacheKey = `${currentTab.value}_${currentSubTab.value}`;
    tabCache.value.set(cacheKey, {
      list: [...questionList.value],
      page: currentPage.value,
      total: total.value,
      noMore: noMore.value,
    });
  }
};

const handleClick = (tab: { props: { name?: string | number } }) => {
  const newSubjectID = Number(tab.props.name) || 0;
  if (newSubjectID === currentTab.value) return;

  // 先保存当前缓存
  saveToCache();

  currentTab.value = newSubjectID;
  currentSubTab.value = 0;
  currentPage.value = 1;
  noMore.value = false;

  // 尝试从缓存恢复
  if (!restoreFromCache(newSubjectID, 0)) {
    // 没有缓存，重新请求
    loading.value = true;
    const params = {
      type: 'home',
      subjectID: newSubjectID,
      catalogID: 0,
      currentPage: 1,
      pageSize,
    };
    getQuestionListData(params);
  }
};

const tabClick = (val: number) => {
  if (val === currentSubTab.value) return;

  // 先保存当前缓存
  saveToCache();

  currentSubTab.value = val;
  currentPage.value = 1;
  noMore.value = false;

  // 尝试从缓存恢复
  if (!restoreFromCache(currentTab.value, val)) {
    // 没有缓存，重新请求
    loading.value = true;
    const params = {
      type: 'home',
      subjectID: currentTab.value,
      catalogID: val,
      currentPage: 1,
      pageSize,
    };
    getQuestionListData(params);
  }
};

// 加载更多
const loadMore = async () => {
  if (loadingMore.value || noMore.value) return;
  loadingMore.value = true;
  currentPage.value += 1;
  const params = {
    type: 'home',
    subjectID: currentTab.value,
    catalogID: currentSubTab.value,
    currentPage: currentPage.value,
    pageSize,
  };
  await getQuestionListData(params, true);
};

// 初始加载
watchEffect(() => {
  if (inited.value) return;
  const params = {
    type: 'home',
    subjectID: currentTab.value,
    catalogID: currentSubTab.value,
    currentPage: currentPage.value,
    pageSize,
  };
  loading.value = true;
  noMore.value = false;
  getQuestionListData(params).then(() => {
    inited.value = true;
  });
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
