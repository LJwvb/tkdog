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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.home-nav {
  position: fixed;
  width: 100%;
  z-index: 100;
  height: 60px;
}
.hone-body {
  padding-top: 20px;
  width: 90%;
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  min-height: 60vh;
}
.home-bottom {
  width: 90%;
  margin-top: 20px;
  margin-bottom: 20px;
}
::-webkit-scrollbar {
  display: none;
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 10px;
}
::-webkit-scrollbar-button {
  width: 0;
  height: 0;
}
</style>
