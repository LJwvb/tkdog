<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <subject_bytype></subject_bytype>
  </el-container>
</template>

<script lang="ts" setup>
import subject_bytype from '../components/subject/subject_bytype.vue';
import { ref } from 'vue';
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: white;
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
