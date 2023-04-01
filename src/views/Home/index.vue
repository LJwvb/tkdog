<template>
  <div class="home-left">
    <Tabs />
  </div>
  <div class="home-right">
    <SideBar />
  </div>
</template>

<script lang="ts" setup>
import Tabs from './MainTab.vue';
import SideBar from './Slide.vue';
import { login } from '@/services';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

const store = useStore();

// todo：要写在登录页面，这里只是为了测试
if (store.state.userData.phone) {
  ElMessage.success('已登录');
} else {
  login({
    phone: 18111111111,
    password: 123456,
  }).then((res) => {
    console.log(res);
    if (res.code === 200 || res?.success) {
      ElMessage.success('登录成功');
      store.commit('setUserData', {
        ...res.data,
        phone: 18111111111,
      });
    } else {
      ElMessage.error(res?.message || '登录失败');
    }
  });
}
</script>
<style scoped>
.home-left {
  width: 70%;
  padding-right: 40px;
}
.home-right {
  width: 30%;
}
</style>
