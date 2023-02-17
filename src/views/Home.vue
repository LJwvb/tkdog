<template>
  <div class="home-left">
    <Tabs />
  </div>
  <div class="home-right">
    <SideBar />
  </div>
</template>

<script lang="ts" setup>
import Tabs from '@/components/Index/index.vue';
import SideBar from '@/components/Index/slide.vue';
import { login } from '@/services';
import { ElMessage } from 'element-plus';

// todo：要写在登录页面，这里只是为了测试
if (localStorage.getItem('userData')) {
  console.log('已登录');
} else {
  login({
    phone: 123456,
    password: 123456,
  }).then((res) => {
    console.log(res);
    if (res.code === 200 || res?.success) {
      ElMessage.success('登录成功');
      localStorage.setItem('userData', JSON.stringify(res.data));
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
