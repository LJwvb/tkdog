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
          <div>
            <el-button size="small" @click="openEdit(item)">编辑题目</el-button>
            <el-button size="small" @click="togglePurview(item)">
              {{ Number(item.purview) === 1 ? '设为私有' : '设为公开' }}
            </el-button>
          </div>
        </div>
        <TestCard :paper="item" name="上传的试卷" />
      </div>
    </el-card>
    <el-card v-else>
      <el-empty :image-size="200" description="没有创建试卷" />
    </el-card>

    <!-- 编辑试卷题目弹窗 -->
    <el-dialog
      v-model="editVisible"
      title="编辑试卷题目（增删题目）"
      width="720px"
    >
      <div class="edit-title">当前题目（{{ editQuestions.length }} 道）</div>
      <div class="edit-list">
        <div
          v-for="(q, index) in editQuestions"
          :key="q.id"
          class="edit-q-item"
        >
          <span class="edit-q-idx">{{ index + 1 }}.</span>
          <span class="edit-q-text">{{ q.question }}</span>
          <el-button link type="danger" @click="removeFromEdit(index)"
            >删除</el-button
          >
        </div>
        <el-empty
          v-if="editQuestions.length === 0"
          :image-size="60"
          description="暂无题目"
        />
      </div>

      <el-divider>添加题目</el-divider>
      <div class="edit-search">
        <el-input
          v-model="searchKeyword"
          placeholder="输入关键词搜索题目"
          @keyup.enter="searchAdd"
        />
        <el-button type="primary" @click="searchAdd">搜索</el-button>
      </div>
      <div class="edit-list">
        <div v-for="q in searchResults" :key="q.id" class="edit-q-item">
          <span class="edit-q-text">{{ q.question }}</span>
          <el-button link type="primary" @click="addToEdit(q)">添加</el-button>
        </div>
      </div>

      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="savePaperEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

import {
  getPaper,
  updatePaperPurview,
  updatePaperQuestions,
  getPaperDetail,
  searchQuestion,
} from '@/services';
import TestCard from '@/components/TestCard/index.vue';
import type { IPaperCard, IQuestion } from '@/types';

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
    paperList.value = res as unknown as IPaperCard[];
  });
};

// ===== 编辑试卷题目 =====
const editVisible = ref(false);
const editPaperId = ref<number>(0);
const editQuestions = ref<IQuestion[]>([]);
const searchKeyword = ref('');
const searchResults = ref<IQuestion[]>([]);

const openEdit = async (paper: IPaperCard) => {
  editPaperId.value = Number(paper.paper_id);
  editVisible.value = true;
  searchKeyword.value = '';
  searchResults.value = [];
  const res = await getPaperDetail({ paperId: paper.paper_id as number });
  editQuestions.value = res?.questions ?? [];
};

const removeFromEdit = (index: number) => {
  editQuestions.value.splice(index, 1);
};

const searchAdd = async () => {
  const kw = searchKeyword.value.trim();
  if (!kw) {
    ElMessage.warning('请输入搜索关键词');
    return;
  }
  const res = await searchQuestion({
    keyword: kw,
    currentPage: 1,
    pageSize: 10,
  });
  searchResults.value = res?.result ?? [];
};

const addToEdit = (q: IQuestion) => {
  if (editQuestions.value.some((e) => Number(e.id) === Number(q.id))) {
    ElMessage.warning('该题已在试卷中');
    return;
  }
  editQuestions.value.push(q);
};

const savePaperEdit = async () => {
  if (editQuestions.value.length < 1) {
    ElMessage.warning('试卷至少需要 1 道题');
    return;
  }
  if (editQuestions.value.length > 50) {
    ElMessage.warning('试卷最多 50 道题');
    return;
  }
  await updatePaperQuestions({
    paperId: editPaperId.value,
    ids: editQuestions.value.map((q) => q.id).join(','),
  });
  ElMessage.success('修改成功');
  editVisible.value = false;
  loadPapers();
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
.edit-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.edit-list {
  max-height: 220px;
  overflow: auto;
  margin-bottom: 8px;
}
.edit-q-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  border-bottom: 1px solid #f0f0f0;
}
.edit-q-idx {
  color: #909399;
  flex-shrink: 0;
}
.edit-q-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.edit-search {
  display: flex;
  gap: 8px;
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
