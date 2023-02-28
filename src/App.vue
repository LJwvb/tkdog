<template>
  <div class="tkdog-container">
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
  </div>
  <TestBasket />
</template>
<script setup lang="ts">
import NavBar from '@/views/NavBar/Index.vue';
import BottomBar from '@/views/BottomBar/BottomBar.vue';
import TestBasket from '@/components/TestBasket/index.vue';
</script>
<style>
.home-nav {
  position: relative;
  width: 100%;
  z-index: 100;
  height: 60px;
  margin: 0;
  padding: 0;
}

.home-body {
  padding: 20px;
  min-height: 80vh;
  min-width: 1050px;
  display: flex;
  justify-content: flex-start;
}

.home-bottom {
  min-width: 1050px;
}
</style>
