<template>
  <div class="user-info-container">
    <el-card v-if="ids !== ''">
      <div v-for="item in questionList" :key="item.id">
        <QuestionCard :question="item" type="userLikes" />
      </div>
    </el-card>
    <el-card v-else>
      <el-empty :image-size="200" description="没有点赞的题目" />
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
const ids = store.state.userData.likeTopicsId
  ? store.state.userData.likeTopicsId?.slice(1)?.join(',')
  : '';

onMounted(() => {
  getQuestionList({ type: 'user', ids: ids }).then((res) => {
    questionList.value = res?.result;
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
