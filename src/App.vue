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
</template>
<script setup lang="ts">
import NavBar from './components/NavBar/Index.vue';
import BottomBar from './components/BottomBar/BottomBar.vue';
</script>
<style>
.home-nav {
  position: relative;
  width: 100%;
  z-index: 100;
  height: 60px;
}
.hone-body {
  padding: 20px;
  min-height: 80vh;
  min-width: 1550px;
  display: flex;
  justify-content: space-evenly;
}
.home-bottom {
  min-width: 1550px;
}
</style>
