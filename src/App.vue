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
@import '@/styles/dark.css';

.tkdog-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: #f0f2f5;
}

.home-nav {
  position: fixed;
  /* scrollbar-gutter: stable 下 Chrome 会把 fixed 元素的 width:100%/100vw 都解析成"视口-滚动槽"，
     导致右侧槽位透出页面背景形成空隙；改用 left:0 + right:0 拉伸定位，直接铺满含滚动槽的完整视口 */
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
}

.home-body {
  padding-top: 24px;
  width: 100%;
  max-width: 1680px;
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  flex: 1;
  position: relative;
  padding-left: 32px;
  padding-right: 32px;
  gap: 24px;
}

.home-bottom {
  width: 100%;
  max-width: 1680px;
  margin-top: 24px;
  margin-bottom: 24px;
  padding-left: 32px;
  padding-right: 32px;
}

/* 全局统一卡片样式 */
.el-card {
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.el-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

/* 全局统一按钮圆角 */
.el-button {
  border-radius: 6px;
  font-weight: 500;
}

/* 移动端基础响应式 */
@media (max-width: 768px) {
  .home-body {
    width: 96%;
    flex-direction: column;
    padding-left: 0;
    padding-right: 0;
    gap: 16px;
    flex: none;
    min-height: auto;
  }

  .home-bottom {
    width: 96%;
    padding-left: 0;
    padding-right: 0;
  }

  /* 首页左右布局堆叠 */
  .home-left,
  .home-right {
    width: 100% !important;
    padding-right: 0 !important;
  }

  .home-right {
    margin-top: 16px;
  }

  /* 题目/试卷详情：左右布局改为上下 */
  .info-container,
  .slide-container {
    width: 100% !important;
    margin-left: 0 !important;
  }

  .slide-container {
    margin-top: 16px;
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
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

::-webkit-scrollbar-track {
  background: transparent;
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
