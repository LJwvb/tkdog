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
