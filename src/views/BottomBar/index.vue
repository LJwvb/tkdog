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
    <!-- 备案信息：按国内要求展示备案号，并链接至工信部 ICP/IP 地址/域名信息备案管理系统 -->
    <div class="icp-row">
      <a
        class="icp-link"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
      >
        浙ICP备2026077308号-1
      </a>
    </div>
    <!--
      公安联网备案（公网安备）：在全国互联网安全管理服务平台审核通过后，
      把拿到的编号（纯数字部分，如 33010802000000）填入下方 POLICE_BEIAN_NO 即可，
      留空则该行不展示。
    -->
    <div v-if="POLICE_BEIAN_NO" class="icp-row police-row">
      <a
        class="icp-link"
        :href="policeBeianUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        浙公网安备 {{ POLICE_BEIAN_NO }} 号
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { School, Promotion, Stamp } from '@element-plus/icons-vue';

// 公安联网备案号（公网安备）的数字部分，例如 '33010802000000'
// 留空则页脚不展示该行；拿到编号后填入并重新打包即可
const POLICE_BEIAN_NO = '';
const policeBeianUrl = `http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${POLICE_BEIAN_NO}`;
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
.police-row {
  margin-top: 6px;
  padding-top: 0;
  border-top: none;
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
