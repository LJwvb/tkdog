<template>
  <div id="nav">
    <!-- 固定导航栏 -->
    <div class="home-nav">
      <NavBar></NavBar>
    </div>
    <div class="home-body">
      <!-- 动态页面主体 -->
      <router-view />
    </div>
    <div class="home-bottom">
      <BottomBar></BottomBar>
    </div>

    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> -->
  </div>
</template>
<script setup lang="ts">
import NavBar from './components/NavBar/index.vue';
import BottomBar from './components/BottomBar/BottomBar.vue';
import Login from './views/login/Login.vue';
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
