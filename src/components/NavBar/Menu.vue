<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1" @click="toHome">
      <el-icon> <HomeFilled /> </el-icon>首页
      <!-- <router-link to="/">首页</router-link> -->
    </el-menu-item>
    <el-menu-item index="2" @click="toSubject">
      <el-icon> <Notebook /> </el-icon>题目
      <!-- <router-link to="/subject">题目</router-link> -->
    </el-menu-item>
    <el-menu-item index="3" @click="toTest">
      <el-icon> <List /> </el-icon>试卷
      <!-- <router-link to="/test_paper">试卷</router-link> -->
    </el-menu-item>
    <el-menu-item index="4" @click="toUser">
      <el-icon> <User /> </el-icon>个人
      <!-- <router-link to="/user">个人</router-link> -->
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
<style lang="scss">
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.bg-purple {
  background-color: #c792ea;
}
</style>
