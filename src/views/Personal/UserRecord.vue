<template>
  <div v-loading="loading" class="user-record" element-loading-text="加载中...">
    <!-- 答题统计 -->
    <div class="stats">
      <el-card v-for="item in statCards" :key="item.label" class="stat-card">
        <div class="stat-value" :style="{ color: item.color }">
          {{ item.value }}
        </div>
        <div class="stat-label">{{ item.label }}</div>
      </el-card>
    </div>

    <!-- 学习报告 -->
    <el-card
      v-if="stats.subjectStats?.length || stats.recentScores?.length"
      class="report-card"
    >
      <template #header>学习报告</template>
      <div class="report-body">
        <div class="report-section">
          <h4 class="report-title">科目正确率</h4>
          <div
            v-for="s in stats.subjectStats"
            :key="s.subjectID"
            class="subject-row"
          >
            <span class="subject-name">{{ s.subjectName }}</span>
            <el-progress
              :percentage="s.rate"
              :stroke-width="14"
              class="subject-progress"
            />
            <span class="subject-rate">{{ s.correct_num }}/{{ s.total }}</span>
          </div>
          <el-empty
            v-if="!stats.subjectStats?.length"
            :image-size="60"
            description="暂无科目统计"
          />
        </div>

        <div class="report-section">
          <h4 class="report-title">最近得分趋势</h4>
          <div
            v-if="stats.recentScores?.length"
            ref="trendChart"
            class="trend-chart"
          ></div>
          <el-empty v-else :image-size="60" description="暂无答题记录" />
        </div>
      </div>
    </el-card>

    <!-- 答题记录列表 -->
    <el-card>
      <template #header>
        <div class="record-header">
          <span>答题记录</span>
          <span v-if="records.length" class="record-tip">
            满分 100，按题数动态计分（简答题由 AI 批改后计入）
          </span>
        </div>
      </template>
      <el-table v-if="records.length" :data="records" stripe>
        <el-table-column prop="paper_title" label="试卷" min-width="200">
          <template #default="{ row }">
            {{ row.paper_title || `试卷 #${row.paper_id}` }}
          </template>
        </el-table-column>
        <el-table-column label="得分" width="110" align="center">
          <template #default="{ row }">
            <span :class="Number(row.score) >= 60 ? 'c-ok' : 'c-bad'">
              {{ formatScore(row.score) }} 分
            </span>
          </template>
        </el-table-column>
        <el-table-column label="对 / 错 / 主观" width="160" align="center">
          <template #default="{ row }">
            <span class="c-ok">{{ row.correct_num }}</span>
            /
            <span class="c-bad">{{ row.wrong_num }}</span>
            /
            <span class="c-sub">{{ row.subjective_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="正确率" width="100" align="center">
          <template #default="{ row }">
            {{ rowRate(row) }}
          </template>
        </el-table-column>
        <el-table-column label="交卷时间" min-width="170" align="center">
          <template #default="{ row }">
            {{ transitionTime(row.ctime) }}
          </template>
        </el-table-column>
      </el-table>
      <el-empty
        v-else
        :image-size="200"
        description="还没有答题记录，去做一套试卷吧"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getAnswerStats, getMyPaperRecords } from '@/services';
import { transitionTime } from '@/utils';
import { init, use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import type { IAnswerStats, IPaperRecord } from '@/types';

use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

const loading = ref(true);
const stats = ref<IAnswerStats>({
  attempt_num: 0,
  question_num: 0,
  correct_num: 0,
  wrong_num: 0,
  subjective_num: 0,
  avg_score: 0,
  correct_rate: 0,
});
const records = ref<IPaperRecord[]>([]);
const trendChart = ref<HTMLElement>();
let trendInstance: ReturnType<typeof init> | null = null;

const statCards = computed(() => [
  { label: '答题次数', value: stats.value.attempt_num, color: '#409eff' },
  {
    label: '答题正确率',
    value: `${stats.value.correct_rate}%`,
    color: '#67c23a',
  },
  { label: '平均得分', value: stats.value.avg_score, color: '#f56c6c' },
]);

const rowRate = (row: unknown): string => {
  const r = row as IPaperRecord;
  const objective = Number(r.correct_num) + Number(r.wrong_num);
  if (objective <= 0) return '-';
  return `${Math.round((Number(r.correct_num) / objective) * 100)}%`;
};

// 得分显示：整数不带小数，非整数保留 1 位
const formatScore = (v: unknown): string => {
  const n = Number(v);
  if (!Number.isFinite(n)) return '0';
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
};

// 最近得分折线图
const renderTrendChart = () => {
  const scores = stats.value.recentScores ?? [];
  if (!trendChart.value || scores.length === 0) return;
  if (!trendInstance) trendInstance = init(trendChart.value);
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: scores.map((s, i) => `第${i + 1}次`),
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        name: '得分',
        type: 'line',
        smooth: true,
        data: scores.map((s) => s.score),
        areaStyle: { opacity: 0.15 },
        itemStyle: { color: '#409eff' },
      },
    ],
  };
  trendInstance.setOption(option);
};

onMounted(async () => {
  try {
    const [statsRes, recordsRes] = await Promise.all([
      getAnswerStats(),
      getMyPaperRecords(),
    ]);
    stats.value = statsRes ?? stats.value;
    records.value = recordsRes ?? [];
  } finally {
    loading.value = false;
  }
  await nextTick();
  renderTrendChart();
  window.addEventListener('resize', renderTrendChart);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderTrendChart);
  trendInstance?.dispose();
  trendInstance = null;
});
</script>

<style scoped>
.user-record {
  width: 100%;
  /* margin-left: 20px; */
}

.stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  margin-top: 10px;
  color: #909399;
}

.report-card {
  margin-bottom: 16px;
}

.report-body {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.report-section {
  flex: 1;
  min-width: 280px;
}

.report-title {
  margin: 0 0 16px;
}

.subject-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.subject-name {
  width: 100px;
  flex-shrink: 0;
  color: #606266;
}

.subject-progress {
  flex: 1;
}

.subject-rate {
  width: 60px;
  text-align: right;
  color: #909399;
  flex-shrink: 0;
}

.trend-chart {
  width: 100%;
  height: 220px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-tip {
  font-size: 12px;
  color: #909399;
}

.c-ok {
  color: #67c23a;
}

.c-bad {
  color: #f56c6c;
}

.c-sub {
  color: #e6a23c;
}
</style>
