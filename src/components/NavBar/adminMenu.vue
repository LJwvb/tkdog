<template>
  <el-menu
    :default-active="activeIndex"
    class="nav"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1" @click="toHome">
      <el-icon> <HomeFilled /> </el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="2" @click="toSubject">
      <el-icon> <Notebook /> </el-icon>
      <span>题目</span>
      <!-- 内容有：题目待审核，已通过审核题目，已拒绝题目，已发布题目，已下架题目 -->
    </el-menu-item>
    <el-menu-item index="3" @click="toTest">
      <el-icon> <List /> </el-icon>
      <span>试卷</span>
    </el-menu-item>
    <el-menu-item index="4" @click="toUser">
      <el-icon> <User /> </el-icon>
      <span>用户</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '../../router';
const activeIndex = ref('1');
const activeIndex2 = ref('1');
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const toHome = () => {
  router.push({
    path: '/',
  });
};
const toSubject = () => {
  router.push({
    path: '/subject',
  });
};
const toTest = () => {
  router.push({
    path: '/test_paper',
  });
};
const toUser = () => {
  router.push({
    path: '/user',
  });
};
</script>
<style scoped>
.nav {
  border: none !important;
  width: 100%;
  margin-left: 60px;
}
</style>
