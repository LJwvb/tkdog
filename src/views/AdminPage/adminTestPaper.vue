<template>
  <div class="hello" style="width: 100%">
    <!-- 搜索：与题目管理一致，置于页面顶部 -->
    <div class="search">
      <el-form :model="form" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="form.keyword"
            placeholder="按试卷名称或标签搜索"
            clearable
            @keyup.enter="onSearch"
            @clear="onSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-container>
      <el-main style="padding: 10px">
        <el-card>
          <el-tabs v-model="activeNames" @tab-click="handleClick">
            <el-tab-pane label="未审核的试卷" name="nochk"></el-tab-pane>
            <el-tab-pane label="已审核的试卷" name="chk"></el-tab-pane>
            <el-tab-pane label="已删除的试卷" name="deleted"></el-tab-pane>
          </el-tabs>
          <!-- 未审核 -->
          <div v-if="NoChkPaper?.length === 0 && activeNames === 'nochk'">
            <el-empty :image-size="200" description="没有未审核试卷" />
          </div>
          <div
            v-if="activeNames === 'nochk'"
            v-loading="loading"
            element-loading-text="加载中..."
          >
            <VirtualList
              v-if="NoChkPaper.length > 0"
              :data="noChkRows"
              height="auto"
              :estimated-item-height="240"
              :loading="nochkLoadingMore"
              :finished="NoChkPaper.length >= noChkTotal"
              show-back-top
              @load-more="loadMoreNoChk"
            >
              <template #default="{ item }">
                <div class="paper-row">
                  <div
                    v-for="paper in item"
                    :key="paper.paper_id"
                    class="test-card"
                  >
                    <TestCard
                      :paper="paper"
                      activeNames="nochk"
                      :name="
                        paper?.purview === PaperPurview.Public ? '公开' : '私有'
                      "
                      @check="check"
                      @uncheck="uncheck"
                      @delete="deletePaper"
                    />
                  </div>
                </div>
              </template>
            </VirtualList>
            <div v-if="noChkTotal > 0" class="list-total">
              共 {{ noChkTotal }} 条，已加载 {{ NoChkPaper.length }} 条
            </div>
          </div>
          <!-- 已审核 -->
          <div v-if="ChkPaper?.length === 0 && activeNames === 'chk'">
            <el-empty :image-size="200" description="没有已审核试卷" />
          </div>
          <div
            v-if="activeNames === 'chk'"
            v-loading="loading"
            element-loading-text="加载中..."
          >
            <VirtualList
              v-if="ChkPaper.length > 0"
              :data="chkRows"
              height="auto"
              :estimated-item-height="240"
              :loading="chkLoadingMore"
              :finished="ChkPaper.length >= chkTotal"
              show-back-top
              @load-more="loadMoreChk"
            >
              <template #default="{ item }">
                <div class="paper-row">
                  <div
                    v-for="paper in item"
                    :key="paper.paper_id"
                    class="test-card"
                  >
                    <TestCard
                      :paper="paper"
                      activeNames="chk"
                      :name="
                        paper?.purview === PaperPurview.Private
                          ? '私有个人试卷'
                          : '公开试卷'
                      "
                      @delete="deletePaper"
                    />
                  </div>
                </div>
              </template>
            </VirtualList>
            <div v-if="chkTotal > 0" class="list-total">
              共 {{ chkTotal }} 条，已加载 {{ ChkPaper.length }} 条
            </div>
          </div>
          <!-- 已删除 -->
          <div v-if="DeletedPaper?.length === 0 && activeNames === 'deleted'">
            <el-empty :image-size="200" description="没有已删除的试卷" />
          </div>
          <div
            v-if="activeNames === 'deleted'"
            v-loading="loading"
            element-loading-text="加载中..."
          >
            <VirtualList
              v-if="DeletedPaper.length > 0"
              :data="deletedRows"
              height="auto"
              :estimated-item-height="240"
              :loading="deletedLoadingMore"
              :finished="DeletedPaper.length >= deletedTotal"
              show-back-top
              @load-more="loadMoreDeleted"
            >
              <template #default="{ item }">
                <div class="paper-row">
                  <div
                    v-for="paper in item"
                    :key="paper.paper_id"
                    class="test-card"
                  >
                    <TestCard
                      :paper="paper"
                      activeNames="deleted"
                      name="已删除"
                      @restore="restorePaperFun"
                    />
                  </div>
                </div>
              </template>
            </VirtualList>
            <div v-if="deletedTotal > 0" class="list-total">
              共 {{ deletedTotal }} 条，已加载 {{ DeletedPaper.length }} 条
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import TestCard from '@/components/TestCard/index.vue';
import VirtualList from '@/components/VirtualList/index.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { parseHashQuery, firstQueryValue } from '@/utils';

