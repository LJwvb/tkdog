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
  padding: 20px 24px;
  border-radius: 14px;
  /* 浅色青蓝渐变，与页面/hero 色调统一 */
  background: linear-gradient(
      120deg,
      rgba(0, 166, 255, 0.1) 0%,
      rgba(0, 200, 220, 0.05) 45%,
      rgba(255, 255, 255, 0) 100%
    ),
    #fff;
  border: 1px solid rgba(0, 166, 255, 0.12);
  box-shadow: 0 4px 18px rgba(31, 45, 61, 0.08);
  color: #5b6b7f;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}
/* 顶部青蓝流光线 */
.connection::before {
  content: '';
  position: absolute;
  top: 0;
  left: -40%;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 200, 255, 0.7),
    transparent
  );
  animation: bottomLine 5s ease-in-out infinite;
}
@keyframes bottomLine {
  0%,
  100% {
    left: -40%;
  }
  50% {
    left: 40%;
  }
}
.connection :deep(.el-icon) {
  color: var(--el-color-primary);
  margin-right: 6px;
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
