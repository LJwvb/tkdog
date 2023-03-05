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
    <el-card style="margin-top: 20px">
      <SubTab
        :questionList="allQuestion"
        type="all"
        @tabClick="tabClick"
        :catalogID="Number(catalogID)"
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
        <div v-else v-for="item in searchData" :key="item.id">
          <QuestionCard :question="item" type="all" :isClickSearch="true" />
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
import { searchQuestion, getQuestionList } from '@/services';
import SubTab from '@/components/Index/subTab.vue';
import QuestionCard from '@/components/QuestionCard/index.vue';
interface IGetAllQuestionParams {
  type: string;
  currentPage: number;
  pageSize: number;
  catalogID: string;
  refresh: boolean;
}
interface IForm {
  keyword: string;
  questionType: string;
  difficulty: string;
}
const { isClickSearch, catalogID } = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);
console.log('isClickSearch', isClickSearch);
const from = ref();
const allQuestion = ref();
const searchData = ref();
const clickSearch = ref(false);

const store = useStore();

const form = reactive<IForm>({
  keyword: '',
  questionType: '',
  difficulty: '',
});
const getAllQuestionParams = reactive<IGetAllQuestionParams>({
  type: 'all',
  currentPage: 1,
  pageSize: 10,
  catalogID: String(catalogID),
  refresh: false,
});

const onSubmit = () => {
  if (!form.keyword && !form.questionType && !form.difficulty) {
    ElMessage.error('请至少输入一项搜索条件');
    return;
  }
  searchQuestion(form).then((res) => {
    searchData.value = res.data;
    clickSearch.value = true;
  });
  store.commit('setSearchHistory', form);
};
const getAllQuestion = (refresh?: boolean) => {
  if (refresh) {
    getAllQuestionParams.refresh = true;
  }
  getQuestionList(getAllQuestionParams).then((res) => {
    allQuestion.value = res.result.list;
    clickSearch.value = false;
  });
};

const tabClick = (type: string) => {
  getAllQuestionParams.catalogID = type;
};

const clearSearch = () => {
  form.keyword = '';
  form.questionType = '';
  form.difficulty = '';
  clickSearch.value = false;
  store.commit('setSearchHistory', '');
};
watchEffect(() => {
  if (isClickSearch === 'true' && store.state.searchHistory) {
    console.log('isClickSearch', isClickSearch);
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
  getAllQuestion(false);
});
</script>
<style scoped>
.top-container {
  width: 100%;
  height: 100%;
}
</style>
