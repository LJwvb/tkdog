<template>
  <el-menu @select="handleSelect" :default-active="activeIndex">
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
        <Document />
      </el-icon>
      我的题目
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon>
        <Clock />
      </el-icon>
      浏览记录
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon>
        <Menu />
      </el-icon>
      我的试卷
    </el-menu-item>
    <el-menu-item index="5">
      <el-icon>
        <ChatLineSquare />
      </el-icon>
      消息通知
    </el-menu-item>
  </el-menu>
  <UserInfo v-if="activeIndex === '0'" />

  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';

import { useRouter } from 'vue-router';
import UserInfo from './UserInfo.vue';

const paths = ref([
  '/user',
  '/user/UserLikes',
  '/user/UserQuestions',
  '/user/UserHistory',
  '/user/UserTestPaper',
  '/user/UserMessage',
]);
const router = useRouter();
const activeIndex = ref('0');

const handleSelect = (index: string) => {
  activeIndex.value = index;
  console.log(activeIndex.value);
  router.push({
    path: paths.value[Number(index)],
  });
};
watchEffect(() => {
  const path = router.currentRoute.value.path;
  switch (path) {
    case '/user':
      activeIndex.value = '0';
      break;
    case '/user/UserLikes':
      activeIndex.value = '1';
      break;
    case '/user/UserQuestions':
      activeIndex.value = '2';
      break;
    case '/user/UserHistory':
      activeIndex.value = '3';
      break;
    case '/user/UserTestPaper':
      activeIndex.value = '4';
      break;
    case '/user/UserMessage':
      activeIndex.value = '5';
      break;
    default:
      activeIndex.value = '0';
      break;
  }
});
</script>

<style scoped></style>
