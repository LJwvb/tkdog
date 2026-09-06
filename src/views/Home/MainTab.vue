<template>
  <div class="index">
    <!-- 顶部 hero 横幅 -->
    <div class="home-hero">
      <div class="hero-glow hero-glow-1"></div>
      <div class="hero-glow hero-glow-2"></div>
      <div class="hero-grid"></div>
      <div class="hero-content">
        <div class="hero-badge">AI 智能刷题平台</div>
        <h2 class="hero-title">
          题库狗<span class="hero-dot">·</span>高效备战每一场面试
        </h2>
        <p class="hero-sub">
          海量精选真题 · AI解题提示 · 智能组卷 · AI答题报告 ·
          AI智能判分，一站式面试刷题平台
        </p>
      </div>
    </div>

    <div
      v-loading="loading"
      class="index-left"
      element-loading-text="加载中..."
    >
      <el-tabs v-model="currentTab" type="card" class="el-table">
        <el-tab-pane
          v-for="item in subjectIDList"
          :key="item.subjectID"
          :label="item.subjectName"
          :name="item.subjectID"
        >
          <SubTab
            :questionList="questionList"
            :catalogIDList="catalogIDList"
            :catalogID="currentSubTab"
            :subjectID="currentTab"
            :itemSubjectID="Number(item?.subjectID)"
            :loadingMore="loadingMore"
            :noMore="noMore"
            :listHeight="'72.7vh'"
            type="home"
            @tabClick="tabClick"
            @loadMore="loadMore"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue';
import SubTab from '@/components/SubTab/index.vue';
import { getQuestionList } from '@/services';
import { parseHashQuery } from '@/utils';
import type { IQuestion, IGetQuestionsParams } from '@/types';

const { subjectID, catalogID } = parseHashQuery();

const loading = ref(true);
const loadingMore = ref(false);
const noMore = ref(false);

const questionList = ref<IQuestion[]>([]);
const subjectIDList = ref<Array<{ subjectID?: number; subjectName?: string }>>(
  [],
);
const catalogIDList = ref<Array<{ catalogID?: number; catalogName?: string }>>(
  [],
);
const currentPage = ref(1);
const total = ref(0);
const pageSize = 10;

// 每个 tab 组合的数据缓存，key 为 `${subjectID}_${catalogID}`
interface ITabCache {
  list: IQuestion[];
  page: number;
  total: number;
  noMore: boolean;
}
const tabCache = ref<Map<string, ITabCache>>(new Map());
// 标记是否初始加载完成
const inited = ref(false);

// 选中的主标签页
const currentTab = ref<number>(Number(subjectID) || 0);
// 选中的子标签页
const currentSubTab = ref<number>(Number(catalogID) || 0);

// 获取题目列表
const getQuestionListData = async (
  params: IGetQuestionsParams,
  append = false,
) => {
  const res = await getQuestionList(params);
  if (append) {
    questionList.value = [...questionList.value, ...res.result];
  } else {
    questionList.value = res.result;
  }
  subjectIDList.value =
    res.subjectNameList as unknown as typeof subjectIDList.value;
  catalogIDList.value =
    res.catalogNameList as unknown as typeof catalogIDList.value;
  total.value = res.total || 0;
  noMore.value = questionList.value.length >= total.value;
  loading.value = false;
  loadingMore.value = false;

  // 存入缓存
  const cacheKey = `${params.subjectID}_${params.catalogID}`;
  tabCache.value.set(cacheKey, {
    list: [...questionList.value],
    page: currentPage.value,
    total: total.value,
    noMore: noMore.value,
  });
};

// 从缓存恢复数据
const restoreFromCache = (subjectID: number, catalogID: number): boolean => {
  const cacheKey = `${subjectID}_${catalogID}`;
  const cached = tabCache.value.get(cacheKey);
  if (cached && cached.list.length > 0) {
    questionList.value = cached.list;
    currentPage.value = cached.page;
    total.value = cached.total;
    noMore.value = cached.noMore;
    loading.value = false;
    return true;
  }
  return false;
};

// 保存指定组合的数据到缓存：key 必须显式传入。
// 切换 tab 时 currentTab 已被 v-model 改写，若直接取当前值会把旧数据存到新 key 下造成缓存污染
const saveToCache = (sid: number, cid: number) => {
  if (questionList.value.length > 0) {
    tabCache.value.set(`${sid}_${cid}`, {
      list: [...questionList.value],
      page: currentPage.value,
      total: total.value,
      noMore: noMore.value,
    });
  }
};

