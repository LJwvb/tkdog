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
import { useStore } from 'vuex';
import router from '@/router';
import AdminLogin from '@/views/admin/admin.vue';
import Login from '@/views/login/Login.vue';
import NavBar from '@/views/NavBar/Index.vue';
import BottomBar from '@/views/BottomBar/BottomBar.vue';
import TestBasket from '@/components/TestBasket/index.vue';

const store = useStore();
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
