<template>
  <div class="top-container">
    <el-card>
      <el-form ref="from" :model="form">
        <el-form-item label="搜索">
          <el-input
            v-model="form.keyword"
            placeholder="请输入搜索的内容"
            class="search"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="难度">
          <el-radio-group v-model="form.difficulty">
            <el-radio-button label="0"> 简单 </el-radio-button>
            <el-radio-button label="1"> 中等</el-radio-button>
            <el-radio-button label="2"> 困难 </el-radio-button>
            <el-radio-button label="3"> 未知 </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题型">
          <el-radio-group v-model="form.questionType">
            <el-radio-button label="0"> 单选题 </el-radio-button>
            <el-radio-button label="1"> 多选题 </el-radio-button>
            <el-radio-button label="2"> 判断题 </el-radio-button>
            <el-radio-button label="3"> 简答题 </el-radio-button>
            <el-radio-button label="4"> 未知 </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="科目">
          <el-select
            v-model="form.subjectID"
            placeholder="全部科目"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="s in subjectIDList"
              :key="s.subjectID"
              :label="s.content"
              :value="String(s.subjectID)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input
            v-model="form.tags"
            placeholder="按标签搜索，如 Vue"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <div class="search-actions">
          <el-button type="primary" @click="onSubmit">搜索</el-button>

          <el-button @click="clearSearch">清空</el-button>

          <el-button type="success" @click="startRandomPractice">
            随机练习
          </el-button>
        </div>
      </el-form>
    </el-card>
    <el-card
      v-loading="loading"
      class="question-card-container"
      style="min-height: 500px"
      element-loading-text="加载中..."
    >
      <!-- 全部题目列表：使用 SubTab + 虚拟列表 -->
      <SubTab
        v-if="!clickSearch"
        :questionList="allQuestion"
        type="all"
        :catalogID="Number(catalogID)"
        :subjectID="Number(subjectID)"
        :subjectIDList="subjectIDList"
        :total="total"
        :loadingMore="loadingMore"
        :noMore="noMore"
        :listHeight="650"
        @tabClick="tabClick"
        @loadMore="loadMoreAllQuestion"
      />
      <!-- 搜索结果列表：使用虚拟列表 -->
      <div v-if="clickSearch">
        <div v-if="searchData?.length === 0">
          <el-icon
            size="35"
            color="#aaa"
            style="float: right"
            @click="clearSearch"
          >
            <CircleClose />
          </el-icon>
          <el-empty :image-size="200" />
        </div>
        <VirtualList
          v-else
          :data="searchData"
          :height="650"
          :estimated-item-height="200"
          :loading="searchLoadingMore"
          :finished="searchNoMore"
          @loadMore="loadMoreSearch"
        >
          <template #default="{ item }">
            <QuestionCard :question="item" type="all" :isClickSearch="true" />
          </template>
        </VirtualList>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { parseHashQuery } from '@/utils';
import {
  searchQuestion,
  getQuestionList,
  getSubjectList,
  randomPickQuestions,
  getPaperQuestion,
} from '@/services';
import SubTab from '@/components/SubTab/index.vue';
import QuestionCard from '@/components/QuestionCard/index.vue';
import VirtualList from '@/components/VirtualList/index.vue';
import { CircleClose } from '@element-plus/icons-vue';
import { PaperPurview } from '@/types';
interface IGetAllQuestionParams {
  type: string;
  currentPage: number;
  pageSize: number;
  catalogID?: number;
  subjectID?: number;
  refresh?: boolean;
}

interface IForm {
  keyword: string;
  questionType: string;
  difficulty: string;
  subjectID: string;
  tags: string;
}
const { isClickSearch, catalogID, subjectID } = parseHashQuery();
const from = ref();
const allQuestion = ref<any[]>([]);
const searchData = ref<any[]>([]);
const clickSearch = ref(false);
const loading = ref(true);
const loadingMore = ref(false);
const noMore = ref(false);
const searchLoadingMore = ref(false);
const searchNoMore = ref(false);
const store = useStore();
const router = useRouter();
const currentPage = ref(1);
const currentSearchPage = ref(store.state.searchHistory?.currentPage || 1);
const total = ref(0);
const searchTotal = ref(0);
const subjectIDList = ref();
const searchPaginationClick = ref(false);
const pageSize = 10;

