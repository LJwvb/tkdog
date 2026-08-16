<template>
  <div class="review-list">
    <el-card>
      <template #header>
        <div class="header">
          <span>主观题人工复核</span>
          <span class="tip"
            >简答题自动判分结果为「待定」的答案，可在此人工判对/判错</span
          >
        </div>
      </template>

      <el-table v-loading="loading" :data="list" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="username" label="作答人" width="110" />
        <el-table-column label="题目" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">{{ row.question }}</template>
        </el-table-column>
        <el-table-column label="用户答案" min-width="220">
          <template #default="{ row }">
            <div class="answer-text">{{ row.user_answer || '（未作答）' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="参考答案" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="ref-answer" v-html="row.correct_answer"></div>
          </template>
        </el-table-column>
        <el-table-column prop="paper_title" label="试卷" min-width="150" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="success" @click="doReview(row, true)"
              >判对</el-button
            >
            <el-button size="small" type="danger" @click="doReview(row, false)"
              >判错</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!loading && list.length === 0"
        :image-size="200"
        description="暂无待复核的主观题"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getSubjectiveReviews, reviewSubjective } from '@/services';
import type { ISubjectiveReview } from '@/types';

const list = ref<ISubjectiveReview[]>([]);
const loading = ref(true);

const load = async () => {
  loading.value = true;
  list.value = (await getSubjectiveReviews()) ?? [];
  loading.value = false;
};

const doReview = async (row: { id?: number }, correct: boolean) => {
  if (!row.id) return;
  await reviewSubjective({ id: row.id, correct });
  ElMessage.success(correct ? '已判为正确' : '已判为错误');
  load();
};

onMounted(load);
</script>

<style scoped>
.review-list {
  width: 100%;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tip {
  font-size: 12px;
  color: #909399;
}
.answer-text {
  white-space: pre-wrap;
  word-break: break-word;
}
.ref-answer {
  word-break: break-word;
}
</style>
