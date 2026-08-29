<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="height > 0 ? { height: height + 'px' } : {}"
    @scroll.passive="handleScroll"
  >
    <!-- 占位元素，撑开总高度 -->
    <div
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px' }"
    ></div>

    <!-- 可视区域内容 -->
    <div
      class="virtual-list-content"
      :style="{ transform: `translateY(${startOffset}px)` }"
    >
      <div
        v-for="item in visibleData"
        :key="item.index"
        :ref="(el) => setItemRef(el, item.index)"
        class="virtual-list-item"
      >
        <slot :item="item.data" :index="item.index"></slot>
      </div>
    </div>

    <!--
      底部加载状态：必须放在 .virtual-list-content 外面。
      内容区只渲染可见的一小段，且带 translateY(startOffset)，
      若提示放在里面，滚动到列表中间时它会跟着可视窗口跑，
      看起来就像"还没到底就提示没有更多了"。
    -->
    <div
      v-if="showFooter"
      class="virtual-list-footer"
      :style="{ transform: `translateY(${itemsTotalHeight}px)` }"
    >
      <div v-if="loading" class="virtual-list-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else class="virtual-list-finished">没有更多了</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { Loading } from '@element-plus/icons-vue';

interface Props {
  data: any[];
  height?: number;
  estimatedItemHeight?: number;
  buffer?: number;
  loading?: boolean;
  finished?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: 600,
  estimatedItemHeight: 150,
  buffer: 3,
  loading: false,
  finished: false,
});

const emit = defineEmits(['loadMore', 'scroll']);

const containerRef = ref<HTMLElement>();
const itemRefs = ref<Map<number, HTMLElement>>(new Map());
const scrollTop = ref(0);
// 内部加载锁，防止快速连续触发
const isLoading = ref(false);

// 每个元素的实际高度（只测量一次，避免跳动）
const heights = ref<number[]>([]);
// 已测量的索引集合
const measuredIndices = ref<Set<number>>(new Set());

// 初始化高度数组
const initHeights = () => {
  heights.value = new Array(props.data.length).fill(props.estimatedItemHeight);
};

// 底部状态是否展示
const showFooter = computed(
  () => props.loading || (props.finished && props.data.length > 0),
);

// 所有列表项的总高度（不含底部状态条）
const itemsTotalHeight = computed(() => {
  let sum = 0;
  for (let i = 0; i < heights.value.length; i++) {
    sum += heights.value[i] || props.estimatedItemHeight;
  }
  return sum;
});

// 撑开滚动条的总高度：列表项 + 底部状态条
const totalHeight = computed(() => {
  return itemsTotalHeight.value + (showFooter.value ? 50 : 0);
});

// 计算前缀偏移量（用于二分查找）
const getOffset = (index: number): number => {
  let offset = 0;
  for (let i = 0; i < index && i < heights.value.length; i++) {
    offset += heights.value[i] || props.estimatedItemHeight;
  }
  return offset;
};

// 二分查找起始索引
const findStartIndex = (target: number): number => {
  let low = 0;
  let high = heights.value.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midOffset = getOffset(mid);
    if (midOffset <= target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return Math.max(0, high);
};

// 容器实际高度（支持 flex 自适应）
const containerHeight = computed(() => {
  if (props.height > 0) return props.height;
  return containerRef.value?.clientHeight || 600;
});

// 起始索引
const startIndex = computed(() => {
  return Math.max(0, findStartIndex(scrollTop.value) - props.buffer);
});

// 结束索引
const endIndex = computed(() => {
  let end = startIndex.value;
  let accumulatedHeight = 0;
  const h = containerHeight.value;
  while (end < heights.value.length && accumulatedHeight < h) {
    accumulatedHeight += heights.value[end] || props.estimatedItemHeight;
    end++;
  }
  return Math.min(heights.value.length, end + props.buffer);
});

// 起始偏移量
const startOffset = computed(() => {
  return getOffset(startIndex.value);
});

// 可视区域数据
const visibleData = computed(() => {
  const result = [];
  for (let i = startIndex.value; i < endIndex.value; i++) {
    if (props.data[i] !== undefined) {
      result.push({
        index: i,
        data: props.data[i],
      });
    }
  }
  return result;
});

// 设置元素引用并测量高度（只测量一次）
const setItemRef = (el: any, index: number) => {
  if (el) {
    itemRefs.value.set(index, el as HTMLElement);
    // 只测量未测量过的元素
    if (!measuredIndices.value.has(index)) {
      measureItem(index);
    }
  } else {
    itemRefs.value.delete(index);
  }
};

// 测量元素高度（只测量一次，测量后不再更新，避免跳动）
const measureItem = (index: number) => {
  const el = itemRefs.value.get(index);
  if (el && !measuredIndices.value.has(index)) {
    const actualHeight = el.offsetHeight;
    if (actualHeight > 0) {
      heights.value[index] = actualHeight;
      measuredIndices.value.add(index);
    }
  }
};

// 处理滚动
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  scrollTop.value = target.scrollTop;
  emit('scroll', e);

  // 滚动到底部时触发加载更多（加锁防止连续触发）
  if (!props.loading && !props.finished && !isLoading.value) {
    const { scrollTop: st, scrollHeight, clientHeight } = target;
    if (st + clientHeight >= scrollHeight - 80) {
      isLoading.value = true;
      emit('loadMore');
    }
  }
};

