<template>
  <div v-loading="loading" class="user-info-container">
    <el-card v-if="favorites.length > 0" style="min-height: 500px">
      <div v-for="item in favorites" :key="item.id">
        <QuestionCard
          :question="item"
          type="userFavorites"
          :card-tip="reviewingCardTip(item, store.state.userData.userId)"
        />
      </div>
    </el-card>
    <el-card v-else>
      <el-empty :image-size="200" description="没有收藏的题目" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import QuestionCard from '@/components/QuestionCard/index.vue';
import { getMyFavorites } from '@/services';
import type { IQuestion } from '@/types';
import { reviewingCardTip } from '@/utils';

const store = useStore();
const favorites = ref<IQuestion[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    favorites.value = (await getMyFavorites()) || [];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
</style>