// 每个科目的数据缓存，切换 tab 时不重新请求
interface ISubjectCache {
  list: any[];
  page: number;
  total: number;
  noMore: boolean;
}
const subjectCache = ref<Map<number, ISubjectCache>>(new Map());

const form = reactive<IForm>({
  keyword: '',
  questionType: '',
  difficulty: '',
  subjectID: '',
  tags: '',
});
// subjectID 初始化时已确定（缺省为 0，即"全部"），这里在类型上收窄为必填，
// 避免作为 subjectCache 的 Map key 时被推断成 number | undefined
const getAllQuestionParams = reactive<
  IGetAllQuestionParams & { subjectID: number }
>({
  type: 'all',
  currentPage: 1,
  pageSize,
  subjectID: Number(subjectID) || 0,
  refresh: false,
});
const onSubmit = () => {
  if (
    !form.keyword &&
    !form.questionType &&
    !form.difficulty &&
    !form.subjectID &&
    !form.tags
  ) {
    ElMessage.error('请至少输入一项搜索条件');
    return;
  }
  loading.value = true;
  currentSearchPage.value = 1;
  searchData.value = [];
  searchNoMore.value = false;
  getSearchData({ currentPage: 1 });
  store.commit('setSearchHistory', {
    ...form,
    currentPage: 1,
  });
};
const getAllQuestion = (refresh?: boolean) => {
  if (refresh) {
    getAllQuestionParams.refresh = true;
  }
  loading.value = true;
  currentPage.value = 1;
  noMore.value = false;
  getQuestionList(getAllQuestionParams).then((res) => {
    allQuestion.value = res?.result || [];
    total.value = res?.total || 0;
    noMore.value = allQuestion.value.length >= total.value;
    clickSearch.value = false;
    loading.value = false;
    // 存入缓存
    subjectCache.value.set(getAllQuestionParams.subjectID, {
      list: [...allQuestion.value],
      page: currentPage.value,
      total: total.value,
      noMore: noMore.value,
    });
  });
};

// 加载更多全部题目
const loadMoreAllQuestion = async () => {
  if (loadingMore.value || noMore.value) return;
  loadingMore.value = true;
  currentPage.value += 1;
  const params = {
    ...getAllQuestionParams,
    currentPage: currentPage.value,
  };
  try {
    const res = await getQuestionList(params);
    if (res?.result?.length) {
      allQuestion.value = [...allQuestion.value, ...res.result];
    }
    total.value = res?.total || total.value;
    noMore.value = allQuestion.value.length >= total.value;
    // 更新缓存
    subjectCache.value.set(getAllQuestionParams.subjectID, {
      list: [...allQuestion.value],
      page: currentPage.value,
      total: total.value,
      noMore: noMore.value,
    });
  } catch (e) {
    currentPage.value -= 1;
  } finally {
    loadingMore.value = false;
  }
};

const getSearchData = (val?: { currentPage: number }) => {
  searchQuestion({
    ...form,
    currentPage: val ? val.currentPage : currentSearchPage.value,
    pageSize,
  }).then((res) => {
    searchData.value = res?.result || [];
    searchTotal.value = res?.total || 0;
    searchNoMore.value = searchData.value.length >= searchTotal.value;
    clickSearch.value = true;
    loading.value = false;
  });
};

// 加载更多搜索结果
const loadMoreSearch = async () => {
  if (searchLoadingMore.value || searchNoMore.value) return;
  searchLoadingMore.value = true;
  currentSearchPage.value += 1;
  try {
    const res = await searchQuestion({
      ...form,
      currentPage: currentSearchPage.value,
      pageSize,
    });
    if (res?.result?.length) {
      searchData.value = [...searchData.value, ...res.result];
    }
    searchTotal.value = res?.total || searchTotal.value;
    searchNoMore.value = searchData.value.length >= searchTotal.value;
  } catch (e) {
    currentSearchPage.value -= 1;
  } finally {
    searchLoadingMore.value = false;
  }
};

