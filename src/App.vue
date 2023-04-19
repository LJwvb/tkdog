<template>
  <div class="tkdog-login" v-if="store.state?.userData?.phone === ''">
    <Login v-if="router.currentRoute.value.path !== '/admin'"> </Login>
    <AdminLogin v-else></AdminLogin>
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
import { onMounted, watchEffect } from 'vue';
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
watchEffect(() => {
  const path = router.currentRoute.value.path;
  if (path !== '/404') {
    const is404 = router.options.routes.every((item) => {
      if (item?.children) {
        return;
    });
    if (path === '/admin') {
      return;
    }
    if (is404) {
      router.push('/404');
    }
  }

  if (!store.state.userData.isAdmin) {
    if (router.currentRoute.value.meta.isAdmin) {
      router.push('/404');
    } else {
      return;
    }
  } else {
    if (router.currentRoute.value.meta.isAdmin === false) {
      router.push('/404');
    } else {
      return;
    }
  }
});
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
  /* display: none; */
  width: 15px;
  height: 15px;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 10px;
}
/* ::-webkit-scrollbar-button {
  width: 0;
  height: 0;
} */
</style>
