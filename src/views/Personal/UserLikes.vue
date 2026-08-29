<template>
  <div
    v-loading="loading"
    class="user-info-container"
    element-loading-text="加载中..."
  >
    <el-card v-if="idsStr !== ''" style="min-height: 500px">
      <VirtualList
        v-if="questionList.length > 0"
        :data="questionList"
        :height="600"
        :estimated-item-height="200"
        :loading="loadingMore"
        :finished="noMore"
        @loadMore="loadMore"
      >
        <template #default="{ item }">
          <QuestionCard
            :question="item"
            type="userLikes"
            :card-tip="reviewingCardTip(item, store.state.userData.userId)"
          />
        </template>
      </VirtualList>
      <el-empty v-else :image-size="200" description="没有点赞的题目" />
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
import VirtualList from '@/components/VirtualList/index.vue';

import { getQuestionList } from '@/services';
import { reviewingCardTip } from '@/utils';
const store = useStore();
const questionList = ref<any[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const noMore = ref(false);
const currentPage = ref(1);
const total = ref(0);
const pageSize = 10;

const ids = store.state.userData?.likeTopicsId;

const idsStr = Array.isArray(ids)
  ? ids?.slice(1).join(',')
  : ids?.replace(/(^,*)/g, '');
const likeTopicsIdParams = reactive({
  type: 'user',
  ids: idsStr,
  currentPage: 1,
  pageSize,
});
const getQuestionListData = async (append = false) => {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }
  const res = await getQuestionList({
    ...likeTopicsIdParams,
    currentPage: currentPage.value,
  });
  if (append) {
    questionList.value = [...questionList.value, ...(res?.result ?? [])];
  } else {
    questionList.value = res?.result ?? [];
  }
  total.value = res?.total ?? 0;
  noMore.value = questionList.value.length >= total.value;
  loading.value = false;
  loadingMore.value = false;
};

const loadMore = async () => {
  if (loadingMore.value || noMore.value) return;
  currentPage.value += 1;
  await getQuestionListData(true);
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
