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
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button @click="clearSearch">清空</el-button>
        <el-button type="success" @click="startRandomPractice">
          随机练习
        </el-button>
      </el-form>
    </el-card>
    <el-card
      v-loading="loading"
      style="margin-top: 20px; min-height: 500px"
      element-loading-text="加载中..."
    >
      <SubTab
        v-if="!clickSearch"
        :questionList="allQuestion"
        type="all"
        :catalogID="Number(catalogID)"
        :subjectID="Number(subjectID)"
        :currentPage="currentPage"
        :subjectIDList="subjectIDList"
        :total="total"
        @tabClick="tabClick"
        @handleCurrentChange="handleCurrentChange"
      />
      <div v-if="clickSearch">
        <div v-if="searchData?.length === 0">
          <el-icon
            size="35"
            color="#aaa"
            style="float: right"
            @click="clearSearch"
            ><CircleClose
          /></el-icon>
          <el-empty :image-size="200" />
        </div>
        <div v-else>
          <div v-for="item in searchData" :key="item.id">
            <QuestionCard :question="item" type="all" :isClickSearch="true" />
          </div>
          <el-pagination
            v-model:current-page="currentSearchPage"
            background
            layout="slot, prev, pager, next"
            :total="searchTotal"
            prev-text="上一页"
            next-text="下一页"
            :hide-on-single-page="true"
            @current-change="handleSearchCurrentChange"
          >
            <template #default> 共 {{ searchTotal }} 条 </template>
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import queryString from 'query-string';
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
const allQuestion = ref();
const searchData = ref();
const clickSearch = ref(false);
const loading = ref(true);
const store = useStore();
const router = useRouter();
const currentPage = ref(1);
const currentSearchPage = ref(store.state.searchHistory?.currentPage || 1);
const total = ref(0);
const searchTotal = ref(0);
const subjectIDList = ref();
const searchPaginationClick = ref(false);

const form = reactive<IForm>({
  keyword: '',
  questionType: '',
  difficulty: '',
  subjectID: '',
  tags: '',
});
const getAllQuestionParams = reactive<IGetAllQuestionParams>({
  type: 'all',
  currentPage: 1,
  pageSize: 10,
  // catalogID: catalogID || 0,
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
  getQuestionList(getAllQuestionParams).then((res) => {
    allQuestion.value = res?.result;
    total.value = res?.total;
    clickSearch.value = false;
    loading.value = false;
  });
};
const getSearchData = (val?: { currentPage: number }) => {
  searchQuestion({
    ...form,
    currentPage: val ? val.currentPage : currentSearchPage.value,
    pageSize: 10,
  }).then((res) => {
    searchData.value = res?.result;
    searchTotal.value = res?.total;
    clickSearch.value = true;
    loading.value = false;
  });
};

const tabClick = (type: string) => {
  loading.value = true;
  getAllQuestionParams.subjectID = Number(type);
  getAllQuestionParams.currentPage = 1;
  currentPage.value = 1;
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

const handleCurrentChange = (val: number) => {
  getAllQuestionParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getAllQuestion();
};
const handleSearchCurrentChange = (val: number) => {
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  searchPaginationClick.value = true;
  getSearchData({
    currentPage: val,
  });
  store.commit('setSearchHistory', {
    ...form,
    currentPage: val,
  });
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
    searchQuestion({
      ...searchHistory,
      currentPage: searchHistory.currentPage,
      pageSize: 10,
    }).then((res) => {
      searchData.value = res?.result;
      searchTotal.value = res?.total;
      clickSearch.value = true;
      currentSearchPage.value = searchHistory.currentPage;
      loading.value = false;
    });
    return;
  }
});

watch(
  () => getAllQuestionParams.subjectID,
  () => {
    getAllQuestion();
  },
);
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
  height: 100%;
}
</style>
