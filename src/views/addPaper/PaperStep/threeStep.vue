<template>
  <el-card class="smart-pick">
    <div class="pick-header">
      <el-button type="primary" @click="togglePick">智能抽题</el-button>
      <span class="pick-tip"
        >按题型数量自动从已审核题库随机抽题，加入下方试卷</span
      >
    </div>
    <el-form v-if="showPick" inline class="pick-form">
      <el-form-item label="科目">
        <el-select
          v-model="pickForm.subjectID"
          clearable
          placeholder="全部科目"
          style="width: 150px"
        >
          <el-option
            v-for="s in subjectList"
            :key="s.subjectID"
            :label="s.content"
            :value="s.subjectID"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="难度">
        <el-select
          v-model="pickForm.difficulty"
          clearable
          placeholder="全部难度"
          style="width: 120px"
        >
          <el-option label="简单" :value="0" />
          <el-option label="中等" :value="1" />
          <el-option label="困难" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="单选">
        <el-input-number v-model="pickForm.single" :min="0" :max="50" />
      </el-form-item>
      <el-form-item label="多选">
        <el-input-number v-model="pickForm.multiple" :min="0" :max="50" />
      </el-form-item>
      <el-form-item label="判断">
        <el-input-number v-model="pickForm.judge" :min="0" :max="50" />
      </el-form-item>
      <el-form-item label="简答">
        <el-input-number v-model="pickForm.essay" :min="0" :max="50" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" :loading="picking" @click="doPick">
          抽题并加入
        </el-button>
        <el-button type="primary" :loading="suggesting" @click="handleAiSuggest">
          <span class="ai-suggest-badge">AI</span> 智能组卷
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-dialog
    v-model="suggestVisible"
    width="760px"
    class="ai-suggest-dialog"
    :close-on-click-modal="false"
  >
    <template #header>
      <div class="ai-report-dialog-head">
        <span class="ai-badge">AI</span>
        <span>智能组卷推荐</span>
        <span v-if="suggestData?.reason" class="ai-suggest-count"
          >推荐 {{ suggestData.questions.length }} 道</span
        >
      </div>
    </template>
    <div v-if="suggesting" class="ai-report-loading">
      <el-icon class="is-loading" :size="26"><i class="el-icon-loading" /></el-icon>
      <div>AI 正在根据科目、难度与题型组合推荐题目，约需 3~10 秒…</div>
    </div>
    <div v-else-if="suggestData" class="ai-suggest-body">
      <div class="ai-suggest-reason">{{ suggestData.reason }}</div>
      <div v-for="(q, i) in suggestData.questions" :key="q.id" class="ai-suggest-item">
        <div class="ai-suggest-item-head">
          <span class="ai-suggest-idx">{{ i + 1 }}</span>
          <span class="ai-suggest-type">{{ questionTypeName(q.questionType) }}</span>
          <span class="ai-suggest-diff">难度{{ q.difficulty ?? 0 }}</span>
        </div>
        <div class="ai-suggest-q" v-html="q.question"></div>
      </div>
      <div class="ai-suggest-actions">
        <el-button type="primary" @click="addSuggestQuestions">加入试卷</el-button>
        <el-button @click="suggestVisible = false">取消</el-button>
      </div>
    </div>
  </el-dialog>

  <QuestionCard
    v-for="item in questionList"
    :key="item.id"
    :question="item"
    type="paper"
  />
  <el-empty
    v-if="questionList.length === 0"
    :image-size="200"
    description="题目列表为空,快去添加题目呀~"
  >
    <el-button type="primary" @click="addQuestion">手动添加题目</el-button>
  </el-empty>

  <el-button class="prev-step" type="primary" @click="prevStep"
    >上一步</el-button
  >
  <el-button
    v-if="questionList.length !== 0"
    class="next-step"
    type="primary"
    @click="nextStep"
    >创建试卷</el-button
  >
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import QuestionCard from '@/components/QuestionCard/index.vue';
import { randomPickQuestions, getSubjectList, aiPaperSuggest, getQuestionList } from '@/services';
import { ElMessage } from 'element-plus';
import type { ISubject, IQuestion } from '@/types';
import router from '@/router';

const store = useStore();

const questionList = computed(() => store.state.selectedTopic as IQuestion[]);

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'next'): void;
  (e: 'prev'): void;
}>();

// 智能抽题
const showPick = ref(false);
const picking = ref(false);
const subjectList = ref<ISubject[]>([]);
const pickForm = reactive({
  subjectID: '' as string | number,
  difficulty: '' as string | number,
  single: 5,
  multiple: 0,
  judge: 0,
  essay: 0,
});

const togglePick = () => {
  showPick.value = !showPick.value;
};

