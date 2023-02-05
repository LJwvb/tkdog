<template>
  <div class="mt-4">
    <el-input v-model="keyword" placeholder="请输入搜索的内容" size="large" class="input-with-select">
      <template #append>
        <el-button :icon="Search" size="large" />
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
const keyword = ref('');
</script>
<style >
.mt-4 {
  padding-top: 2%;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.bg-purple {
  background-color: #c792ea;
}
</style>
