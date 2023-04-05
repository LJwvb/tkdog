<template>
  <div class="tkdog-login" v-if="store.state?.userData?.phone === ''">
    <Login v-if="router.currentRoute.value.path === '/'"> </Login>
    <AdminLogin v-else-if="router.currentRoute.value.path !== '/'"></AdminLogin>
  </div>
  <div class="tkdog-container" v-else>
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
    <TestBasket />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import NavBar from '@/views/NavBar/index.vue';
import BottomBar from '@/views/BottomBar/index.vue';
import TestBasket from '@/components/TestBasket/index.vue';
import { setWaterMark } from './utils/waterMark';
import Login from '@/views/login/Login.vue';
import AdminLogin from '@/views/admin/admin.vue';
import { useStore } from 'vuex';
import router from '@/router';
onMounted(() => {
  setWaterMark('tkdog', '面试题库');
});
const store = useStore();
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
.home-body {
  padding-top: 20px;
  width: 90%;
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  min-height: 60vh;
  position: relative;
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
