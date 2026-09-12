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
import { useRoute, useRouter } from 'vue-router';
import NavBar from '@/views/NavBar/index.vue';
import BottomBar from '@/views/BottomBar/index.vue';
import TestBasket from '@/components/TestBasket/index.vue';
import { setWaterMark } from './utils/waterMark';

const route = useRoute();
const router = useRouter();
// 登录页 / 管理员登录页 / 404 / 协议页属于独立页面，不渲染全局导航与布局
// 导航未完成（name 为空）时也视为独立页面，避免重定向前渲染完整布局触发无关请求
const isStandalonePage = computed(() => {
  const name = route.name;
  return (
    !name ||
    name === 'Login' ||
    name === 'admin' ||
    name === '404' ||
    name === 'agreement' ||
    name === 'privacy' ||
    name === 'GithubCallback'
  );
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

  // GitHub OAuth 回调处理：GitHub 不接受带 # 的 hash 回调 URL，
  // 回调到首页 ?code=xxx&state=xxx 后，跳转到 hash 路由的回调页处理
  console.log('[App] onMounted, 当前 URL:', window.location.href);
  console.log('[App] window.location.search:', window.location.search);
  const urlParams = new URLSearchParams(window.location.search);
  const githubCode = urlParams.get('code');
  const githubState = urlParams.get('state');
  console.log('[App] 检测到 code:', githubCode, 'state:', githubState);
  if (githubCode) {
    const redirectHash = `/oauth/github/callback?code=${encodeURIComponent(
      githubCode,
    )}${githubState ? `&state=${encodeURIComponent(githubState)}` : ''}`;
    console.log('[App] 用 router.replace 跳转到回调页:', redirectHash);
    // 清除 URL 中的 query 参数，避免刷新重复处理
    window.history.replaceState({}, document.title, window.location.pathname);
    // 用 Vue Router 跳转，确保组件 onMounted 被触发
    router.replace(redirectHash);
  } else {
    console.log('[App] 未检测到 code，正常渲染页面');
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', keydownHandler);
});
</script>
<style>
@import '@/styles/dark.css';

/* ============ 全局主题：青蓝主色 ============ */
:root {
  --el-color-primary: #00a6ff;
  --el-color-primary-light-3: #33b9ff;
  --el-color-primary-light-5: #66cbff;
  --el-color-primary-light-7: #99dcff;
  --el-color-primary-light-8: #b3e5ff;
  --el-color-primary-light-9: #e6f6ff;
  --el-color-primary-dark-2: #0085cc;
  --tk-brand-grad: linear-gradient(120deg, #00c6ff, #0072ff);
  --tk-brand-grad-anim: linear-gradient(120deg, #00c6ff, #0072ff, #00c6ff);
}

/* 全局页面背景：顶部淡青蓝渐变的科技感底 */
.tkdog-container {
  background: linear-gradient(
      180deg,
      rgba(0, 166, 255, 0.08) 0%,
      rgba(0, 166, 255, 0.03) 320px,
      rgba(0, 166, 255, 0) 640px
    ),
    #f0f2f5;
}

/* 全局主按钮：青蓝渐变 + 光影 */
.el-button--primary {
  border: none;
  background-image: var(--tk-brand-grad-anim);
  background-size: 200% 100%;
  box-shadow: 0 4px 14px rgba(0, 120, 255, 0.25);
  transition: all 0.35s ease;
}
.el-button--primary:hover,
.el-button--primary:focus {
  background-position: 100% 0;
  box-shadow: 0 6px 20px rgba(0, 140, 255, 0.4);
  transform: translateY(-1px);
}

/* plain 模式：保留渐变背景，文字改白色确保清晰可读 */
.el-button--primary.is-plain {
  color: #fff;
}
.el-button--primary.is-plain:hover,
.el-button--primary.is-plain:focus {
  color: #fff;
}

/* 修改密码弹窗：NavBar 容器 .home-nav 是 position:fixed; z-index:100，
   会创建独立 stacking context，把 el-dialog 困在里面导致弹窗被截/看不到。
   显式把 modal 提到最高层，确保始终盖住导航栏。 */
.edit-password-modal {
  z-index: 9999 !important;
}
.edit-password-modal .el-dialog {
  z-index: 9999 !important;
}

/* el-tabs：激活下划线渐变 + 激活文字品牌色 */
.el-tabs__active-bar {
  background: linear-gradient(90deg, #00c6ff, #0072ff);
}
.el-tabs__item.is-active {
  color: var(--el-color-primary);
}
.el-tabs__item:hover {
  color: var(--el-color-primary);
}

/* el-link 主色 */
.el-link--primary {
  --el-link-primary-text-color: var(--el-color-primary);
}

/* 滚动条：青蓝主题 */
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #7fd4ff, #4db8ff);
  border-radius: 4px;
}

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

/* 全局统一卡片样式：更精致的层次光影 */
.el-card {
  border-radius: 14px;
  border: 1px solid #e4e7ed;
  background: linear-gradient(
      135deg,
      rgba(0, 166, 255, 0.05) 0%,
      rgba(0, 200, 220, 0.02) 45%,
      rgba(255, 255, 255, 0) 100%
    ),
    #fff;
  box-shadow: 0 4px 18px rgba(31, 45, 61, 0.06);
  transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
}

.el-card:hover {
  border-color: rgba(0, 166, 255, 0.35);
  box-shadow: 0 10px 30px rgba(0, 110, 255, 0.12);
  transform: translateY(-2px);
}

/* 全局统一按钮圆角 */
.el-button {
  border-radius: 6px;
  font-weight: 500;
}

/* 去掉 el-tag 动画：禁用过渡、hover 位移和关闭图标旋转 */
.el-tag {
  transition: none !important;
}

.el-tag .el-tag__close,
.el-tag .el-icon-close {
  transition: none !important;
  transform: none !important;
}

.el-tag-fade-enter-active,
.el-tag-fade-leave-active,
.el-tag-fade-enter-from,
.el-tag-fade-leave-to,
.el-tag-fade-enter-to,
.el-tag-fade-leave-from {
  transition: none !important;
  transform: none !important;
  animation: none !important;
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
