<template>
  <div class="user-layout">
    <div class="user-menu">
      <el-menu :default-active="activeIndex" @select="handleSelect">
        <el-menu-item index="0">
          <el-icon>
            <User />
          </el-icon>
          个人资料
        </el-menu-item>
        <el-menu-item index="1">
          <el-icon>
            <Star />
          </el-icon>
          我的点赞
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon>
            <Collection />
          </el-icon>
          我的收藏
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon>
            <Document />
          </el-icon>
          我的题目
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon>
            <Clock />
          </el-icon>
          浏览记录
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon>
            <Menu />
          </el-icon>
          我的试卷
        </el-menu-item>
        <el-menu-item index="6">
          <el-icon>
            <Collection />
          </el-icon>
          错题本
        </el-menu-item>
        <el-menu-item index="7">
          <el-icon>
            <DataLine />
          </el-icon>
          答题记录
        </el-menu-item>
        <el-menu-item index="8">
          <el-icon>
            <Bell />
          </el-icon>
          消息通知
        </el-menu-item>
        <el-menu-item index="9">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          我的反馈
        </el-menu-item>
      </el-menu>
    </div>
    <div class="user-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import { useRouter } from 'vue-router';
import {
  User,
  Star,
  Document,
  Clock,
  Menu,
  Collection,
  DataLine,
  Bell,
  ChatDotRound,
} from '@element-plus/icons-vue';

const paths = ref([
  '/user/UserInfo',
  '/user/UserLikes',
  '/user/UserFavorite',
  '/user/UserQuestions',
  '/user/UserHistory',
  '/user/UserTestPaper',
  '/user/UserWrong',
  '/user/UserRecord',
  '/user/UserMessage',
  '/user/UserFeedback',
]);
const router = useRouter();
const activeIndex = ref('0');

const handleSelect = (index: string) => {
  activeIndex.value = index;
  router.push({
    path: paths.value[Number(index)],
  });
};
watchEffect(() => {
  const path = router.currentRoute.value.path;
  switch (path) {
    case '/user':
    case '/user/UserInfo':
      activeIndex.value = '0';
      break;
    case '/user/UserLikes':
      activeIndex.value = '1';
      break;
    case '/user/UserFavorite':
      activeIndex.value = '2';
      break;
    case '/user/UserQuestions':
      activeIndex.value = '3';
      break;
    case '/user/UserHistory':
      activeIndex.value = '4';
      break;
    case '/user/UserTestPaper':
      activeIndex.value = '5';
      break;
    case '/user/UserWrong':
      activeIndex.value = '6';
      break;
    case '/user/UserRecord':
      activeIndex.value = '7';
      break;
    case '/user/UserMessage':
      activeIndex.value = '8';
      break;
    case '/user/UserFeedback':
      activeIndex.value = '9';
      break;
    default:
      activeIndex.value = '0';
      break;
  }
});
</script>

<style scoped>
.user-layout {
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 20px;
}

.user-menu {
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.user-menu :deep(.el-menu) {
  border-right: none;
}

.user-menu :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
}

.user-content {
  flex: 1;
  min-width: 0;
}

/* 移动端：菜单横向滚动，内容换行 */
@media (max-width: 768px) {
  .user-layout {
    flex-direction: column;
    gap: 12px;
  }

  .user-menu {
    width: 100%;
  }

  .user-menu :deep(.el-menu) {
    display: flex;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid #ebeef5;
  }

  .user-menu :deep(.el-menu-item) {
    flex-shrink: 0;
    padding: 0 14px;
  }

  .user-content {
    width: 100%;
  }
}
</style>
