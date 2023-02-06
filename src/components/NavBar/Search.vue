<template>
  <el-input
    v-model="keyword"
    placeholder="请输入搜索的内容"
    size="large"
    class="search input"
  >
    <template #append>
      <el-button :icon="Search" size="large" />
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
const keyword = ref('');
</script>
<style scoped>
.search {
  width: 600px;
  margin-right: 20px;
}
</style>
