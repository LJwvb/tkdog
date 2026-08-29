<template>
  <div
    v-loading="loading"
    class="user-info-container"
    element-loading-text="加载中..."
  >
    <el-card>
      <div class="wrong-header">
        <span class="wrong-title">错题本</span>
        <div class="wrong-tools">
          <el-select
            v-model="subjectFilter"
            placeholder="全部科目"
            clearable
            style="width: 160px"
            @change="onSubjectChange"
          >
            <el-option
              v-for="s in subjectStats"
              :key="s.subjectID"
              :label="s.subjectName"
              :value="s.subjectID"
            />
          </el-select>
          <el-button
            type="primary"
            :disabled="total === 0"
            @click="startRework"
          >
            重练全部错题
          </el-button>
          <el-button type="danger" :disabled="total === 0" @click="clearAll">
            清空错题
          </el-button>
        </div>
      </div>

      <div v-if="subjectStats.length > 0" class="subject-stats">
        <span class="stats-label">错题科目分布：</span>
        <el-tag
          v-for="s in subjectStats"
          :key="s.subjectID"
          size="small"
          class="stat-tag"
        >
          {{ s.subjectName }} × {{ s.count }}
        </el-tag>
      </div>

      <VirtualList
        v-if="questionList.length > 0"
        :data="questionList"
        :height="500"
        :estimated-item-height="200"
        :loading="loadingMore"
        :finished="noMore"
        @loadMore="loadMore"
      >
        <template #default="{ item }">
          <QuestionCard
            :question="item"
            type="userWrong"
            :card-tip="reviewingCardTip(item, store.state.userData.userId)"
          />
        </template>
      </VirtualList>
      <el-empty v-else :image-size="200" description="暂无错题，继续保持！" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import QuestionCard from '@/components/QuestionCard/index.vue';
import VirtualList from '@/components/VirtualList/index.vue';
import {
  getWrongQuestions,
  getPaperQuestion,
  clearWrongQuestions,
} from '@/services';
import { PaperPurview, type IWrongQuestion } from '@/types';
import { reviewingCardTip } from '@/utils';

const router = useRouter();
const store = useStore();
const questionList = ref<IWrongQuestion[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const noMore = ref(false);
const currentPage = ref(1);
const total = ref(0);
const pageSize = 10;
const subjectFilter = ref<number | ''>('');
const subjectStats = ref<
  Array<{ subjectID: number; subjectName: string; count: number }>
>([]);

const getData = async (append = false) => {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }
  const res = await getWrongQuestions({
    currentPage: currentPage.value,
    pageSize,
    subjectID: subjectFilter.value === '' ? undefined : subjectFilter.value,
  });
  if (append) {
    questionList.value = [...questionList.value, ...(res?.data ?? [])];
  } else {
    questionList.value = res?.data ?? [];
  }
  total.value = res?.total ?? 0;
  subjectStats.value = res?.subjectStats ?? [];
  noMore.value = questionList.value.length >= total.value;
  loading.value = false;
  loadingMore.value = false;
};

const loadMore = async () => {
  if (loadingMore.value || noMore.value) return;
  currentPage.value += 1;
  await getData(true);
};

const onSubjectChange = () => {
  currentPage.value = 1;
  questionList.value = [];
  noMore.value = false;
  getData();
};

const clearAll = () => {
  ElMessageBox.confirm('确定清空所有错题吗？此操作不可恢复', '提示', {
    confirmButtonText: '确定清空',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    clearWrongQuestions().then(() => {
      ElMessage.success('错题已清空');
      currentPage.value = 1;
      subjectFilter.value = '';
      questionList.value = [];
      noMore.value = false;
      getData();
    });
  });
};

const startRework = async () => {
  // 取全部错题（练习卷最多 50 道）
  const res = await getWrongQuestions({ currentPage: 1, pageSize: 999 });
  const wrongs = res?.data ?? [];
  if (!wrongs.length) {
    ElMessage.warning('没有错题可重练');
    return;
  }
  const list = wrongs.slice(0, 50);
  if (wrongs.length > 50) {
    ElMessage.warning('错题超过 50 道，仅重练前 50 道');
  }
  const ids = list.map((q) => q.id).join(',');
  const paper = await getPaperQuestion({
    ids,
    paperTitle: `错题重练-${Date.now()}`,
    paperTags: '',
    purview: PaperPurview.Private,
    author: store.state.userData.username,
    isPractice: true,
  });
  router.push({
    path: '/testPaper/doPaper',
    query: { paperID: paper.paperId },
  });
};

onMounted(() => {
  getData();
});
</script>

<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
.wrong-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.wrong-title {
  font-size: 16px;
  font-weight: 600;
}
.wrong-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}
.subject-stats {
  margin-bottom: 16px;
  padding: 10px 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
}
.stats-label {
  margin-right: 8px;
  font-size: 13px;
  color: #606266;
}
.stat-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}
</style>
