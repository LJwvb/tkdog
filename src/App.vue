<template>
  <div>
    <router-view v-if="isStandalonePage" />
    <div v-else class="tkdog-container">
      <!-- 固定导航栏 -->
      <div class="home-nav">
        <NavBar></NavBar>
      </div>
      <!-- 动态页面主体 -->
      <div class="home-body">
        <router-view />
      </div>
      <!-- 尾部-->
      <div class="home-bottom">
        <BottomBar></BottomBar>
      </div>
      <TestBasket />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/views/NavBar/index.vue';
import BottomBar from '@/views/BottomBar/index.vue';
import TestBasket from '@/components/TestBasket/index.vue';
import { setWaterMark } from './utils/waterMark';

const route = useRoute();
// 登录页 / 管理员登录页 / 404 属于独立页面，不渲染全局导航与布局
// 导航未完成（name 为空）时也视为独立页面，避免重定向前渲染完整布局触发无关请求
const isStandalonePage = computed(() => {
  const name = route.name;
  return !name || name === 'Login' || name === 'admin' || name === '404';
});

// 仅在非输入元素上阻止 Enter 键默认行为（如表单提交）
const keydownHandler = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const isInput =
      tagName === 'input' || tagName === 'textarea' || target.isContentEditable;
    if (!isInput) {
      event.preventDefault();
    }
  }
};

onMounted(() => {
  setWaterMark('tkdog', '面试题库');
  document.addEventListener('keydown', keydownHandler);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', keydownHandler);
});
</script>
<style>
.tkdog-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.home-nav {
  position: fixed;
  width: 100%;
  z-index: 100;
  height: 60px;
}

.home-body {
  padding-top: 20px;
  width: 90%;
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  min-height: 60vh;
  position: relative;
}

.home-bottom {
  width: 90%;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 移动端基础响应式 */
@media (max-width: 768px) {
  .home-body {
    width: 96%;
    flex-direction: column;
  }

  .home-bottom {
    width: 96%;
  }

  /* 首页左右布局堆叠 */
  .home-left,
  .home-right {
    width: 100% !important;
    padding-right: 0 !important;
  }

  .home-right {
    margin-top: 20px;
  }

  /* 题目/试卷详情：左右布局改为上下 */
  .info-container,
  .slide-container {
    width: 100% !important;
    margin-left: 0 !important;
  }

  .slide-container {
    margin-top: 20px;
  }

  /* 答题页全宽 + 头部纵向 */
  .do-paper-container {
    width: 100% !important;
  }

  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  /* 试卷卡片 / 题目卡片自适应宽度 */
  .test-card {
    width: 100% !important;
  }

  .tab-pane {
    flex-direction: column;
  }

  /* 导航栏：菜单横向滚动 */
  .nav-container {
    flex-wrap: wrap;
    height: auto !important;
    padding: 8px 10px;
  }

  .nav {
    overflow-x: auto;
    margin-left: 0 !important;
  }

  /* 学习报告/统计卡片改为纵向 */
  .stats,
  .report-body {
    flex-direction: column;
  }

  /* 管理端/个人中心：左边距归零、内边距收紧 */
  .admin-user,
  .comments-list,
  .user-info-container,
  .user-message,
  .home-container {
    margin-left: 0 !important;
    padding: 10px !important;
  }

  /* 首页统计卡片/图表纵向堆叠 */
  .stat-cards,
  .chart-row {
    flex-direction: column;
  }

  .chart-box,
  .line-box,
  .clock-box,
  .pie-box {
    width: 100% !important;
    min-width: 0 !important;
    height: 300px;
  }

  /* 登录/注册页：隐藏右侧背景图 */
  .login-container .right {
    display: none;
  }

  .loginBox {
    padding: 20px !important;
  }

  /* 弹窗宽度适配移动端 */
  .el-dialog {
    width: 92% !important;
  }
}

::-webkit-scrollbar {
  /* display: none; */
  width: 10px;
  height: 15px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 10px;
}

/* ::-webkit-scrollbar-button {
  width: 0;
  height: 0;
} */

/* 暗色模式：覆盖主要容器背景与硬编码文字颜色（Element Plus 组件由 dark css-vars 自动适配） */
html.dark body {
  background-color: #141414;
  color: #e5eaf3;
}

html.dark .nav-container,
html.dark .home-nav {
  background-color: #1d1e1f !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

html.dark .tkdog-container {
  background-color: #141414;
}

/* 暗色下：硬编码的深色文字统一调亮 */
html.dark .question,
html.dark .q-stem,
html.dark .comment-text,
html.dark .comment-user,
html.dark .option-row,
html.dark .option-value,
html.dark .similar-question-text,
html.dark .question-title,
html.dark .answer,
html.dark .group-question,
html.dark .announce-title,
html.dark .about-item {
  color: #e5eaf3 !important;
}

/* 暗色下：浅色背景改为深色 */
html.dark .reply-quote,
html.dark .answer,
html.dark .child-comment,
html.dark .deep-reply,
html.dark .q-type,
html.dark .question-type,
html.dark .subject-stats {
  background-color: #262727 !important;
}

/* 暗色下：次级文字 */
html.dark .comment-time,
html.dark .option-code,
html.dark .announce-content,
html.dark .stats-label {
  color: #a3a6ad !important;
}

/* 暗色下：高亮定位的评论保持可见 */
html.dark .comment-item.highlighted {
  background-color: #3a2f1d !important;
}

/* 暗色下：题目卡片（自定义 .card-container） */
html.dark .card-container {
  border-color: #3a3b3c !important;
  box-shadow: -10px -10px 20px rgba(0, 0, 0, 0.5) inset !important;
}

/* 暗色下：首页题目卡片容器（MainTab 的 .el-table 白底）与「查看更多」链接 */
html.dark .el-table {
  background-color: #1d1e1f !important;
}

html.dark .more {
  color: #a3a6ad !important;
}

/* 暗色下：登录/注册页 */
html.dark .login-container {
  background: #141414 !important;
}

html.dark .loginBox {
  background-color: #1d1e1f !important;
}

html.dark .loginBox .title,
html.dark .loginBox .sub-title {
  color: #e5eaf3 !important;
}

/* 打印（导出 PDF）：只保留主体内容，隐藏导航/侧栏/试题篮等 */
@media print {
  .home-nav,
  .home-bottom,
  .slide-container,
  .title-small {
    display: none !important;
  }

  .home-body {
    width: 100% !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
    min-height: auto !important;
  }

  .info-container {
    width: 100% !important;
  }
}
</style>
