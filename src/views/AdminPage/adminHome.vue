<template>
  <div class="home-container">
    <!-- 总量统计卡片 -->
    <div class="stat-cards">
      <el-card v-for="card in statCards" :key="card.label" class="stat-card">
        <div class="stat-value">{{ card.value }}</div>
        <div class="stat-label">{{ card.label }}</div>
      </el-card>
    </div>

    <!-- 近七日趋势 + 时钟 -->
    <div class="chart-row">
      <div ref="chart1" class="chart-box line-box"></div>
      <div ref="chart2" class="chart-box clock-box"></div>
    </div>

    <!-- 科目 / 题型分布 -->
    <div class="chart-row">
      <div ref="chart3" class="chart-box pie-box"></div>
      <div ref="chart4" class="chart-box pie-box"></div>
    </div>

    <!-- 最近上传题目 / 最近试卷 -->
    <div class="recent-row">
      <el-card class="recent-card">
        <template #header>最近上传题目</template>
        <div v-for="q in stats?.recentUploads" :key="q.id" class="recent-item">
          <div class="recent-title">{{ q.question }}</div>
          <div class="recent-meta">
            {{ q.creator }} · {{ transitionTime(q.addDate) }}
          </div>
        </div>
        <el-empty
          v-if="!stats?.recentUploads?.length"
          :image-size="60"
          description="暂无题目"
        />
      </el-card>
      <el-card class="recent-card">
        <template #header>最近试卷</template>
        <div
          v-for="p in stats?.recentPapers"
          :key="p.paper_id"
          class="recent-item"
        >
          <div class="recent-title">{{ p.paper_title }}</div>
          <div class="recent-meta">
            {{ p.author }} · {{ transitionTime(p.ctime) }}
          </div>
        </div>
        <el-empty
          v-if="!stats?.recentPapers?.length"
          :image-size="60"
          description="暂无试卷"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, nextTick } from 'vue';
