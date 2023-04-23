<template>
  <div
    class="user-info-container"
    v-loading="loading"
    element-loading-text="Loading..."
  >
    <el-card v-if="ids !== ''" style="min-height: 500px">
      <div v-for="item in questionList" :key="item.id">
        <QuestionCard :question="item" type="userLikes" />
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        background
        layout="slot, prev, pager, next"
        :total="total"
        prev-text="上一页"
        next-text="下一页"
        hide-on-single-page="true"
        @current-change="handleCurrentChange"
      >
        <template #default> 共 {{ total }} 条 </template>
      </el-pagination>
    </el-card>
    <el-card v-else>
      <el-empty :image-size="200" description="没有点赞的题目" />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, handleError } from 'vue';
import { useStore } from 'vuex';
import QuestionCard from '@/components/QuestionCard/index.vue';

import { getQuestionList } from '@/services';
const store = useStore();
const questionList = ref();
const loading = ref(true);
const currentPage = ref(1);
const total = ref(0);

const ids = store.state.userData?.likeTopicsId;

const idsStr = Array.isArray(ids)
  ? ids?.slice(1).join(',')
  : ids?.replace(/(^\,*)/g, '');
const likeTopicsIdParams = reactive({
  type: 'user',
  ids: idsStr,
  currentPage: 1,
  pageSize: 10,
});
const getQuestionListData = async (val?: { currentPage: number }) => {
  const res = await getQuestionList({
    ...likeTopicsIdParams,
    ...val,
  });
  questionList.value = res?.result;
  total.value = res?.total;
  loading.value = false;
};

const handleCurrentChange = (val: number) => {
  likeTopicsIdParams.currentPage = val;
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getQuestionListData({ currentPage: val });
};
onMounted(() => {
  getQuestionListData();
});
</script>
<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
</style>