import {
  getNoChkPaper,
  chkPaper,
  getAllChkPaper,
  deletePapers,
  getDeletedPapers,
  restorePaper,
} from '@/services';
import { PaperPurview, type IPaperCard } from '@/types';

interface IChkPapers {
  paperId: string;
  chkState: number;
  activeNames: string;
}
const { index } = parseHashQuery();
const NoChkPaper = ref<IPaperCard[]>([]); //获取未审核试卷
const ChkPaper = ref<IPaperCard[]>([]); //获取已审核试卷
const DeletedPaper = ref<IPaperCard[]>([]); //获取已删除试卷
const activeNames = ref(firstQueryValue(index, 'nochk'));
const loading = ref(true);
const noChkTotal = ref(0);
const chkTotal = ref(0);
const deletedTotal = ref(0);
// 各 tab 的滚动加载中状态
const nochkLoadingMore = ref(false);
const chkLoadingMore = ref(false);
const deletedLoadingMore = ref(false);

const nochkParams = reactive({ currentPage: 1, pageSize: 10, keyword: '' });
const chkParams = reactive({ currentPage: 1, pageSize: 10, keyword: '' });
const deletedParams = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: '',
});

// 搜索：把关键词同步进三个 tab 的查询参数，再重载当前 tab（切 tab 时会自动带词重查）
const form = reactive({ keyword: '' });
const applyKeyword = () => {
  const kw = form.keyword.trim();
  nochkParams.keyword = kw;
  chkParams.keyword = kw;
  deletedParams.keyword = kw;
};
const reloadCurrentTab = () => {
  loading.value = true;
  if (activeNames.value === 'chk') {
    void getAllChkPapers();
  } else if (activeNames.value === 'deleted') {
    void getDeletedPapersFun();
  } else {
    void getNoChkPapers();
  }
};
const onSearch = () => {
  applyKeyword();
  reloadCurrentTab();
};
const onReset = () => {
  form.keyword = '';
  applyKeyword();
  reloadCurrentTab();
};

// ===== 通用：分页请求 =====
interface IPageParams {
  currentPage: number;
  pageSize: number;
}
interface IPaperPageRes {
  result?: IPaperCard[];
  total?: number;
}
// append=true 追加下一页；否则回到第一页（首次加载 / 审核删除后刷新）
const loadPapers = async (
  fetcher: (params: IPageParams) => Promise<IPaperPageRes>,
  params: IPageParams,
  listRef: typeof NoChkPaper,
  totalRef: typeof noChkTotal,
  append = false,
) => {
  if (!append) {
    params.currentPage = 1;
  }
  const res = await fetcher(params);
  const list = res?.result ?? [];
  listRef.value = append ? [...listRef.value, ...list] : list;
  totalRef.value = res?.total ?? 0;
  loading.value = false;
};

const getNoChkPapers = async (append = false) => {
  await loadPapers(getNoChkPaper, nochkParams, NoChkPaper, noChkTotal, append);
};
const getAllChkPapers = async (append = false) => {
  await loadPapers(getAllChkPaper, chkParams, ChkPaper, chkTotal, append);
};
const getDeletedPapersFun = async (append = false) => {
  await loadPapers(
    getDeletedPapers,
    deletedParams,
    DeletedPaper,
    deletedTotal,
    append,
  );
};

// ===== 三个 tab 各自的滚动追加（VirtualList 触底触发）=====
const loadMoreNoChk = async () => {
  if (nochkLoadingMore.value || NoChkPaper.value.length >= noChkTotal.value)
    return;
  nochkParams.currentPage += 1;
  nochkLoadingMore.value = true;
  try {
    await getNoChkPapers(true);
  } catch (err) {
    nochkParams.currentPage -= 1;
  } finally {
    nochkLoadingMore.value = false;
  }
};
const loadMoreChk = async () => {
  if (chkLoadingMore.value || ChkPaper.value.length >= chkTotal.value) return;
  chkParams.currentPage += 1;
  chkLoadingMore.value = true;
  try {
    await getAllChkPapers(true);
  } catch (err) {
    chkParams.currentPage -= 1;
  } finally {
    chkLoadingMore.value = false;
  }
};
const loadMoreDeleted = async () => {
  if (
    deletedLoadingMore.value ||
    DeletedPaper.value.length >= deletedTotal.value
  )
    return;
  deletedParams.currentPage += 1;
  deletedLoadingMore.value = true;
  try {
    await getDeletedPapersFun(true);
  } catch (err) {
    deletedParams.currentPage -= 1;
  } finally {
    deletedLoadingMore.value = false;
  }
};

