<template>
  <div class="hello" style="width: 100%">
    <div class="search">
      <el-form :model="form" ref="from">
        <el-form-item label="搜索">
          <el-input
            placeholder="请输入搜索的内容"
            class="search"
            v-model="form.keyword"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onSubmit" style="margin-left: 20px"
        >搜索</el-button
      >
      <el-button @click="clearSearch">清空</el-button>
    </div>
    <el-container v-if="!clickSearch">
      <el-main style="padding: 10px">
        <el-card>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              label="未审核的题目"
              name="nochk"
              key="nochk"
            ></el-tab-pane>
            <el-tab-pane
              label="已审核的题目"
              name="chk"
              key="chk"
            ></el-tab-pane>
          </el-tabs>
          <div v-if="NoChkQuestions?.length === 0 && activeName === 'nochk'">
            <el-empty :image-size="200" description="没有未审核题目" />
          </div>
          <div
            v-if="activeName === 'nochk'"
            v-loading="loading"
            element-loading-text="Loading..."
          >
            <div v-for="item in NoChkQuestions" :key="item?.id">
              <QuestionCard
                :question="item"
                type="admin"
                :deleteQuestion="deleteQuestion"
                :check="check"
                :uncheck="uncheck"
                activeName="nochk"
              />
            </div>
            <el-pagination
              v-model:current-page="currentNoChkPage"
              background
              layout="slot, prev, pager, next"
              :total="noChkTotal"
              prev-text="上一页"
              next-text="下一页"
              hide-on-single-page="true"
              @current-change="handleNoChkCurrentChange"
            >
              <template #default> 共 {{ noChkTotal }} 条 </template>
            </el-pagination>
          </div>
          <div
            v-if="activeName === 'chk'"
            v-loading="loading"
            element-loading-text="Loading..."
          >
            <div v-for="item in ChkQuestions" :key="item?.id">
              <QuestionCard
                :question="item"
                type="admin"
                :deleteQuestion="deleteQuestion"
                activeName="chk"
              />
            </div>
            <el-pagination
              v-model:current-page="currentChkPage"
              background
              layout="slot, prev, pager, next"
              :total="chkTotal"
              prev-text="上一页"
              next-text="下一页"
              hide-on-single-page="true"
              @current-change="handleChkCurrentChange"
            >
              <template #default> 共 {{ chkTotal }} 条 </template>
            </el-pagination>
          </div>
          <div v-if="ChkQuestions?.length === 0 && activeName === 'chk'">
            <el-empty :image-size="200" description="没有已审核题目" />
          </div>
        </el-card>
      </el-main>
    </el-container>
    <div v-else>
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
          <QuestionCard
            :question="item"
            activeName="chk"
            :isClickSearch="true"
          />
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
  </div>
</template>
<script setup lang="ts">
import QuestionCard from '@/components/QuestionCard/index.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import queryString from 'query-string';
import { ElMessage } from 'element-plus';

import {
  getAllChkQuestions,
  getNoChkQuestions,
  deleteQuestions,
  chkQuestions,
  searchQuestion,
} from '@/services';
interface IChkQuestion {
  id: number;
  chkState: number;
  chkUser: string;
  chkRemarks?: string;
  creator: string;
  activeName: string;
}
const { index } = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);
const activeName = ref(index || 'nochk');
//获取已审核题目
const ChkQuestions = ref();
const from = ref();
//获取未审核题目
const NoChkQuestions = ref();
const loading = ref(true);
const currentNoChkPage = ref(1);
const currentChkPage = ref(1);
const noChkTotal = ref(0);
const chkTotal = ref(0);
const searchData = ref();
const clickSearch = ref(false);
const currentSearchPage = ref(1);
const searchTotal = ref(0);

const nochkParams = reactive({
  currentPage: 1,
  pageSize: 10,
});
const chkParams = reactive({
  currentPage: 1,
  pageSize: 10,
});
const form = reactive({
  keyword: '',
});
const getSearchDataParams = reactive({
  keyword: '',
  currentPage: 1,
  pageSize: 10,
});
const handleNoChkCurrentChange = (val: number) => {
  nochkParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getNoChkQuestion();
};
const handleChkCurrentChange = (val: number) => {
  chkParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getAllChkQuestion();
};
const getNoChkQuestion = async () => {
  const res = await getNoChkQuestions(nochkParams);
  NoChkQuestions.value = res.result;
  noChkTotal.value = res.total;
  loading.value = false;
};
const getAllChkQuestion = async () => {
  const res = await getAllChkQuestions(chkParams);
  ChkQuestions.value = res.result;
  chkTotal.value = res.total;
  loading.value = false;
};
const handleClick = (tab: any) => {
  loading.value = true;
  if (tab.name === 'nochk') {
    getNoChkQuestion();
  } else {
    getAllChkQuestion();
  }
};
const onSubmit = () => {
  if (!form.keyword) {
    ElMessage.error('请输入搜索关键词');
    return;
  }
  loading.value = true;
  getSearchData({ currentPage: 1 });
};
const clearSearch = () => {
  form.keyword = '';
  clickSearch.value = false;
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
const handleSearchCurrentChange = (val: number) => {
  getSearchDataParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getSearchData();
};
onMounted(() => {
  if (index === 'nochk' || !index) {
    getNoChkQuestion();
  } else {
    getAllChkQuestion();
  }
  loading.value = false;
});

const deleteQuestion = (id: number, activeName: string) => {
  deleteQuestions({ id }).then((res) => {
    if (res.code === 200) {
      if (activeName === 'nochk') {
        getNoChkQuestion();
      } else {
        getAllChkQuestion();
      }
    }
  });
};
const check = (params: IChkQuestion) => {
  chkQuestions(params).then((res) => {
    if (res.code === 200) {
      if (activeName.value === 'nochk') {
        getNoChkQuestion();
      } else {
        getAllChkQuestion();
      }
    }
  });
};
const uncheck = (params: IChkQuestion) => {
  chkQuestions(params).then((res) => {
    if (res.code == 200) {
      if (activeName.value === 'nochk') {
        getNoChkQuestion();
      } else {
        getAllChkQuestion();
      }
    }
  });
};
</script>

<style scoped>
.createPaper {
  width: 80px;
  height: 35px;
  background-color: #409eff;
  text-align: center;
  line-height: 35px;
  color: white;
  float: right;
  margin-top: -60px;
}

.logo1 {
  width: 60px;
  height: 60px;
  margin-top: 25px;
  margin-bottom: 10px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  border: 1px solid #ffffff;
}

.biaoqian1 {
  padding: 0px 12px;
  font-size: 12px;
  background-color: #f5f5f5;
  color: #000000;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  margin-right: 15px;
  margin-bottom: 10px;
}

.jiandaee {
  color: rgba(170, 170, 170, 1);
  font-size: 13px;
  margin: 15px 0px;
  margin-left: 20px;
}

.line1 {
  width: 1px;
  height: 15px;
  background-color: #e6e6e6;
  margin: 0px 20px;
}

.el-col-3 {
  max-width: 12.5%;
  flex: 0 0 4.5%;
}

.paperCard {
  display: flex;
  flex-wrap: wrap;
}
.search {
  display: flex;
  flex-direction: row;
}
::v-deep .el-loading-mask {
  z-index: 9;
}
</style>
