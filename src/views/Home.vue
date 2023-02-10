<template>
  <div class="home-left">
    <Tabs />
  </div>
  <div class="home-right">
    <SideBar />
  </div>
</template>

<script lang="ts" setup>
import Tabs from '@/components/Index/Tabs.vue';
import SideBar from '@/components/Index/SideBar.vue';
</script>
<style scoped>
.home-left {
  margin: 0 20px;
  width: 70%;
}

.home-right {
  width: 30%;
}
</style>
