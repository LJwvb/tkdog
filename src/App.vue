<template>
  <!-- 固定导航栏 -->
  <div class="home-nav">
    <NavBar></NavBar>
  </div>
  <!-- 动态页面主体 -->
  <div class="hone-body">
    <router-view />
  </div>
  <!-- 尾部-->
  <div class="home-bottom">
    <BottomBar></BottomBar>
  </div>

  <!-- <el-backtop :right="100" :bottom="100" /> -->
</template>
<script setup lang="ts">
import NavBar from './components/NavBar/Index.vue';
import BottomBar from './components/BottomBar/BottomBar.vue';
// import Login from './views/login/Login.vue';
</script>
<style>
body,
html {
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.home-nav {
  position: relative;
  width: 100%;
  z-index: 100;
  height: 60px;
}
.hone-body {
}
.home-bottom {
}
</style>
