<template>
  <div
    class="user-info-container"
    v-loading="loading"
    element-loading-text="Loading..."
  >
    <SubTab
      :questionList="questionList"
      :currentPage="currentPage"
      :total="total"
      type="userQuestions"
      @tabClick="tabClick"
      @handleCurrentChange="handleCurrentChange"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';

import { getUserUploadQues } from '@/services';
import SubTab from '@/components/SubTab/index.vue';
const store = useStore();

const questionList = ref<any>([]);
const currentPage = ref(1);
const total = ref(0);
const loading = ref(true);

const getUserUploadQuesParams = reactive({
  username: store?.state?.userData?.username,
  currentPage: 1,
  pageSize: 10,
  chkState: 0,
});
const getUserUploadQuesData = async (val?: { currentPage: number }) => {
  const res = await getUserUploadQues({
    ...getUserUploadQuesParams,
    ...val,
  });
  console.log(res?.data?.[0]);
  loading.value = false;
  questionList.value = res?.data;
  total.value = res?.total;
};
const handleCurrentChange = (val: number) => {
  getUserUploadQuesParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getUserUploadQuesData({ currentPage: val });
};
const tabClick = (type: number) => {
  getUserUploadQuesParams.chkState = type;
  getUserUploadQuesParams.currentPage = 1;
  currentPage.value = 1;
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
