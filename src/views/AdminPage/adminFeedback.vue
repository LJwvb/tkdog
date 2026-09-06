<template>
  <div class="feedback-list">
    <el-card class="search" shadow="never">
      <el-form inline>
        <el-form-item label="反馈内容">
          <el-input
            v-model="searchForm.content"
            placeholder="按反馈内容搜索"
            clearable
            style="width: 160px"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item label="反馈人">
          <el-input
            v-model="searchForm.username"
            placeholder="按反馈人搜索"
            clearable
            style="width: 140px"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item label="对应题目">
          <el-input
            v-model="searchForm.question"
            placeholder="按题目搜索"
            clearable
            style="width: 160px"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select
            v-model="searchForm.isResolved"
            placeholder="全部状态"
            clearable
            style="width: 120px"
            @change="onSearch"
          >
            <el-option label="已处理" :value="1" />
            <el-option label="未处理" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-container>
      <el-main style="padding: 10px 0 0 0">
        <el-card>
          <template #header>题目纠错反馈</template>
          <el-table
            ref="feedbackTableRef"
            v-loading="loading"
            :data="list"
            stripe
            height="calc(100vh - 410px)"
            empty-text=""
          >
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column
              label="对应题目"
              min-width="200"
              show-overflow-tooltip
            >
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
            <el-table-column label="反馈时间" width="175" show-overflow-tooltip>
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

            <template #empty>
              <el-empty
                v-if="!loading && list.length === 0"
                :image-size="160"
                description="暂无纠错反馈"
              />
            </template>
          </el-table>

          <div v-if="total > 0" class="list-total">
            共 {{ total }} 条，已加载 {{ list.length }} 条
          </div>
          <!-- 反馈列表走表格滚动加载，隐藏的分页器已移除 -->
        </el-card>
      </el-main>
    </el-container>

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
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getFeedbackList, resolveFeedback } from '@/services';
import { transitionTime } from '@/utils';
import { useInfiniteTable } from '@/composables/useInfiniteTable';
import type { IQuestionFeedback } from '@/types';

const router = useRouter();
const feedbackTableRef = ref();
const searchForm = reactive({
  content: '',
  username: '',
  question: '',
  isResolved: '' as '' | 0 | 1,
});
const resolveVisible = ref(false);
const resolveRemark = ref('');
const currentRow = ref<IQuestionFeedback | null>(null);

const { list, total, loading, noMore, reset } =
  useInfiniteTable<IQuestionFeedback>(
    (params) =>
      getFeedbackList({
        ...params,
        content: searchForm.content,
        username: searchForm.username,
        question: searchForm.question,
        isResolved: searchForm.isResolved,
      }),
    { pageSize: 10, tableRef: feedbackTableRef },
  );

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

const onSearch = () => {
  void reset();
};
const onReset = () => {
  searchForm.content = '';
  searchForm.username = '';
  searchForm.question = '';
  searchForm.isResolved = '';
  void reset();
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
  void reset();
};

onMounted(() => {
  void reset();
});
</script>

<style scoped>
.feedback-list {
  width: 100%;
}

.search :deep(.el-form-item) {
  margin-bottom: 0;
}

/* 列表总数状态：与违禁词/用户等管理页保持一致 */
.list-total {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
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
