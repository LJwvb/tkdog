<template>
  <div v-loading="loading" class="do-paper-container">
    <!-- 试卷标题 + 操作 -->
    <el-card class="header-card">
      <div class="header-row">
        <div>
          <h2 class="paper-title">{{ paperInfo?.paper_title }}</h2>
          <div class="paper-meta">
            共 {{ questions.length }} 题 ·
            单选/多选/判断自动判分，简答题请自行对照参考答案
          </div>
        </div>
        <div class="header-actions">
          <el-button @click="backToList">返回</el-button>
          <el-button
            v-if="!submitted"
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
            >交卷</el-button
          >
        </div>
      </div>
    </el-card>

    <!-- 答题区 -->
    <template v-if="!submitted">
      <el-card
        v-for="(q, index) in questions"
        :key="q.id"
        class="question-card"
      >
        <div class="q-title">
          <span class="q-index">{{ index + 1 }}.</span>
          <span class="q-type">{{ questionType(Number(q.questionType)) }}</span>
          <span class="q-difficulty">{{
            difficulty(Number(q.difficulty))
          }}</span>
        </div>
        <div class="q-stem">{{ q.question }}</div>

        <!-- 单选题 -->
        <el-radio-group
          v-if="Number(q.questionType) === 0"
          v-model="answers[index]"
          class="options"
        >
          <el-radio
            v-for="opt in parseOptions(q)"
            :key="opt.code"
            :label="opt.code"
            class="option-item"
          >
            {{ opt.code }}. {{ opt.value }}
          </el-radio>
        </el-radio-group>

        <!-- 多选题 -->
        <el-checkbox-group
          v-else-if="Number(q.questionType) === 1"
          v-model="multiAnswers[index]"
          class="options"
        >
          <el-checkbox
            v-for="opt in parseOptions(q)"
            :key="opt.code"
            :label="opt.code"
            class="option-item"
          >
            {{ opt.code }}. {{ opt.value }}
          </el-checkbox>
        </el-checkbox-group>

        <!-- 判断题 -->
        <el-radio-group
          v-else-if="Number(q.questionType) === 2"
          v-model="answers[index]"
          class="options"
        >
          <el-radio
            v-for="opt in judgeOptions(q)"
            :key="opt.code"
            :label="opt.code"
            class="option-item"
          >
            {{ opt.code }}
          </el-radio>
        </el-radio-group>

        <!-- 简答 / 未知 -->
        <el-input
          v-else
          v-model="answers[index]"
          type="textarea"
          :rows="4"
          placeholder="请输入你的答案（简答题不做自动判分，交卷后可对照参考答案）"
        />
      </el-card>

      <div v-if="questions.length === 0 && !loading" class="empty">
        <el-empty description="试卷暂无题目" />
      </div>
    </template>

    <!-- 判分结果 -->
    <template v-else>
      <el-card class="result-card">
        <div class="result-summary">
          <div class="score">{{ result?.score }}</div>
          <div class="score-label">
            得分（客观题答对 {{ result?.correctNum }} 题）
          </div>
          <div class="stat-line">
            共 {{ result?.questionNum }} 题 · 答对 {{ result?.correctNum }} ·
            答错 {{ result?.wrongNum }} · 主观题 {{ result?.subjectiveNum }} 题
          </div>
          <el-button type="primary" @click="backToList">返回试卷列表</el-button>
        </div>
      </el-card>

      <el-card
        v-for="(d, index) in result?.detail"
        :key="d.questionId"
        class="review-card"
      >
        <div class="q-title">
          <span class="q-index">{{ index + 1 }}.</span>
          <span
            :class="[
              'q-result',
              d.isCorrect === true
                ? 'ok'
                : d.isCorrect === false
                ? 'bad'
                : 'sub',
            ]"
          >
            {{
              d.isCorrect === true
                ? '回答正确'
                : d.isCorrect === false
                ? '回答错误'
                : '主观题'
            }}
          </span>
          <span class="q-type">{{ questionType(Number(d.questionType)) }}</span>
        </div>
        <div class="q-stem">{{ d.question }}</div>
        <div class="your-answer">
          你的答案：{{ formatAnswer(d.userAnswer) || '（未作答）' }}
        </div>
        <div class="correct-answer">
          <div class="answer-header" @click="toggleReviewAnswer(d.questionId)">
            <span>参考答案</span>
            <el-icon>
              <ArrowUpBold v-if="reviewAnswerOpen[d.questionId]" />
              <ArrowDownBold v-else />
            </el-icon>
          </div>
          <div v-show="reviewAnswerOpen[d.questionId]" class="answer-body">
            <!-- eslint-disable vue/no-v-html -->
            <span
              v-html="
                formatAnswerWithValues(
                  d.questionType,
                  d.correctAnswer,
                  d.questionDetail,
                )
              "
            ></span>
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import queryString from 'query-string';
import { getPaperDetail, submitPaper } from '@/services';
import {
  questionType,
  difficulty,
  firstQueryValue,
  formatAnswerWithValues,
} from '@/utils';
import type { IQuestion, ISubmitPaperResult } from '@/types';
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue';

interface IPaperDetailInfo {
  paper_title?: string;
  [key: string]: unknown;
}

interface IOption {
  code: string;
  value?: string;
}

