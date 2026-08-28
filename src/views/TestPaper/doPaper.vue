<template>
  <div v-loading="loading" class="do-paper-container">
    <!-- 试卷标题 + 操作 -->
    <el-card class="header-card">
      <div class="header-row">
        <div>
          <h2 class="paper-title">{{ paperInfo?.paper_title }}</h2>
          <div class="paper-meta">
            共 {{ questions.length }} 题 · 单选/多选/判断自动判分，简答题由 AI
            智能批改
          </div>
        </div>
        <div class="header-actions">
          <el-button @click="backToList">返回</el-button>
          <el-button v-if="!submitted" type="primary" :loading="submitting" @click="handleSubmit">交卷</el-button>
        </div>
      </div>
    </el-card>

    <!-- 答题区 -->
    <template v-if="!submitted">
      <el-card v-for="(q, index) in questions" :key="q.id" class="question-card">
        <div class="q-title">
          <span class="q-index">{{ index + 1 }}.</span>
          <span class="q-type">{{ questionType(Number(q.questionType)) }}</span>
          <span :class="difficultyClass(q.difficulty)">{{
            difficulty(Number(q.difficulty))
          }}</span>
          <span class="q-score">{{ calcQuestionScore(index) }} 分</span>
        </div>
        <div class="q-stem">{{ q.question }}</div>

        <!-- 单选题 -->
        <el-radio-group v-if="Number(q.questionType) === 0" v-model="answers[index]" class="options">
          <el-radio v-for="opt in parseOptions(q)" :key="opt.code" :label="opt.code" class="option-item">
            {{ opt.code }}. {{ opt.value }}
          </el-radio>
        </el-radio-group>

        <!-- 多选题 -->
        <el-checkbox-group v-else-if="Number(q.questionType) === 1" v-model="multiAnswers[index]" class="options">
          <el-checkbox v-for="opt in parseOptions(q)" :key="opt.code" :label="opt.code" class="option-item">
            {{ opt.code }}. {{ opt.value }}
          </el-checkbox>
        </el-checkbox-group>

        <!-- 判断题 -->
        <el-radio-group v-else-if="Number(q.questionType) === 2" v-model="answers[index]" class="options">
          <el-radio v-for="opt in judgeOptions(q)" :key="opt.code" :label="opt.code" class="option-item">
            {{ opt.code }}
          </el-radio>
        </el-radio-group>

        <!-- 简答题输入区提示 -->
        <el-input v-else v-model="answers[index]" type="textarea" :rows="4" placeholder="请输入你的答案（简答题交卷后由 AI 智能批改）" />
      </el-card>

      <div v-if="questions.length === 0 && !loading" class="empty">
        <el-empty description="试卷暂无题目" />
      </div>
    </template>

    <!-- 判分结果 -->
    <template v-else>
      <!-- AI 批改进度（有简答题且未全部批完时显示） -->
      <el-card v-if="aiPendingList.length > 0" class="ai-progress-card">
        <div class="ai-progress">
          <div class="ai-spinner">
            <span class="ai-ring"></span>
            <span class="ai-core">AI</span>
          </div>
          <div class="ai-progress-info">
            <div class="ai-progress-title">
              AI 正在批改简答题（{{ aiDoneCount }} / {{ aiTotalCount }}）
            </div>
            <el-progress :percentage="aiTotalCount ? (aiDoneCount / aiTotalCount) * 100 : 0
              " :stroke-width="10" :show-text="false" class="ai-progress-bar" />
            <div class="ai-progress-status">{{ aiStatusText }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="result-card">
        <div class="result-summary">
          <div class="score">{{ result?.score }}</div>
          <div class="score-label">
            得分（满分 100，按题数动态计分）
          </div>
          <div class="stat-line">
            共 {{ result?.questionNum }} 题 · 满分 100 ·
            答对 {{ result?.correctNum }} · 答错 {{ result?.wrongNum }}
          </div>
          <el-button type="primary" @click="backToList">返回试卷列表</el-button>
        </div>
      </el-card>

      <el-card v-for="(d, index) in result?.detail" :key="d.questionId" class="review-card">
        <div class="q-title">
          <span class="q-index">{{ index + 1 }}.</span>
          <span :class="[
            'q-result',
            d.isCorrect === 1
              ? 'ok'
              : d.isCorrect === 0
                ? 'bad'
                : aiJudging[d.questionId]
                  ? 'ai-judging'
                  : aiResults[d.questionId]
                    ? aiResults[d.questionId].isCorrect
                      ? 'ok'
                      : 'bad'
                    : 'sub',
          ]">
            <template v-if="d.isCorrect !== null">
              {{ d.isCorrect === 1 ? '回答正确' : '回答错误' }}
            </template>
            <template v-else-if="aiJudging[d.questionId]"> AI 批改中 </template>
            <template v-else-if="aiResults[d.questionId]">
              AI 评分
              {{
                earnedScore(
                  aiResults[d.questionId].score || 0,
                  maxScoreMap[d.questionId],
                )
              }}
              分
            </template>
            <template v-else>主观题</template>
          </span>
          <span class="q-score">
            <template v-if="d.isCorrect !== null">
              {{ d.score ?? 0 }} / {{ maxScoreMap[d.questionId] }} 分
            </template>
            <template v-else-if="aiResults[d.questionId]">
              {{
                earnedScore(
                  aiResults[d.questionId].score || 0,
                  maxScoreMap[d.questionId],
                )
              }}
              / {{ maxScoreMap[d.questionId] }} 分
            </template>
            <template v-else>
              满分 {{ maxScoreMap[d.questionId] }} 分
            </template>
          </span>
          <span class="q-type">{{ questionType(Number(d.questionType)) }}</span>
        </div>
        <div class="q-stem">{{ d.question }}</div>
        <div class="your-answer">
          你的答案：{{ formatAnswer(d.userAnswer) || '（未作答）' }}
        </div>

        <!-- 该题正在 AI 批改：行内动画 -->
        <div v-if="aiJudging[d.questionId]" class="ai-judging-box">
          <span class="ai-dot-flip"> <i></i><i></i><i></i> </span>
          <span class="ai-judging-text">{{ aiStatusText }}</span>
        </div>

        <!-- AI 批改结果：分数 + 评语 -->
        <div v-if="aiResults[d.questionId]" class="ai-result-box">
          <div class="ai-result-header">
            <span :class="[
              'ai-score',
              aiResults[d.questionId].isCorrect ? 'pass' : 'fail',
            ]">
              {{
                earnedScore(
                  aiResults[d.questionId].score || 0,
                  maxScoreMap[d.questionId],
                )
              }}
              分
            </span>
            <span class="ai-verdict">
              本题满分 {{ maxScoreMap[d.questionId] }} 分 · 正确率
              {{ aiResults[d.questionId].score }}%
            </span>
          </div>
          <div class="ai-comment">{{ aiResults[d.questionId].comment }}</div>
        </div>

        <div class="correct-answer">
          <div class="answer-header">
            <span>参考答案</span>
          </div>
          <div class="answer-body">
            <!-- eslint-disable vue/no-v-html -->
            <span v-html="formatAnswerWithValues(
              d.questionType,
              d.correctAnswer,
              d.questionDetail,
            )
              "></span>
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import queryString from 'query-string';
import { getPaperDetail, submitPaper, aiJudgeAnswer } from '@/services';
import { setWaterMark, removeWatermark } from '@/utils/waterMark';
import {parseHashQuery, questionType,
  difficulty,
  firstQueryValue,
  formatAnswerWithValues,
} from '@/utils';
import type { IQuestion, ISubmitPaperResult, IAiJudgeResult } from '@/types';

