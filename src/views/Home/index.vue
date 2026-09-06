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
  flex: 1;
  min-width: 0;
}

.home-right {
  width: 320px;
  flex-shrink: 0;
}
</style>