import { init, use } from 'echarts/core';
import { LineChart, GaugeChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import { getAdminStatistics } from '@/services';
import { transitionTime } from '@/utils';
import type { IAdminStatistics } from '@/types';

use([
  LineChart,
  GaugeChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
]);

const chart1 = ref<HTMLElement>();
const chart2 = ref<HTMLElement>();
const chart3 = ref<HTMLElement>();
const chart4 = ref<HTMLElement>();

const chartInstances: ReturnType<typeof init>[] = [];
let clockTimer: ReturnType<typeof setInterval> | null = null;

const stats = ref<IAdminStatistics | null>(null);

const statCards = computed(() => {
  const t = stats.value?.totals;
  return [
    { label: '总用户数', value: t?.users ?? 0 },
    { label: '总题目数', value: t?.questions ?? 0 },
    { label: '总试卷数', value: t?.papers ?? 0 },
    { label: '总答题次数', value: t?.answers ?? 0 },
    { label: '总评论数', value: t?.comments ?? 0 },
    { label: '待处理反馈', value: t?.pendingFeedback ?? 0 },
  ];
});

const formatDay = (date: string): string => {
  const [, m, d] = date.split('-');
  return `${Number(m)}月${Number(d)}日`;
};

const buildLineOption = (s: IAdminStatistics): EChartsOption => ({
  title: {
    text: '近七日数据统计',
    subtext: `截至 ${s.days[s.days.length - 1] ?? ''}`,
  },
  tooltip: { trigger: 'axis' },
  legend: { data: ['新增用户', '上传题目', '组卷', '答题'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: s.days.map(formatDay),
  },
  yAxis: { type: 'value', minInterval: 1 },
  series: [
    {
      name: '新增用户',
      type: 'line',
      smooth: true,
      data: s.sevenDays.newUsers.map((x) => x.value),
    },
    {
      name: '上传题目',
      type: 'line',
      smooth: true,
      data: s.sevenDays.uploads.map((x) => x.value),
    },
    {
      name: '组卷',
      type: 'line',
      smooth: true,
      data: s.sevenDays.papers.map((x) => x.value),
    },
    {
      name: '答题',
      type: 'line',
      smooth: true,
      data: s.sevenDays.answers.map((x) => x.value),
    },
  ],
});

const buildPieOption = (
  title: string,
  data: Array<{ name: string; value: number }>,
): EChartsOption => ({
  title: { text: title, left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', left: 'left', top: 'middle' },
  series: [
    {
      name: title,
      type: 'pie',
      radius: ['30%', '65%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' },
      },
      data,
    },
  ],
});

const clockOption: EChartsOption = {
  series: [
    {
      name: 'hour',
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 12,
      splitNumber: 12,
      clockwise: true,
      axisLine: {
        lineStyle: {
          width: 10,
          color: [[1, 'rgba(0,0,0,0.7)']],
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 15,
        },
      },
      splitLine: {
        lineStyle: {
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 3,
          shadowOffsetX: 1,
          shadowOffsetY: 2,
        },
      },
      axisLabel: {
        fontSize: 25,
        distance: 25,
        formatter: function (value) {
          return value === 0 ? '' : value + '';
        },
      },
      pointer: {
        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
        width: 12,
        length: '55%',
        offsetCenter: [0, '8%'],
        itemStyle: {
          color: '#C0911F',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 8,
          shadowOffsetX: 2,
          shadowOffsetY: 4,
        },
      },
      detail: { show: false },
      title: { offsetCenter: [0, '30%'] },
      data: [{ value: 0 }],
    },
    {
      name: 'minute',
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 60,
      clockwise: true,
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      pointer: {
        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
        width: 8,
        length: '70%',
        offsetCenter: [0, '8%'],
        itemStyle: {
          color: '#C0911F',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 8,
          shadowOffsetX: 2,
          shadowOffsetY: 4,
        },
      },
      anchor: {
        show: true,
        size: 20,
        showAbove: false,
        itemStyle: {
          borderWidth: 15,
          borderColor: '#C0911F',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 8,
          shadowOffsetX: 2,
          shadowOffsetY: 4,
        },
      },
      detail: { show: false },
      title: { offsetCenter: ['0%', '-40%'] },
      data: [{ value: 0 }],
    },
    {
      name: 'second',
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 60,
      animationEasingUpdate: 'bounceOut',
      clockwise: true,
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      pointer: {
        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
        width: 4,
        length: '85%',
        offsetCenter: [0, '8%'],
        itemStyle: {
          color: '#C0911F',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 8,
          shadowOffsetX: 2,
          shadowOffsetY: 4,
        },
      },
      anchor: {
        show: true,
        size: 15,
        showAbove: true,
        itemStyle: {
          color: '#C0911F',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 8,
          shadowOffsetX: 2,
          shadowOffsetY: 4,
        },
      },
      detail: { show: false },
      title: { offsetCenter: ['0%', '-40%'] },
      data: [{ value: 0 }],
    },
  ],
};

const initCharts = async () => {
  try {
    stats.value = await getAdminStatistics();
  } catch {
    stats.value = null;
  }

  if (chart1.value) {
    const c = init(chart1.value);
    chartInstances.push(c);
    if (stats.value) c.setOption(buildLineOption(stats.value));
  }
  if (chart2.value) {
    const c = init(chart2.value);
    chartInstances.push(c);
    c.setOption(clockOption);
  }
  if (chart3.value) {
    const c = init(chart3.value);
    chartInstances.push(c);
    if (stats.value) {
      c.setOption(buildPieOption('题目科目分布', stats.value.subjectDist));
    }
  }
  if (chart4.value) {
    const c = init(chart4.value);
    chartInstances.push(c);
    if (stats.value) {
      c.setOption(buildPieOption('题型分布', stats.value.typeDist));
    }
  }

  // 初始化后再按实际容器尺寸重算一次，避免首屏布局未稳定导致图表宽度异常
  nextTick(() => {
    chartInstances.forEach((c) => c.resize());
  });

  // 时钟走动
  const clockChart = chartInstances[1];
  if (clockChart) {
    clockTimer = setInterval(() => {
      const date = new Date();
      const second = date.getSeconds();
      const minute = date.getMinutes() + second / 60;
      const hour = (date.getHours() % 12) + minute / 60;
      clockChart.setOption<EChartsOption>({
        series: [
          { name: 'hour', animation: hour !== 0, data: [{ value: hour }] },
          {
            name: 'minute',
            animation: minute !== 0,
            data: [{ value: minute }],
          },
          {
            name: 'second',
            animation: second !== 0,
            data: [{ value: second }],
          },
        ],
      });
    }, 1000);
  }
};

const resizeCharts = () => {
  chartInstances.forEach((c) => c.resize());
};

onMounted(() => {
  initCharts();
  window.addEventListener('resize', resizeCharts);
});

onBeforeUnmount(() => {
  if (clockTimer) {
    clearInterval(clockTimer);
    clockTimer = null;
  }
  window.removeEventListener('resize', resizeCharts);
  chartInstances.forEach((c) => c.dispose());
});
</script>

<style scoped>
.home-container {
  width: 100%;
  padding: 20px;
}
.stat-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}
.stat-card {
  flex: 1;
  min-width: 140px;
  text-align: center;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #409eff;
}
.stat-label {
  margin-top: 6px;
  font-size: 14px;
  color: #909399;
}
.chart-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}
.chart-box {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 10px;
}
.line-box {
  flex: 2;
  min-width: 500px;
  height: 400px;
}
.clock-box {
  flex: 1;
  min-width: 300px;
  height: 400px;
}
.pie-box {
  flex: 1;
  min-width: 320px;
  height: 360px;
}

.recent-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.recent-card {
  flex: 1;
  min-width: 320px;
}

.recent-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-title {
  color: #303133;
  font-size: 14px;
  word-break: break-word;
}

.recent-meta {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

/* 移动端：图表纵向堆叠、宽度自适应，避免 min-width 撑破布局导致图表溢出/不显示 */
@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }

  .stat-cards {
    flex-direction: column;
  }

  .chart-row {
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .line-box,
  .clock-box,
  .pie-box {
    flex: none;
    width: 100%;
    min-width: 0;
    height: 300px;
  }
}
</style>