interface IPaperDetailInfo {
  paper_title?: string;
  [key: string]: unknown;
}

interface IOption {
  code: string;
  value?: string;
}

const router = useRouter();
const store = useStore();
const { paperID } = parseHashQuery();

// 当前登录用户（考试水印显示真实身份，用于追溯截图来源）
const username = computed(() => store.state.userData?.username || 'tkdog');
const userId = computed(() => store.state.userData?.userId ?? '');

// 切屏次数统计（防作弊：离开页面即计数并告警）
const switchCount = ref(0);

const loading = ref(true);
const submitting = ref(false);
const submitted = ref(false);
const questions = ref<IQuestion[]>([]);
// 难度权重：简单(0)=1、中等(1)=2、困难(2)=3
const difficultyWeight = (difficulty: number) =>
  difficulty === 2 ? 3 : difficulty === 1 ? 2 : 1;
// 按难度权重动态分配每题满分（整数、总和=100，最大余数法，与后端一致）
const questionScores = computed(() => {
  const qs = questions.value;
  const weights = qs.map((q) => difficultyWeight(Number(q.difficulty)));
  const totalWeight = weights.reduce((s, w) => s + w, 0) || qs.length || 1;
  const ideals = weights.map((w) => (100 * w) / totalWeight);
  const bases = ideals.map((v) => Math.floor(v));
  let remainder = 100 - bases.reduce((s, b) => s + b, 0);
  const order = ideals
    .map((v, i) => ({ i, frac: v - bases[i] }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remainder; k++) {
    bases[order[k].i] += 1;
  }
  return bases;
});
const calcQuestionScore = (index: number) =>
  questionScores.value[index] ?? 0;
// 难度标签配色：简单绿、中等橙、困难红
const difficultyClass = (difficulty: number | string) => {
  const d = Number(difficulty);
  if (d === 2) return 'q-difficulty hard';
  if (d === 1) return 'q-difficulty medium';
  return 'q-difficulty easy';
};
const paperInfo = ref<IPaperDetailInfo>({});
// 单选/判断/简答的答案（字符串），多选题单独用数组
const answers = ref<string[]>([]);
const multiAnswers = ref<string[][]>([]);
const result = ref<ISubmitPaperResult | null>(null);

// ===== AI 批改简答题 =====
// 各题 AI 批改结果（questionId -> 结果）
const aiResults = ref<Record<number, IAiJudgeResult>>({});
// 各题批改中状态
const aiJudging = ref<Record<number, boolean>>({});
// 待批改的简答题（isCorrect === null 的明细项）
const aiPendingList = ref<Array<{ questionId: number; userAnswer: string }>>(
  [],
);
const aiTotalCount = ref(0);
const aiDoneCount = computed(
  () => aiTotalCount.value - aiPendingList.value.length,
);
// 每题满分（整数）：后端按题数整数分配，从 detail 里取
const maxScoreMap = computed(() => {
  const map: Record<number, number> = {};
  (result.value?.detail ?? []).forEach((d) => {
    map[d.questionId] = d.maxScore ?? 0;
  });
  return map;
});
// 把 AI 的 0-100 分折算成该题整数得分
const earnedScore = (aiScore: number, maxScore: number) => {
  return Math.round((aiScore / 100) * maxScore);
};
// 轮播的批改状态文案（动画感）
const aiStatusTexts = [
  '正在解析题目考点…',
  '正在对比参考答案…',
  '正在分析你的作答要点…',
  '正在计算得分…',
  '正在生成评语…',
];
const aiStatusIndex = ref(0);
const aiStatusText = computed(
  () => aiStatusTexts[aiStatusIndex.value % aiStatusTexts.length],
);
let aiStatusTimer: ReturnType<typeof setInterval> | null = null;
let aiStopped = false;

const startAiStatusLoop = () => {
  if (aiStatusTimer) return;
  aiStatusTimer = setInterval(() => {
    aiStatusIndex.value += 1;
  }, 1800);
};
const stopAiStatusLoop = () => {
  if (aiStatusTimer) {
    clearInterval(aiStatusTimer);
    aiStatusTimer = null;
  }
};

// 交卷后自动逐题批改简答题（串行，避免并发打爆大模型接口）
const runAiJudging = async () => {
  const pending = (result.value?.detail ?? []).filter(
    (d) => d.isCorrect === null,
  );
  if (pending.length === 0) return;
  aiTotalCount.value = pending.length;
  aiPendingList.value = pending.map((d) => ({
    questionId: d.questionId,
    userAnswer: d.userAnswer ?? '',
  }));
  startAiStatusLoop();

  while (aiPendingList.value.length > 0 && !aiStopped) {
    const item = aiPendingList.value[0];
    aiJudging.value = { ...aiJudging.value, [item.questionId]: true };
    try {
      const res = await aiJudgeAnswer({
        questionId: item.questionId,
        userAnswer: item.userAnswer,
        recordId: result.value?.recordId,
      });
      if (res?.available) {
        aiResults.value = {
          ...aiResults.value,
          [item.questionId]: res,
        };
        // AI 判分已落库，同步刷新整卷得分/对错/主观题统计
        if (res.stats && result.value) {
          result.value = {
            ...result.value,
            score: res.stats.score,
            correctNum: res.stats.correctNum,
            wrongNum: res.stats.wrongNum,
            subjectiveNum: res.stats.subjectiveNum,
          };
        }
      } else if (res?.message) {
        ElMessage.warning(res.message);
        // AI 不可用时整批停止（清空队列隐藏进度卡），避免每题重复弹提示
        aiPendingList.value = [];
        break;
      }
    } catch {
      // 单题失败：跳过继续批后面的题，不打断整体流程
    } finally {
      aiJudging.value = { ...aiJudging.value, [item.questionId]: false };
      aiPendingList.value = aiPendingList.value.slice(1);
    }
  }

  stopAiStatusLoop();
  if (!aiStopped && Object.keys(aiResults.value).length > 0) {
    ElMessage.success('AI 批改完成');
  }
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
    // 交卷后自动用 AI 批改简答题（带动画）
    runAiJudging();
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadPaper();
  // 考试页启用带守护的水印：水印携带用户名/ID（可追溯），
  // MutationObserver 防删除，切屏时计数并弹窗告警
  setWaterMark(username.value, `ID:${userId.value}`, {
    onScreenSwitch: () => {
      switchCount.value += 1;
      ElMessage.warning(
        `检测到离开考试页面（第 ${switchCount.value} 次），请诚信作答`,
      );
    },
  });
});