// ===== 行分块：VirtualList 是单列虚拟渲染，把卡片按每行 N 张切成"行"作为列表项，
// 保持多列卡片网格的外观；追加数据时未变动的行对象复用原引用，
// 让 VirtualList 判定为"加载更多"而不是"切换数据源"（避免滚动位置被重置）=====
const ROW_COLS = 3;
const makeRowChunker = (cols: number) => {
  let cache: IPaperCard[][] = [];
  return (list: IPaperCard[]): IPaperCard[][] => {
    const needed = Math.ceil(list.length / cols);
    const out: IPaperCard[][] = [];
    for (let i = 0; i < needed; i++) {
      const prev = cache[i];
      const seg = list.slice(i * cols, i * cols + cols);
      const same =
        !!prev &&
        prev.length === seg.length &&
        seg.every((it, j) => it === prev[j]);
      out.push(same ? prev : seg);
    }
    cache = out;
    return out;
  };
};
const nochkRowsChunker = makeRowChunker(ROW_COLS);
const chkRowsChunker = makeRowChunker(ROW_COLS);
const deletedRowsChunker = makeRowChunker(ROW_COLS);
const noChkRows = computed(() => nochkRowsChunker(NoChkPaper.value));
const chkRows = computed(() => chkRowsChunker(ChkPaper.value));
const deletedRows = computed(() => deletedRowsChunker(DeletedPaper.value));

const restorePaperFun = (paperId: number) => {
  restorePaper({ paperId }).then(() => {
    ElMessage.success('已恢复');
    getDeletedPapersFun();
  });
};
const handleClick = (tab: { props: { name?: string | number } }) => {
  loading.value = true;
  // 切回 tab 时重新拉第一页：列表可能已被审核/删除操作改动过
  if (tab.props.name === 'nochk') {
    getNoChkPapers();
  } else if (tab.props.name === 'deleted') {
    getDeletedPapersFun();
  } else {
    getAllChkPapers();
  }
};

onMounted(() => {
  void getNoChkPapers();
  getAllChkPapers();
});
//删除试卷
const deletePaper = (paper_id: number, activeNames: string) => {
  deletePapers({ paperId: paper_id }).then(() => {
    if (activeNames === 'nochk') {
      getNoChkPapers();
    } else {
      getAllChkPapers();
    }
  });
};

const check = (params: IChkPapers) => {
  chkPaper(params).then(() => {
    if (activeNames.value === 'nochk') {
      getNoChkPapers();
    } else {
      getAllChkPapers();
    }
  });
};
const uncheck = (params: IChkPapers) => {
  chkPaper(params).then(() => {
    if (activeNames.value === 'nochk') {
      getNoChkPapers();
    } else {
      getAllChkPapers();
    }
  });
};
</script>

<style scoped>
/* 每行卡片容器：配合 VirtualList 行分块保持多列网格外观 */
.paper-row {
  display: flex;
  flex-wrap: wrap;
}

.test-card {
  width: 400px;
  height: 200px;
  margin-right: 20px;
  margin-bottom: 20px;
}

/* 搜索栏：样式与题目管理一致（flex 行内表单、自然高度居中），并吸顶于导航栏（60px）下方。
   注意：el-input 上不要再挂 .search 类，否则会继承下面的工具栏高度/背景导致错位 */
.search {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  position: sticky;
  top: 60px;
  z-index: 30;
  background: var(--el-bg-color, #fff);
  padding: 0 4px;
}

/* 已加载统计：与题目管理一致 */
.list-total {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
}

/* 页签吸顶；el-card / el-card__body / el-main 默认 overflow 都会截住 sticky，需全部放开 */
.hello :deep(.el-card),
.hello :deep(.el-card__body),
.hello :deep(.el-main) {
  overflow: visible;
}
.hello :deep(.el-tabs) {
  position: sticky;
  /* 60 导航栏 + 40 搜索栏 = 100，页签吸在搜索栏下方 */
  top: 100px;
  z-index: 29;
  background: var(--el-bg-color, #fff);
  padding-top: 6px;
  padding-bottom: 4px;
}
.hello :deep(.el-tabs__header) {
  margin: 0;
}
</style>