const router = useRouter();
const { paperID } = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);

const loading = ref(true);
const submitting = ref(false);
const submitted = ref(false);
const questions = ref<IQuestion[]>([]);
const paperInfo = ref<IPaperDetailInfo>({});
// 单选/判断/简答的答案（字符串），多选题单独用数组
const answers = ref<string[]>([]);
const multiAnswers = ref<string[][]>([]);
const result = ref<ISubmitPaperResult | null>(null);
// 判分结果里「参考答案」的展开状态（默认收起）
const reviewAnswerOpen = ref<Record<number, boolean>>({});
const toggleReviewAnswer = (id: number) => {
  reviewAnswerOpen.value = {
    ...reviewAnswerOpen.value,
    [id]: !reviewAnswerOpen.value[id],
  };
};

// 解析选择题/判断题选项 JSON
const parseOptions = (q: IQuestion): IOption[] => {
  try {
    const parsed = JSON.parse(q.questionDetail || '[]');
    if (Array.isArray(parsed)) {
      return parsed.map((item: { code?: string; value?: string }) => ({
        code: String(item?.code ?? ''),
        value: item?.value ?? '',
      }));
    }
  } catch {
    // ignore
  }
  return [];
};

// 判断题选项：优先用题目里存的，否则给默认的 正确/错误
const judgeOptions = (q: IQuestion): IOption[] => {
  const parsed = parseOptions(q);
  if (parsed.length > 0) return parsed;
  return [
    { code: '正确', value: '' },
    { code: '错误', value: '' },
  ];
};

const formatAnswer = (answer: string | undefined): string => {
  if (answer == null) return '';
  return String(answer);
};

const backToList = () => {
  router.push({ path: '/testPaper' });
};

const loadPaper = async () => {
  const paperId = firstQueryValue(paperID);
  if (!paperId) {
    loading.value = false;
    return;
  }
  try {
    const res = await getPaperDetail({ paperId, forTest: true });
    questions.value = res?.questions ?? [];
    paperInfo.value = (res?.paperInfo as IPaperDetailInfo) ?? {};
    answers.value = questions.value.map(() => '');
    multiAnswers.value = questions.value.map(() => []);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  const unanswered = questions.value.filter((q, index) => {
    if (Number(q.questionType) === 1) {
      return (multiAnswers.value[index] ?? []).length === 0;
    }
    return !answers.value[index]?.trim();
  });
  try {
    await ElMessageBox.confirm(
      unanswered.length > 0
        ? `还有 ${unanswered.length} 题未作答，确定交卷吗？`
        : '确定交卷吗？交卷后将自动判分。',
      '交卷确认',
      {
        confirmButtonText: '确定交卷',
        cancelButtonText: '继续检查',
        type: 'warning',
      },
    );
  } catch {
    return;
  }

  submitting.value = true;
  try {
    const answersPayload = questions.value.map((q, index) => {
      let userAnswer = answers.value[index] ?? '';
      if (Number(q.questionType) === 1) {
        userAnswer = (multiAnswers.value[index] ?? []).join('');
      }
      return { questionId: q.id, userAnswer };
    });
    const res = await submitPaper({
      paperId: firstQueryValue(paperID),
      answers: answersPayload,
    });
    result.value = res;
    submitted.value = true;
    ElMessage.success('交卷成功');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadPaper();
});
</script>

<style scoped>
.do-paper-container {
  width: 80%;
  margin: 0 auto;
  padding-bottom: 40px;
}
.header-card {
  margin-bottom: 20px;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.paper-title {
  margin: 0 0 8px 0;
}
.paper-meta {
  color: #909399;
  font-size: 14px;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.question-card {
  margin-bottom: 16px;
}
.q-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.q-index {
  font-size: 18px;
  font-weight: 700;
  margin-right: 10px;
}
.q-type {
  font-size: 12px;
  background-color: #f5f5f5;
  color: #333;
  padding: 2px 10px;
  border-radius: 4px;
  margin-right: 8px;
}
.q-difficulty {
  font-size: 12px;
  background-color: #909399;
  color: #fff;
  padding: 2px 10px;
  border-radius: 4px;
}
.q-stem {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
.options {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.option-item {
  margin-bottom: 8px;
  white-space: normal;
  height: auto;
}
.result-card {
  margin-bottom: 16px;
}
.result-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}
.score {
  font-size: 56px;
  font-weight: 700;
  color: #409eff;
  line-height: 1;
}
.score-label {
  margin-top: 8px;
  color: #606266;
}
.stat-line {
  margin: 12px 0 20px;
  color: #909399;
}
.review-card {
  margin-bottom: 16px;
}
.q-result {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 4px;
  margin-right: 8px;
}
.q-result.ok {
  background-color: #e1f3d8;
  color: #67c23a;
}
.q-result.bad {
  background-color: #fde2e2;
  color: #f56c6c;
}
.q-result.sub {
  background-color: #fdf6ec;
  color: #e6a23c;
}
.your-answer {
  margin: 8px 0;
  color: #606266;
}
.correct-answer {
  margin: 8px 0;
  color: #606266;
}
.answer-header {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #409eff;
  font-size: 14px;
  user-select: none;
}
.answer-body {
  margin-top: 8px;
  padding: 10px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.empty {
  margin-top: 40px;
}
</style>