const tabClick = (type: string) => {
  const targetSubjectID = Number(type);
  // 先保存当前科目的缓存
  if (allQuestion.value.length > 0) {
    subjectCache.value.set(getAllQuestionParams.subjectID, {
      list: [...allQuestion.value],
      page: currentPage.value,
      total: total.value,
      noMore: noMore.value,
    });
  }

  // 检查目标科目是否有缓存
  const cached = subjectCache.value.get(targetSubjectID);
  if (cached && cached.list.length > 0) {
    // 有缓存，直接恢复，不重新请求
    getAllQuestionParams.subjectID = targetSubjectID;
    allQuestion.value = cached.list;
    currentPage.value = cached.page;
    total.value = cached.total;
    noMore.value = cached.noMore;
    loading.value = false;
  } else {
    // 没有缓存，重新请求
    loading.value = true;
    getAllQuestionParams.subjectID = targetSubjectID;
    getAllQuestionParams.currentPage = 1;
    currentPage.value = 1;
    allQuestion.value = [];
    noMore.value = false;
    getAllQuestion();
  }
};

const clearSearch = () => {
  form.keyword = '';
  form.questionType = '';
  form.difficulty = '';
  form.subjectID = '';
  form.tags = '';
  clickSearch.value = false;
  store.commit('setSearchHistory', '');
};

// 随机练习：随机抽题生成一张练习卷并进入在线做题
const startRandomPractice = async () => {
  const res = await randomPickQuestions({
    counts: { single: 3, multiple: 2, judge: 2, essay: 3 },
  });
  if (!res?.length) {
    ElMessage.warning('暂无可用题目');
    return;
  }
  const ids = res.map((q) => q.id).join(',');
  const paper = await getPaperQuestion({
    ids,
    paperTitle: `随机练习-${Date.now()}`,
    paperTags: '',
    purview: PaperPurview.Private,
    author: store.state.userData.username,
    isPractice: true,
  });
  router.push({
    path: '/testPaper/doPaper',
    query: { paperID: paper.paperId },
  });
};
onMounted(() => {
  if (!clickSearch.value) {
    getAllQuestion();
    getSubjectList().then((res) => {
      subjectIDList.value = res;
    });
    return;
  }
});
watchEffect(() => {
  if (
    isClickSearch === 'true' &&
    store.state.searchHistory &&
    !searchPaginationClick.value
  ) {
    clickSearch.value = true;
    searchPaginationClick.value = false;
    const searchHistory = store.state.searchHistory;
    form.keyword = searchHistory.keyword;
    form.questionType = searchHistory.questionType;
    form.difficulty = searchHistory.difficulty;
    currentSearchPage.value = searchHistory.currentPage;
    searchData.value = [];
    searchNoMore.value = false;
    searchQuestion({
      ...searchHistory,
      currentPage: searchHistory.currentPage,
      pageSize,
    }).then((res) => {
      searchData.value = res?.result || [];
      searchTotal.value = res?.total || 0;
      searchNoMore.value = searchData.value.length >= searchTotal.value;
      clickSearch.value = true;
      currentSearchPage.value = searchHistory.currentPage;
      loading.value = false;
    });
    return;
  }
});

watch(
  () => clickSearch.value,
  () => {
    if (!clickSearch.value) {
      getAllQuestion();
      getSubjectList().then((res) => {
        subjectIDList.value = res;
      });
    }
  },
);
</script>
<style scoped>
.top-container {
  width: 100%;
}

.top-container :deep(.el-form-item) {
  margin-bottom: 16px;
}

.top-container :deep(.el-form-item__label) {
  width: 42px !important;
  text-align: left;
  padding-right: 12px;
  font-weight: 500;
  color: #606266;
}

.search {
  max-width: 500px;
}

.filter-actions {
  display: flex;
  gap: 10px;

  padding-left: 12px;
}

.question-card-container {
  margin-top: 16px !important;
}

/* 搜索按钮间距 + 与输入框左边缘对齐 */
.search-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

/* 搜索按钮内边距优化 */
.search-actions .el-button {
  padding-left: 20px;
  padding-right: 20px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .question-card-container :deep(.virtual-list-container) {
    height: 500px !important;
  }

  .top-container :deep(.el-form-item) {
    margin-bottom: 10px;
  }

  .search {
    max-width: 100%;
  }
}
</style>