onUnmounted(() => {
  // 离开页面：停止 AI 批改循环
  aiStopped = true;
  stopAiStatusLoop();
  // 离开考试页：移除考试水印及守护，恢复全局默认水印
  removeWatermark();
  setWaterMark('tkdog', '面试题库');
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
  color: #fff;
  padding: 2px 10px;
  border-radius: 4px;
}

.q-difficulty.easy {
  background-color: #67c23a;
}

.q-difficulty.medium {
  background-color: #e6a23c;
}

.q-difficulty.hard {
  background-color: #f56c6c;
}

.q-score {
  font-size: 12px;
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 4px;
  margin-right: 8px;
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
  color: #409eff;
  font-size: 14px;
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

/* ===== AI 批改进度卡 ===== */
.ai-progress-card {
  margin-bottom: 16px;
}

.ai-progress {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 8px 4px;
}

.ai-spinner {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.ai-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg,
      #409eff 0%,
      #79bbff 25%,
      transparent 60%);
  animation: ai-spin 1.1s linear infinite;
  -webkit-mask: radial-gradient(circle, transparent 60%, #000 61%);
  mask: radial-gradient(circle, transparent 60%, #000 61%);
}

@keyframes ai-spin {
  to {
    transform: rotate(360deg);
  }
}

.ai-core {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #409eff;
  letter-spacing: 1px;
  animation: ai-pulse 1.8s ease-in-out infinite;
}

@keyframes ai-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}

.ai-progress-info {
  flex: 1;
}

.ai-progress-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.ai-progress-bar {
  margin-bottom: 6px;
}

.ai-progress-status {
  color: #909399;
  font-size: 13px;
  min-height: 18px;
  animation: ai-fade 1.8s ease-in-out infinite;
}

@keyframes ai-fade {
  0% {
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.4;
  }
}

/* ===== 题卡内的批改状态 ===== */
.q-result.ai-judging {
  background-color: #e8f0ff;
  color: #409eff;
  animation: ai-pulse 1.2s ease-in-out infinite;
}

.ai-judging-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  padding: 10px 12px;
  background-color: #f0f6ff;
  border-radius: 6px;
}

.ai-judging-text {
  color: #409eff;
  font-size: 13px;
}

/* 三点跳动动画 */
.ai-dot-flip {
  display: inline-flex;
  gap: 4px;
}

.ai-dot-flip i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #409eff;
  animation: ai-bounce 1s ease-in-out infinite;
}

.ai-dot-flip i:nth-child(2) {
  animation-delay: 0.15s;
}

.ai-dot-flip i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes ai-bounce {

  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  40% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* ===== AI 批改结果 ===== */
.ai-result-box {
  margin: 10px 0;
  padding: 12px 14px;
  background-color: #f8fafd;
  border-left: 3px solid #409eff;
  border-radius: 4px;
}

.ai-result-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}

.ai-score {
  font-size: 22px;
  font-weight: 700;
}

.ai-score.pass {
  color: #67c23a;
}

.ai-score.fail {
  color: #f56c6c;
}

.ai-verdict {
  font-size: 13px;
  color: #909399;
}

.ai-comment {
  color: #606266;
  font-size: 14px;
  line-height: 1.7;
}
</style>