// 主 tab 切换：必须用 watch，不能用 @tab-click。
// el-tabs 会先把 v-model 同步成新的 subjectID 再触发 tab-click，于是：
// ① 拿 currentTab 判重恒等，切换直接 return，列表不刷新；
// ② saveToCache 用当前的（已是新的）currentTab 存缓存，旧数据被写到新 key 下，
//    紧接着 restoreFromCache 命中这份脏缓存，显示的还是上一个科目的题目。
// watch 能同时拿到新旧值，两个问题一起解决。
watch(currentTab, (newVal, oldVal) => {
  const newSubjectID = Number(newVal) || 0;
  const oldSubjectID = Number(oldVal) || 0;
  if (newSubjectID === oldSubjectID) return;

  // 用切换前的 tab 组合保存缓存
  saveToCache(oldSubjectID, currentSubTab.value);

  currentSubTab.value = 0;
  currentPage.value = 1;
  noMore.value = false;

  // 有缓存直接恢复，否则重新请求
  if (!restoreFromCache(newSubjectID, 0)) {
    loading.value = true;
    void getQuestionListData({
      type: 'home',
      subjectID: newSubjectID,
      catalogID: 0,
      currentPage: 1,
      pageSize,
    });
  }
});

const tabClick = (val: number) => {
  if (val === currentSubTab.value) return;

  // 先用切换前的组合保存缓存（currentSubTab 此时仍是旧值）
  saveToCache(currentTab.value, currentSubTab.value);

  currentSubTab.value = val;
  currentPage.value = 1;
  noMore.value = false;

  // 尝试从缓存恢复
  if (!restoreFromCache(currentTab.value, val)) {
    // 没有缓存，重新请求
    loading.value = true;
    const params = {
      type: 'home',
      subjectID: currentTab.value,
      catalogID: val,
      currentPage: 1,
      pageSize,
    };
    getQuestionListData(params);
  }
};

// 加载更多
const loadMore = async () => {
  if (loadingMore.value || noMore.value) return;
  loadingMore.value = true;
  currentPage.value += 1;
  const params = {
    type: 'home',
    subjectID: currentTab.value,
    catalogID: currentSubTab.value,
    currentPage: currentPage.value,
    pageSize,
  };
  await getQuestionListData(params, true);
};

// 初始加载
watchEffect(() => {
  if (inited.value) return;
  const params = {
    type: 'home',
    subjectID: currentTab.value,
    catalogID: currentSubTab.value,
    currentPage: currentPage.value,
    pageSize,
  };
  loading.value = true;
  noMore.value = false;
  getQuestionListData(params).then(() => {
    inited.value = true;
  });
});
</script>
<style scoped>
/* ===== 首页 Hero 横幅 ===== */
.home-hero {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 34px 40px;
  /* 浅色渐变，与页面底色自然衔接 */
  background: linear-gradient(
      120deg,
      rgba(0, 166, 255, 0.1) 0%,
      rgba(0, 200, 220, 0.05) 45%,
      rgba(255, 255, 255, 0) 100%
    ),
    #fff;
  border: 1px solid rgba(0, 166, 255, 0.12);
  box-shadow: 0 6px 24px rgba(31, 45, 61, 0.08);
  color: #1f2937;
}
.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
}
.hero-glow-1 {
  width: 300px;
  height: 300px;
  top: -130px;
  right: 12%;
  background: rgba(0, 160, 255, 0.18);
  animation: heroFloat 9s ease-in-out infinite alternate;
}
.hero-glow-2 {
  width: 240px;
  height: 240px;
  bottom: -110px;
  left: 10%;
  background: rgba(0, 200, 220, 0.14);
  animation: heroFloat 11s ease-in-out infinite alternate-reverse;
}
@keyframes heroFloat {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(24px, 18px) scale(1.15);
  }
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(0, 150, 255, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(0, 150, 255, 0.05) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(
    ellipse 70% 90% at 60% 20%,
    rgba(0, 0, 0, 0.8),
    transparent 85%
  );
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 2;
}
.hero-badge {
  display: inline-block;
  padding: 4px 14px;
  margin-bottom: 14px;
  font-size: 12px;
  letter-spacing: 2px;
  color: #0072ff;
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 999px;
  background: rgba(0, 166, 255, 0.08);
}
.hero-title {
  margin: 0 0 10px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #17233a;
}
.hero-dot {
  margin: 0 10px;
  color: #00a6ff;
}
.hero-sub {
  margin: 0;
  font-size: 15px;
  color: #5b6b7f;
  letter-spacing: 1px;
}
@media (max-width: 768px) {
  .home-hero {
    padding: 24px 20px;
  }
  .hero-title {
    font-size: 22px;
  }
  .hero-sub {
    font-size: 13px;
  }
}

.el-table {
  background-color: #fff;
  padding: 20px;
  box-shadow: var(--el-box-shadow-light);
  border-radius: 5px;
  border: 1px solid var(--el-card-border-color);
  min-height: 400px;
}
.index-left {
  width: 100%;
}
:deep(.el-tabs__content) {
  overflow: visible !important;
}
:deep(.el-tabs--card > .el-tabs__header) {
  border-bottom: none !important;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border-radius: 5px !important;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  border: 1px solid var(--el-color-primary) !important;
  border-radius: 5px;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: 1px solid var(--el-border-color-light) !important;
}
</style>
