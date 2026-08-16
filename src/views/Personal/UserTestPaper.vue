<template>
  <div class="user-info-container">
    <el-card v-if="paperList?.length > 0" class="user-info-paper">
      <div
        v-for="item in paperList"
        :key="item.paper_id"
        class="test-card-wrapper"
      >
        <div class="paper-actions">
          <el-tag :type="statusType(item)" size="small">
            {{ statusText(item) }}
          </el-tag>
          <el-button size="small" @click="togglePurview(item)">
            {{ Number(item.purview) === 1 ? '设为私有' : '设为公开' }}
          </el-button>
        </div>
        <TestCard :paper="item" name="上传的试卷" />
      </div>
    </el-card>
    <el-card v-else>
      <el-empty :image-size="200" description="没有创建试卷" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

import { getPaper, updatePaperPurview } from '@/services';
import TestCard from '@/components/TestCard/index.vue';
import type { IPaperCard } from '@/types';

const store = useStore();
const paperList = ref<IPaperCard[]>([]);

const statusText = (item: IPaperCard): string => {
  if (Number(item.purview) === 1) {
    if (item.chkState === 0) return '公开（待审核）';
    if (item.chkState === 2) return '公开（未通过）';
    return '公开';
  }
  return '私有';
};

const statusType = (
  item: IPaperCard,
): 'info' | 'success' | 'warning' | 'danger' => {
  if (Number(item.purview) === 1) {
    if (item.chkState === 0) return 'warning';
    if (item.chkState === 2) return 'danger';
    return 'success';
  }
  return 'info';
};

const togglePurview = (item: IPaperCard) => {
  const isPublic = Number(item.purview) === 1;
  const target = isPublic ? 3 : 1;
  updatePaperPurview({ paperId: item.paper_id as number, purview: target })
    .then(() => {
      ElMessage.success(isPublic ? '已设为私有' : '已设为公开，等待审核');
      loadPapers();
    })
    .catch(() => {
      // 错误提示已由拦截器统一处理
    });
};

const loadPapers = () => {
  getPaper({ author: store?.state?.userData?.username }).then((res) => {
    // request 已在拦截层解出后端 data，此处 res 直接就是试卷数组
    paperList.value = res as unknown as IPaperCard[];
  });
};

onMounted(() => {
  loadPapers();
});
</script>

<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
.user-info-paper > :deep(.el-card__body) {
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: flex-start;
}
.test-card-wrapper {
  width: 400px;
  height: 240px;
  margin-right: 20px;
  margin-bottom: 20px;
  position: relative;
}
.paper-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* 移动端：卡片占满、去掉右边距 */
@media (max-width: 768px) {
  .test-card-wrapper {
    width: 100%;
    margin-right: 0;
  }
}
</style>
