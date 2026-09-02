<template>
  <el-card class="paper-page">
    <div class="search-bar">
      <el-input v-model="keyword" placeholder="按试卷名称或标签搜索" clearable style="max-width: 360px" @input="handleSearch" />
    </div>
    <el-tabs v-model="active" class="tabs">
      <el-tab-pane v-for="(group, index) in groups" :key="group.key" :label="group.name" :name="index" class="tab-pane">
        <div v-for="paper in group.list" :key="paper.paper_id" class="test-card">
          <TestCard :paper="paper" :name="group.name" />
        </div>
        <div v-if="group.list.length === 0" class="tabs">
          <el-empty v-if="!group.loading" :image-size="200" description="没有试卷" />
          <div v-else class="load-status">
            <span class="loading">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              加载中...
            </span>
          </div>
        </div>
        <!-- 滚动加载状态 -->
        <div v-if="group.list.length > 0" class="load-status">
          <span v-if="group.loadingMore" class="loading">
            <el-icon class="is-loading">
              <Loading />
            </el-icon>
            加载中...
          </span>
          <span v-else-if="group.noMore" class="finished">没有更多了</span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <BackToTop />
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import { getPaper } from '@/services';
import TestCard from '@/components/TestCard/index.vue';
import BackToTop from '@/components/BackToTop/index.vue';
import type { IPaperCard } from '@/types';

interface IPaperGroupState {
  key: string;
  name: string;
  list: IPaperCard[];
  total: number;
  page: number;
  // 首次/刷新加载
  loading: boolean;
  // 滚动追加加载
  loadingMore: boolean;
  noMore: boolean;
}

const PAGE_SIZE = 12;
// 触发加载的距离阈值（px）：距底部 300px 时提前加载下一页
const LOAD_THRESHOLD = 300;

// 与后端 getPaperQuestionsList 的分组 key 一一对应
const GROUPS: Array<{ key: string; name: string }> = [
  { key: 'purviewPaper', name: '官方试卷' },
  { key: 'personPaper', name: '个人的公开的试卷' },
];

const createGroups = (): IPaperGroupState[] =>
  GROUPS.map((g) => ({
    key: g.key,
    name: g.name,
    list: [],
    total: 0,
    page: 0,
    loading: false,
    loadingMore: false,
    noMore: false,
  }));

const groups = ref<IPaperGroupState[]>(createGroups());
const active = ref<number>(0);
const keyword = ref('');
const currentGroup = computed(
  () => groups.value[Number(active.value)] as IPaperGroupState | undefined,
);

const loadPapers = async (group: IPaperGroupState, append = false) => {
  if (group.loading || group.loadingMore) return;
  if (append && group.noMore) return;
  const nextPage = append ? group.page + 1 : 1;
  if (append) {
    group.loadingMore = true;
  } else {
    group.loading = true;
  }
  try {
    const res = await getPaper({
      type: 'all',
      currentPage: nextPage,
      pageSize: PAGE_SIZE,
      // 关键词交给服务端过滤，否则只能搜到已加载的这几页
      keyword: keyword.value.trim() || undefined,
    });
    const pageData = res?.[group.key];
    const list = pageData?.list ?? [];
    const total = pageData?.total ?? 0;
    group.list = append ? [...group.list, ...list] : list;
    group.total = total;
    group.page = nextPage;
    group.noMore = group.list.length >= total;
  } catch (err) {
    // 失败时不推进页码，继续滚动可重试
  } finally {
    group.loading = false;
    group.loadingMore = false;
  }
};

// 两个分组的首页一起加载，切 tab 时无需等待
const loadFirstPage = () =>
  Promise.all(groups.value.map((group) => loadPapers(group)));

/**
 * 首屏补偿：内容不足一屏时页面根本没有滚动条，
 * scroll 事件永远不会触发，列表会卡在第一页加载不动。
 * 这里在每次加载完成后检查内容高度，不够就继续拉下一页，
 * 直到出现滚动条（内容超出视口）或数据全部加载完。
 */
