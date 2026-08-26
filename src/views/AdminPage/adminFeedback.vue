<template>
  <div class="feedback-list">
    <el-card>
      <template #header>题目纠错反馈</template>
      <el-table v-loading="loading" :data="list" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="对应题目" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link
              type="primary"
              :underline="false"
              @click="goQuestion(row.question_id)"
            >
              {{ row.question || '（题目已删除）' }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="反馈人" width="110" />
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">
            {{ typeName(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" min-width="220" />
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tooltip
              v-if="row.is_resolved === 1"
              :content="resolveTip(row)"
              placement="top"
            >
              <el-tag size="small" type="success">已处理</el-tag>
            </el-tooltip>
            <el-tag v-else size="small" type="warning">未处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="反馈时间" width="160">
          <template #default="{ row }">
            {{ transitionTime(row.ctime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.is_resolved !== 1"
              size="small"
              type="primary"
              @click="openResolve(row)"
              >标记处理</el-button
            >
            <span v-else class="resolved-text">已完成</span>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!loading && list.length === 0"
        :image-size="200"
        description="暂无纠错反馈"
      />

      <el-pagination
        v-if="total > 0"
        v-model:current-page="currentPage"
        background
        layout="slot, prev, pager, next"
        :total="total"
        prev-text="上一页"
        next-text="下一页"
        :hide-on-single-page="true"
        @current-change="handlePageChange"
      >
        <template #default> 共 {{ total }} 条 </template>
      </el-pagination>
    </el-card>

    <!-- 处理弹窗 -->
    <el-dialog v-model="resolveVisible" title="标记已处理" width="480px">
      <div class="resolve-content">
        <div class="resolve-item">
          <span class="resolve-label">题目：</span>
          {{ currentRow?.question || '（题目已删除）' }}
        </div>
        <div class="resolve-item">
          <span class="resolve-label">反馈：</span>
          {{ currentRow?.content }}
        </div>
        <el-input
          v-model="resolveRemark"
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
          placeholder="处理备注（可选，将通知给提交者）"
        />
      </div>
      <template #footer>
        <el-button @click="resolveVisible = false">取消</el-button>
        <el-button type="primary" @click="doResolve">确认处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getFeedbackList, resolveFeedback } from '@/services';
import { transitionTime } from '@/utils';
import type { IQuestionFeedback } from '@/types';

const router = useRouter();
const list = ref<IQuestionFeedback[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const total = ref(0);
const resolveVisible = ref(false);
const resolveRemark = ref('');
const currentRow = ref<IQuestionFeedback | null>(null);

const typeName = (type: string) => {
  switch (type) {
    case 'wrong_answer':
      return '答案错误';
    case 'typo':
      return '错别字';
    default:
      return '题目错误';
  }
};

const resolveTip = (row: unknown) => {
  const r = row as IQuestionFeedback;
  const parts: string[] = [];
  if (r.resolver) parts.push(`处理人：${r.resolver}`);
  if (r.resolve_time) parts.push(`时间：${transitionTime(r.resolve_time)}`);
  if (r.resolve_remark) parts.push(`备注：${r.resolve_remark}`);
  return parts.join('；') || '已处理';
};

const load = async () => {
  loading.value = true;
  const res = await getFeedbackList({
    currentPage: currentPage.value,
    pageSize: 10,
  });
  list.value = res?.result ?? [];
  total.value = res?.total ?? 0;
  loading.value = false;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  document.documentElement.scrollTop = 0;
  load();
};

const goQuestion = (id: number) => {
  router.push({
    path: '/problemInfo',
    query: { id, type: 'admin' },
  });
};

const openResolve = (row: unknown) => {
  currentRow.value = row as IQuestionFeedback;
  resolveRemark.value = '';
  resolveVisible.value = true;
};

const doResolve = async () => {
  if (!currentRow.value) return;
  await resolveFeedback({
    id: currentRow.value.id,
    remark: resolveRemark.value,
  });
  ElMessage.success('已标记处理');
  resolveVisible.value = false;
  currentRow.value = null;
  load();
};

onMounted(load);
</script>

<style scoped>
.feedback-list {
  width: 100%;
  padding: 20px;
}
.resolved-text {
  color: #909399;
  font-size: 13px;
}
.resolve-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.resolve-item {
  font-size: 14px;
  color: #303133;
}
.resolve-label {
  color: #909399;
}
</style>
