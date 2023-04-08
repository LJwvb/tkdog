<template>
  <div
    class="user-info-container"
    v-loading="loading"
    element-loading-text="Loading..."
  >
    <el-card v-if="ids !== ''" style="min-height: 500px">
      <div v-for="item in questionList" :key="item.id">
        <QuestionCard :question="item" type="userHistory" />
      </div>
    </el-card>
    <el-card v-else>
      <el-empty :image-size="200" description="没有浏览记录" />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import QuestionCard from '@/components/QuestionCard/index.vue';

import { getQuestionList } from '@/services';
const store = useStore();
const questionList = ref();
const loading = ref(true);

const ids = store.state.browseTopicsId.join(',');

onMounted(() => {
  getQuestionList({ type: 'user', ids: ids }).then((res) => {
    questionList.value = res?.result;
    loading.value = false;
  });
});
</script>
<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
</style>
