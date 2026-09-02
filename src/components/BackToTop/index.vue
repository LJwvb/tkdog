<template>
  <transition name="back-top-fade">
    <div
      v-if="visible"
      class="back-to-top"
      :style="{ right: right + 'px', bottom: bottom + 'px' }"
      title="回到顶部"
      @click="scrollToTop"
    >
      <el-icon><ArrowUp /></el-icon>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowUp } from '@element-plus/icons-vue';
import '@/styles/back-top.css';

/**
 * 回到顶部悬浮按钮（页面/窗口滚动场景）。
 *
 * 注意：如果滚动发生在某个容器内部（如 VirtualList 的滚动容器），
 * 应该用 VirtualList 的 show-back-top 属性，由组件内部直接操作自己的容器，
 * 比在这里跨组件传 ref 更可靠。
 */
const props = withDefaults(
  defineProps<{
    // 滚动超过这个高度（px）才显示按钮
    visibilityHeight?: number;
    right?: number;
    bottom?: number;
  }>(),
  {
    visibilityHeight: 300,
    right: 40,
    bottom: 80,
  },
);

const visible = ref(false);

const onScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  visible.value = scrollTop > props.visibilityHeight;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>
