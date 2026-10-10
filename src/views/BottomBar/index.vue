<template>
  <div class="connection">
    <div class="info-row">
      <div class="space">
        <el-icon>
          <School />
        </el-icon>
        <span>题库狗 · 在线面试刷题平台</span>
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
        <span>© 2026 题库狗</span>
      </div>
    </div>
    <!-- 备案信息：ICP 备案号 + 公安备案号同一排展示，均链至官方备案系统 -->
    <div class="icp-row">
      <a
        class="icp-link"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
      >
        浙ICP备2026077308号-1
      </a>
      <!-- 公安联网备案：编号由下方 POLICE_BEIAN_NO 常量控制，留空则整段不展示 -->
      <template v-if="POLICE_BEIAN_NO">
        <span class="icp-sep">·</span>
        <a
          class="icp-link police-link"
          :href="policeBeianUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img class="police-icon" :src="policeBadge" alt="公安备案" />
          浙公网安备 {{ POLICE_BEIAN_NO }} 号
        </a>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { School, Promotion, Stamp } from '@element-plus/icons-vue';
// 公安备案官方警徽图标（取自 beian.gov.cn 官方备案编号图标，勿篡改样式）
import policeBadge from '@/assets/police-badge.png';

// 公安联网备案号（公网安备）的数字部分，例如 '33028202001312'
// 留空则页脚不展示该段；编号由公安备案平台「我的网站 → 详情」中获取
const POLICE_BEIAN_NO = '33028202001312';
const policeBeianUrl = `https://beian.mps.gov.cn/#/query/webSearch?code=${POLICE_BEIAN_NO}`;
</script>

<style scoped>
.connection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 24px 14px;
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
.info-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.space {
  display: flex;
  margin-right: 20px;
  align-items: center;
}

/* 备案信息行 */
.icp-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 10px;
  width: 100%;
  border-top: 1px dashed rgba(0, 166, 255, 0.18);
  font-size: 12.5px;
  color: #8a97a8;
}
.icp-link {
  color: #8a97a8;
  text-decoration: none;
  transition: color 0.2s;
}
.icp-link:hover {
  color: var(--el-color-primary);
  text-decoration: underline;
}
.icp-sep {
  opacity: 0.55;
}
.police-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.police-icon {
  /* 规范建议图标尺寸 16×17px */
  width: 16px;
  height: 17px;
  flex-shrink: 0;
  display: block;
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
  .icp-row {
    font-size: 12px;
    margin-top: 8px;
  }
}
</style>