// 监听 loading 状态，加载完成后解锁
watch(
  () => props.loading,
  (newVal) => {
    if (!newVal) {
      // 延迟解锁，防止快速连续触发
      setTimeout(() => {
        isLoading.value = false;
      }, 200);
    }
  },
);

// 监听数据变化（监听引用变化，切换 tab 时重置状态）
watch(
  () => props.data,
  (newData, oldData) => {
    // 如果是同一个数组引用，不处理
    if (newData === oldData) return;

    // 判断是加载更多还是切换 tab
    // 加载更多时（如 [...oldData, ...newItems]），新数组的前几个元素和旧数组是同一个引用
    // 切换 tab 时，数据完全不同，引用也不同
    const isLoadMore =
      newData.length > (oldData?.length || 0) &&
      oldData?.length > 0 &&
      newData[0] === oldData[0]; // 第一个元素引用相同说明是加载更多

    if (isLoadMore) {
      // 加载更多：只新增高度，不重置滚动位置
      const newHeights = [...heights.value];
      for (let i = oldData.length; i < newData.length; i++) {
        if (newHeights[i] === undefined) {
          newHeights[i] = props.estimatedItemHeight;
        }
      }
      heights.value = newHeights;

      // 等 DOM 更新后测量新元素高度
      nextTick(() => {
        for (let i = oldData.length; i < newData.length; i++) {
          measureItem(i);
        }
      });
      return;
    }

    // 切换 tab：重置状态
    initHeights();
    measuredIndices.value.clear();
    scrollTop.value = 0;

    // 重置滚动位置到顶部
    if (containerRef.value) {
      containerRef.value.scrollTop = 0;
    }

    // 等 DOM 更新后测量新元素高度
    nextTick(() => {
      for (let i = 0; i < newData.length; i++) {
        measureItem(i);
      }
    });
  },
  { deep: false },
);

// 监听数据长度变化（加载更多时新增元素）
watch(
  () => props.data.length,
  (newLen, oldLen) => {
    if (newLen > oldLen) {
      // 如果 heights 为空，先初始化
      if (heights.value.length === 0) {
        initHeights();
        return;
      }

      // 新增数据，初始化新元素的高度
      const newHeights = [...heights.value];
      for (let i = oldLen; i < newLen; i++) {
        if (newHeights[i] === undefined) {
          newHeights[i] = props.estimatedItemHeight;
        }
      }
      heights.value = newHeights;

      // 等 DOM 更新后测量新元素高度
      nextTick(() => {
        for (let i = oldLen; i < newLen; i++) {
          measureItem(i);
        }
      });
    } else if (newLen < oldLen) {
      // 数据减少，重新初始化
      initHeights();
      measuredIndices.value.clear();
      // 重置滚动位置到顶部
      scrollTop.value = 0;
      if (containerRef.value) {
        containerRef.value.scrollTop = 0;
      }
    } else if (newLen > 0 && heights.value.length === 0) {
      // 有数据但 heights 为空，初始化
      initHeights();
    }
  },
);

onMounted(() => {
  if (props.data.length > 0) {
    initHeights();
  }
});

// 暴露方法
defineExpose({
  scrollTo: (index: number) => {
    if (containerRef.value) {
      containerRef.value.scrollTop = getOffset(index);
    }
  },
});
</script>

<style scoped>
.virtual-list-container {
  position: relative;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
  flex-shrink: 0;
}
/* 当没有固定高度时，使用 flex: 1 自适应父元素高度 */
.virtual-list-container:not([style*='height']) {
  flex: 1;
  min-height: 0;
}
.virtual-list-phantom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
  pointer-events: none;
}
.virtual-list-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  will-change: transform;
}
.virtual-list-item {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 16px;
}
/* 底部状态条：绝对定位到列表项总高度处，始终贴在真正的内容末尾 */
.virtual-list-footer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
.virtual-list-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  font-size: 14px;
  color: #909399;
  gap: 8px;
}
.virtual-list-finished {
  text-align: center;
  padding: 16px 0;
  font-size: 14px;
  color: #c0c4cc;
}
</style>
