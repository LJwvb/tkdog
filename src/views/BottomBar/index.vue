<template>
  <div class="connection">
    <div class="space">
      <el-icon>
        <School />
      </el-icon>
      <span>面试狗 · 在线面试刷题平台</span>
    </div>
    <div class="space">
      <el-icon>
        <Promotion />
      </el-icon>
      <span>精选真题 · AI 判分 · 高效备战</span>
    </div>
    <div class="space">
      <el-icon>
        <Stamp />
      </el-icon>
      <span>© 2026 面试狗</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { School, Promotion, Stamp } from '@element-plus/icons-vue';
</script>

<style scoped>
.connection {
  display: flex;
  align-items: center;
  justify-content: center;
}
.space {
  display: flex;
  margin-right: 20px;
  align-items: center;
}

/* 移动端适配：垂直排列，避免文字被压缩 */
@media (max-width: 768px) {
  .connection {
    flex-direction: column;
    gap: 8px;
  }
  .space {
    margin-right: 0;
    font-size: 12px;
  }
}
</style>
