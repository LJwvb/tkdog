<template>
  <div
    v-loading="loading"
    class="user-info-container"
    element-loading-text="加载中..."
  >
    <el-tabs v-model="activeChkState" @tab-change="handleTabChange">
      <el-tab-pane label="未审核" :name="String(ChkState.Pending)" />
      <el-tab-pane label="已审核" :name="String(ChkState.Approved)" />
      <el-tab-pane label="不通过" :name="String(ChkState.Rejected)" />
    </el-tabs>

    <el-card style="min-height: 500px">
      <div v-if="questionList.length > 0">
        <div v-for="item in questionList" :key="item.id">
          <QuestionCard :question="item" type="userQuestions" />
        </div>
      </div>
      <el-empty v-else :image-size="200" description="没有上传题目" />

      <el-pagination
        v-model:current-page="currentPage"
        background
        layout="slot, prev, pager, next"
        :total="total"
        prev-text="上一页"
        next-text="下一页"
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
      >
        <template #default> 共 {{ total }} 条 </template>
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';

import { getUserUploadQues } from '@/services';
import QuestionCard from '@/components/QuestionCard/index.vue';
import { ChkState, type IQuestion } from '@/types';

const store = useStore();
const questionList = ref<IQuestion[]>([]);
const currentPage = ref(1);
const total = ref(0);
const loading = ref(true);
const activeChkState = ref(String(ChkState.Pending));

const getUserUploadQuesParams = reactive({
  userId: store?.state?.userData?.userId as number,
  pageSize: 10,
  chkState: ChkState.Pending,
});

const getUserUploadQuesData = async () => {
  loading.value = true;
  const res = await getUserUploadQues({
    ...getUserUploadQuesParams,
    currentPage: currentPage.value,
  });
  questionList.value = res?.data ?? [];
  total.value = res?.total ?? 0;
  loading.value = false;
};

const handleTabChange = (name: string | number) => {
  getUserUploadQuesParams.chkState = Number(name);
  currentPage.value = 1;
  getUserUploadQuesData();
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  getUserUploadQuesData();
};

onMounted(() => {
  getUserUploadQuesData();
});
</script>

<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
</style>