const doPick = async () => {
  picking.value = true;
  try {
    const res = await randomPickQuestions({
      subjectID: pickForm.subjectID === '' ? undefined : pickForm.subjectID,
      difficulty: pickForm.difficulty === '' ? undefined : pickForm.difficulty,
      counts: {
        single: pickForm.single,
        multiple: pickForm.multiple,
        judge: pickForm.judge,
        essay: pickForm.essay,
      },
    });
    if (res && res.length) {
      const existing = store.state.selectedTopic as IQuestion[];
      const existingIds = new Set(existing.map((q) => q.id));
      const fresh = res.filter((q) => !existingIds.has(q.id));
      store.commit('setSelectedTopic', [...existing, ...fresh]);
      ElMessage.success(`抽题成功，新增 ${fresh.length} 道题目`);
    } else {
      ElMessage.warning('没有抽到符合条件的题目，请调整条件');
    }
  } finally {
    picking.value = false;
  }
};

// ===== AI 智能组卷 =====
const suggesting = ref(false);
const suggestVisible = ref(false);
const suggestData = ref<{ reason: string; questions: IQuestion[] } | null>(null);

const questionTypeName = (t: number | string) => {
  const names = ['单选', '多选', '判断', '简答'];
  return names[Number(t)] ?? '未知';
};

const handleAiSuggest = async () => {
  suggesting.value = true;
  try {
    const res = await aiPaperSuggest({
      subjectID: pickForm.subjectID === '' ? undefined : pickForm.subjectID,
      difficulty: pickForm.difficulty === '' ? undefined : pickForm.difficulty,
      counts: {
        single: pickForm.single,
        multiple: pickForm.multiple,
        judge: pickForm.judge,
        essay: pickForm.essay,
      },
      tags: [],
    });
    if (!res.available || !res.questionIds?.length) {
      ElMessage.warning(res.message || 'AI 暂不可用或没有合适题目，请调整条件');
      return;
    }
    const detail = await getQuestionList({
      type: 'user',
      ids: res.questionIds.join(','),
      pageSize: 100,
      currentPage: 1,
    });
    const list = (detail?.result || []) as IQuestion[];
    const ordered = res.questionIds
      .map((id) => list.find((q) => String(q.id) === String(id)))
      .filter(Boolean) as IQuestion[];
    if (!ordered.length) {
      ElMessage.warning('未能取回推荐题目，请重试');
      return;
    }
    suggestData.value = { reason: res.reason || '', questions: ordered };
    suggestVisible.value = true;
  } catch {
    ElMessage.error('AI 组卷失败，请稍后重试');
  } finally {
    suggesting.value = false;
  }
};

const addSuggestQuestions = () => {
  if (!suggestData.value) return;
  const existing = store.state.selectedTopic as IQuestion[];
  const existingIds = new Set(existing.map((q) => q.id));
  const fresh = suggestData.value.questions.filter((q) => !existingIds.has(q.id));
  store.commit('setSelectedTopic', [...existing, ...fresh]);
  ElMessage.success(`已加入 ${fresh.length} 道推荐题目`);
  suggestVisible.value = false;
};

const prevStep = () => {
  emit('prev');
};

const nextStep = () => {
  emit('next');
  emit('done');
};
const addQuestion = () => {
  if (store.state.userData.isAdmin) {
    router.push({
      path: '/adminQuestion',
      query: {
        index: 'chk',
      },
    });
  } else {
    router.push('/questionPage');
  }
};

onMounted(async () => {
  try {
    subjectList.value = await getSubjectList();
  } catch {
    // 科目列表加载失败不影响抽题
  }
});
</script>

<style scoped>
.ai-suggest-badge {
  margin-right: 6px;
  font-weight: 800;
  color: #fff;
}
.ai-badge {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  color: #fff;
  background: linear-gradient(135deg, #409eff, #36cfc9);
}
.ai-report-dialog-head {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 16px;
}
.ai-suggest-count {
  font-size: 11px;
  color: #409eff;
  border: 1px solid rgba(64, 158, 255, 0.4);
  border-radius: 8px;
  padding: 1px 8px;
  background: rgba(64, 158, 255, 0.08);
}
.ai-report-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
  color: var(--el-text-color-secondary);
}
.ai-suggest-body {
  max-height: 62vh;
  overflow-y: auto;
  padding-right: 6px;
}
.ai-suggest-reason {
  font-size: 13px;
  line-height: 1.8;
  color: var(--el-text-color-primary);
  background: rgba(64, 158, 255, 0.06);
  border-left: 3px solid #409eff;
  padding: 10px 14px;
  border-radius: 6px;
  margin-bottom: 14px;
}
.ai-suggest-item {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 10px;
}
.ai-suggest-item-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.ai-suggest-idx {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: linear-gradient(135deg, #409eff, #36cfc9);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ai-suggest-type {
  font-size: 12px;
  color: #409eff;
  background: rgba(64, 158, 255, 0.08);
  border-radius: 6px;
  padding: 1px 8px;
}
.ai-suggest-diff {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.ai-suggest-q {
  font-size: 13px;
  line-height: 1.7;
  color: var(--el-text-color-regular);
}
.ai-suggest-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
}
.smart-pick {
  margin-bottom: 16px;
}
.pick-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.pick-tip {
  font-size: 13px;
  color: #909399;
}
.pick-form :deep(.el-form-item) {
  margin-bottom: 8px;
}
.prev-step {
  margin-top: 16px;
  float: right;
}
.next-step {
  margin-top: 16px;
  float: right;
  margin-right: 12px;
}
</style>
