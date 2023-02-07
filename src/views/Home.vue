<template>
  <div class="home-left">
    <Tabs></Tabs>
  </div>
  <div class="home-right">
    <SideBar />
  </div>
</template>

<script lang="ts" setup>
import Tabs from '@/components/Index/index.vue';
import SideBar from '@/components/SideBar/SideBar.vue';
</script>
<style scoped>
.home-left {
  margin: 0 20px;
}
.home-right {
  width: 30%;
}
</style>
