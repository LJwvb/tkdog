<template>
  <div class="tkdog-container">
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
  </div>
  <TestBasket />
</template>
<script setup lang="ts">
import NavBar from '@/views/NavBar/Index.vue';
import BottomBar from '@/views/BottomBar/BottomBar.vue';
import TestBasket from '@/components/TestBasket/index.vue';
</script>
<style>
.tkdog-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.home-nav {
  position: relative;
  width: 100%;
  z-index: 100;
  height: 60px;
}
.hone-body {
  padding: 20px;
  width: 90%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}
.home-bottom {
  position: absolute;
  bottom: 20px;
  width: 90%;
}
</style>