const fillViewportIfNeeded = async () => {
  const group = currentGroup.value;
  if (!group) return;
  // 防止接口异常时死循环
  let guard = 0;
  while (guard < 20) {
    if (group.loading || group.loadingMore || group.noMore) return;
    // 等 DOM 更新后再量高度，否则量到的是上一批卡片的高度
    await nextTick();
    const { scrollHeight, clientHeight } = document.documentElement;
    if (clientHeight > 0 && scrollHeight > clientHeight + LOAD_THRESHOLD)
      return;
    guard += 1;
    const before = group.list.length;
    await loadPapers(group, true);
    // 这一页没拿到新数据，直接结束，避免空转
    if (group.list.length === before) return;
  }
};

const handleScroll = () => {
  const group = currentGroup.value;
  if (!group || group.loading || group.loadingMore || group.noMore) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const { scrollHeight, clientHeight } = document.documentElement;
  if (
    scrollTop + clientHeight >= scrollHeight - LOAD_THRESHOLD &&
    clientHeight > 0
  ) {
    void loadPapers(group, true).then(fillViewportIfNeeded);
  }
};

let searchTimer: ReturnType<typeof setTimeout> | null = null;
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    // 搜索条件变了，所有分组重置回第一页
    groups.value = createGroups();
    active.value = 0;
    void loadFirstPage().then(fillViewportIfNeeded);
  }, 300);
};

// 切换分组后同样要补偿：另一个分组的数据量可能不足一屏
watch(active, () => {
  void fillViewportIfNeeded();
});

// 窗口变大后原本够高的内容可能又不足一屏了
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
const onResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    void fillViewportIfNeeded();
  }, 200);
};

onMounted(() => {
  void loadFirstPage().then(fillViewportIfNeeded);
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', onResize);
  if (searchTimer) clearTimeout(searchTimer);
  if (resizeTimer) clearTimeout(resizeTimer);
});
</script>

<style scoped>
.paper-page {
  width: 100%;
  overflow: visible;
}

.paper-page :deep(.el-card__body) {
  overflow: visible;
}

.search-bar {
  position: sticky;
  /* 60 导航栏高度，搜索栏吸在导航栏正下方 */
  top: 60px;
  z-index: 30;
  height: 56px;
  display: flex;
  align-items: center;
  background: var(--el-bg-color, #fff);
  margin-bottom: 0;
  padding: 0 4px;
}

.search-bar :deep(.el-input) {
  max-width: 360px;
}

.tabs :deep(.el-tabs__header) {
  position: sticky;
  /* 60 导航栏 + 56 搜索栏 = 116，页签吸在搜索栏正下方 */
  top: 116px;
  z-index: 29;
  background: var(--el-bg-color, #fff);
  margin: 0;
  padding-top: 6px;
  padding-bottom: 4px;
}

.tabs {
  width: 100%;
}

.tabs :deep(.el-tabs__content) {
  padding: 0;
}

.tabs :deep(.el-tab-pane) {
  margin-left: 0;
  margin-right: 0;
}

.tab-pane {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 16px;
}

.test-card {
  width: calc(25% - 12px);
  min-width: 260px;
  min-height: 180px;
  margin-right: 0 !important;
  margin-bottom: 0 !important;
  transition: transform 0.2s, box-shadow 0.2s;
}

.test-card:hover {
  transform: translateY(-2px);
}

/* 滚动加载状态：占满整行，避免被挤到卡片右侧 */
.load-status {
  width: 100%;
  text-align: center;
  padding: 16px 0 4px;
  font-size: 14px;
  color: #909399;
}

.load-status .loading {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.load-status .finished {
  color: #c0c4cc;
}

@media (max-width: 1400px) {
  .test-card {
    width: calc(33.333% - 11px);
  }
}

@media (max-width: 1000px) {
  .test-card {
    width: calc(50% - 8px);
  }
}

@media (max-width: 600px) {
  .test-card {
    width: 100%;
  }
}
</style>
