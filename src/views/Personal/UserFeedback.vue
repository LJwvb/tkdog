<template>
  <div
    v-loading="loading"
    class="user-feedback"
    element-loading-text="加载中..."
  >
    <el-card>
      <template #header>我的纠错反馈</template>
      <el-table v-if="list.length" :data="list" stripe>
        <el-table-column label="题目" min-width="200" show-overflow-tooltip>
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
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">{{ typeName(row.type) }}</template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" min-width="220" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tooltip
              v-if="row.is_resolved === 1"
              :content="resolveTip(row)"
              placement="top"
            >
              <el-tag size="small" type="success">已处理</el-tag>
            </el-tooltip>
            <el-tag v-else size="small" type="warning">待处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="160">
          <template #default="{ row }">
            {{ transitionTime(row.ctime) }}
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-else :image-size="200" description="暂无纠错反馈" />

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMyFeedback } from '@/services';
import { transitionTime } from '@/utils';
import type { IQuestionFeedback } from '@/types';

const router = useRouter();
const list = ref<IQuestionFeedback[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const total = ref(0);

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
  if (r.resolve_time) parts.push(`时间：${transitionTime(r.resolve_time)}`);
  if (r.resolve_remark) parts.push(`备注：${r.resolve_remark}`);
  return parts.join('；') || '已处理';
};

const load = async () => {
  loading.value = true;
  const res = await getMyFeedback({
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
    query: { id, type: 'userFeedback' },
  });
};

onMounted(load);
</script>

<style scoped>
.user-feedback {
  width: 100%;
  margin-left: 20px;
}
</style>
