<template>
  <div class="top-container">
    <el-card>
      <el-form :model="form" ref="from">
        <el-form-item label="搜索">
          <el-input
            placeholder="请输入搜索的内容"
            class="search"
            v-model="form.keyword"
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
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button @click="clearSearch">清空</el-button>
      </el-form>
    </el-card>
    <el-card
      style="margin-top: 20px; min-height: 500px"
      v-loading="loading"
      element-loading-text="Loading..."
    >
      <SubTab
        :questionList="allQuestion"
        type="all"
        @tabClick="tabClick"
        :catalogID="Number(catalogID)"
        :subjectID="Number(subjectID)"
        :currentPage="currentPage"
        :subjectIDList="subjectIDList"
        :total="total"
        @handleCurrentChange="handleCurrentChange"
        v-if="!clickSearch"
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
            hide-on-single-page="true"
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
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import queryString from 'query-string';
import { searchQuestion, getQuestionList, getSubjectList } from '@/services';
import SubTab from '@/components/SubTab/index.vue';
import QuestionCard from '@/components/QuestionCard/index.vue';
interface IGetAllQuestionParams {
  type: string;
  currentPage: number;
  pageSize: number;
  catalogID?: any;
  subjectID?: any;
  refresh?: boolean;
}

interface IForm {
  keyword: string;
  questionType: string;
  difficulty: string;
}
interface ISearchQuestionParams extends IForm {
  currentPage: number;
  pageSize: number;
}
const { isClickSearch, catalogID, subjectID } = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);
const from = ref();
const allQuestion = ref();
const searchData = ref();
const clickSearch = ref(false);
const loading = ref(true);
const store = useStore();
const currentPage = ref(1);
const currentSearchPage = ref(1);
const total = ref(0);
const searchTotal = ref(0);
const subjectIDList = ref();

const form = reactive<IForm>({
  keyword: '',
  questionType: '',
  difficulty: '',
});
const getAllQuestionParams = reactive<IGetAllQuestionParams>({
  type: 'all',
  currentPage: 1,
  pageSize: 10,
  // catalogID: catalogID || 0,
  subjectID: Number(subjectID) || 0,
  refresh: false,
});
const getSearchDataParams = reactive<ISearchQuestionParams>({
  keyword: '',
  questionType: '',
  difficulty: '',
  currentPage: 1,
  pageSize: 10,
});

const onSubmit = () => {
  if (!form.keyword && !form.questionType && !form.difficulty) {
    ElMessage.error('请至少输入一项搜索条件');
    return;
  }
  loading.value = true;
  getSearchData({ currentPage: 1 });
  store.commit('setSearchHistory', form);
};
const getAllQuestion = (refresh?: boolean) => {
  if (refresh) {
    getAllQuestionParams.refresh = true;
  }
  getQuestionList(getAllQuestionParams as any).then((res) => {
    allQuestion.value = res?.result;
    total.value = res?.total;
    clickSearch.value = false;
  });
  loading.value = false;
};
const getSearchData = (val?: { currentPage: number }) => {
  searchQuestion({
    ...form,
    currentPage: val ? val.currentPage : currentSearchPage.value,
    pageSize: 10,
  }).then((res) => {
    searchData.value = res.data?.result;
    searchTotal.value = res.data?.total;
    clickSearch.value = true;
    loading.value = false;
  });
};

const tabClick = (type: string) => {
  loading.value = true;
  getAllQuestionParams.subjectID = type;
  getAllQuestionParams.currentPage = 1;
  currentPage.value = 1;
};

const clearSearch = () => {
  form.keyword = '';
  form.questionType = '';
  form.difficulty = '';
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
  getSearchDataParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getSearchData();
};
onMounted(() => {
  getAllQuestion();
  getSubjectList().then((res) => {
    subjectIDList.value = res.data;
  });
});
watchEffect(() => {
  if (isClickSearch === 'true' && store.state.searchHistory) {
    clickSearch.value = true;
    const searchHistory = store.state.searchHistory;
    form.keyword = searchHistory.keyword;
    form.questionType = searchHistory.questionType;
    form.difficulty = searchHistory.difficulty;
    searchQuestion(searchHistory).then((res) => {
      searchData.value = res.data;
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
</script>
<style scoped>
.top-container {
  width: 100%;
  height: 100%;
}
</style>
