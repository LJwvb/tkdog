<template>
  <div class="card">
    <div ref="chart1" class="zhexian"></div>
    <div ref="chart2" class="clock"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
import type { GaugeChart, GaugeSeriesOption } from 'echarts/charts';
type EChartsOption = echarts.ComposeOption<GaugeSeriesOption>;

const chart1 = ref();
const chart2 = ref();

// 一进来就调用
onMounted(() => {
  init();
});

const init = () => {
  const myChart1 = echarts.init(chart1.value);
  const myChart2 = echarts.init(chart2.value);

  myChart1.setOption(option1);
  myChart2.setOption(option2);

  setInterval(function () {
    const date = new Date();
    const second = date.getSeconds();
    const minute = date.getMinutes() + second / 60;
    const hour = (date.getHours() % 12) + minute / 60;
    option2.animationDurationUpdate = 300;
    myChart2.setOption<echarts.EChartsOption>({
      series: [
        {
          name: 'hour',
          animation: hour !== 0,
          data: [{ value: hour }],
        },
        {
          name: 'minute',
          animation: minute !== 0,
          data: [{ value: minute }],
        },
        {
          animation: second !== 0,
          name: 'second',
          data: [{ value: second }],
        },
      ],
    });
  }, 1000);
};
const option1 = {
  title: {
    text: `近七日数据统计(截至昨天${
      new Date().getMonth() + 1
    }月${new Date().getDate()}日)`,
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['用户数', '访问量', '上传题目量', '组卷量'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [
      `${new Date().getMonth() + 1}月${new Date().getDate() - 6}日`,
      `${new Date().getMonth() + 1}月${new Date().getDate() - 5}日`,
      `${new Date().getMonth() + 1}月${new Date().getDate() - 4}日`,
      `${new Date().getMonth() + 1}月${new Date().getDate() - 3}日`,
      `${new Date().getMonth() + 1}月${new Date().getDate() - 2}日`,
      `${new Date().getMonth() + 1}月${new Date().getDate() - 1}日`,
      `${new Date().getMonth() + 1}月${new Date().getDate()}日`,
    ],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '用户数',
      type: 'line',
      stack: 'Total',
      data: [0, 2, 4, 7, 23, 25, 27],
    },
    {
      name: '访问量',
      type: 'line',
      stack: 'Total',
      data: [0, 2, 2, 5, 3, 20, 32],
    },
    {
      name: '上传题目量',
      type: 'line',
      stack: 'Total',
      data: [0, 0, 2, 2, 3, 5, 7],
    },
    {
      name: '组卷量',
      type: 'line',
      stack: 'Total',
      data: [0, 0, 0, 0, 0, 2, 4],
    },
  ],
};
const option2: EChartsOption = {
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
          if (value === 0) {
            return '';
          }
          return value + '';
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
      detail: {
        show: false,
      },
      title: {
        offsetCenter: [0, '30%'],
      },
      data: [
        {
          value: 0,
        },
      ],
    },
    {
      name: 'minute',
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 60,
      clockwise: true,
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
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
      detail: {
        show: false,
      },
      title: {
        offsetCenter: ['0%', '-40%'],
      },
      data: [
        {
          value: 0,
        },
      ],
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
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
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
      detail: {
        show: false,
      },
      title: {
        offsetCenter: ['0%', '-40%'],
      },
      data: [
        {
          value: 0,
        },
      ],
    },
  ],
};
</script>
<style scoped>
.card {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}
.zhexian {
  width: 1000px;
  height: 400px;
}
.clock {
  width: 400px;
  height: 400px;
}
</style>
