<template>
  <div class="tag-list">
    <el-card class="search" shadow="never">
      <el-form inline>
        <el-form-item label="标签名">
          <el-input
            v-model="keyword"
            placeholder="按标签名搜索"
            clearable
            style="width: 150px"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-container>
      <el-main style="padding: 10px 0 0 0">
        <el-card>
          <template #header>标签管理</template>
          <el-table
            ref="tagTableRef"
            v-loading="loading"
            :data="list"
            stripe
            height="calc(100vh - 410px)"
            empty-text=""
            @scroll="handleTableScroll"
          >
            <el-table-column
              prop="tag"
              label="标签"
              min-width="260"
              show-overflow-tooltip
            />
            <el-table-column
              prop="count"
              label="题目数"
              width="120"
              align="center"
            />
            <el-table-column label="操作" width="180" align="center">
              <template #default="{ row }">
                <el-button size="small" type="primary" @click="openRename(row)">
                  重命名
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>

            <template #empty>
              <el-empty
                v-if="!loading && list.length === 0"
                :image-size="160"
                description="暂无标签"
              />
            </template>
          </el-table>

          <div v-if="total > 0" class="list-total">
            共 {{ total }} 条，已加载 {{ list.length }} 条
          </div>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog v-model="renameVisible" title="重命名标签" width="420px">
      <el-form label-width="80px">
        <el-form-item label="原标签">
          <el-input :model-value="currentTag" disabled />
        </el-form-item>
        <el-form-item label="新标签" required>
          <el-input v-model="newTag" placeholder="请输入新标签名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="renameVisible = false">取消</el-button>
        <el-button type="primary" @click="doRename">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTagStats, renameTag, deleteTag } from '@/services';
import { getTableScrollBody } from '@/utils';
import type { ITagStat } from '@/types';

const PAGE_SIZE = 50;

const list = ref<ITagStat[]>([]);
const keyword = ref('');
const total = ref(0);
const currentPage = ref(1);
const loading = ref(true);
const loadingMore = ref(false);
const renameVisible = ref(false);
const currentTag = ref('');
const newTag = ref('');

// append=true 追加下一页；否则回到第一页（首次加载 / 重命名删除后刷新）
const load = async (append = false) => {
  if (!append) {
    currentPage.value = 1;
    loading.value = true;
  } else {
    loadingMore.value = true;
  }
  try {
    const res = await getTagStats({
      currentPage: currentPage.value,
      pageSize: PAGE_SIZE,
      keyword: keyword.value,
    });
    const rows = res?.result ?? [];
    total.value = res?.total ?? 0;
    list.value = append ? [...list.value, ...rows] : rows;
  } finally {
    loading.value = false;
    loadingMore.value = false;
    // 数据就绪后重新绑定滚动容器（表格内部滚动条此时才出现）
    nextTick(() => {
      setTimeout(bindTableScroll, 100);
      // 数据不满一屏（无滚动空间）时自动继续加载下一页，直到撑满或到底
      setTimeout(() => {
        if (
          scrollBodyEl &&
          list.value.length < total.value &&
          !loadingMore.value &&
          scrollBodyEl.scrollHeight <= scrollBodyEl.clientHeight + 50
        ) {
          currentPage.value += 1;
          void load(true);
        }
      }, 200);
    });
  }
};

const onSearch = () => {
  currentPage.value = 1;
  list.value = [];
  load();
};
const onReset = () => {
  keyword.value = '';
  currentPage.value = 1;
  list.value = [];
  load();
};

const tagTableRef = ref();
let scrollBodyEl: HTMLElement | null = null;

const handleTableScroll = () => {
  if (!scrollBodyEl) return;
  const { scrollTop, clientHeight, scrollHeight } = scrollBodyEl;
  if (
    scrollTop + clientHeight >= scrollHeight - 50 &&
    !loadingMore.value &&
    list.value.length < total.value
  ) {
    currentPage.value += 1;
    void load(true);
  }
};

const bindTableScroll = () => {
  if (scrollBodyEl) {
    scrollBodyEl.removeEventListener('scroll', handleTableScroll);
  }
  scrollBodyEl = getTableScrollBody(tagTableRef.value);
  if (scrollBodyEl) {
    scrollBodyEl.addEventListener('scroll', handleTableScroll, {
      passive: true,
    });
  }
};

const openRename = (row: unknown) => {
  const r = row as ITagStat;
  currentTag.value = r.tag;
  newTag.value = '';
  renameVisible.value = true;
};

const doRename = async () => {
  const fresh = newTag.value.trim();
  if (!fresh) {
    ElMessage.warning('请输入新标签名');
    return;
  }
  await renameTag({ oldTag: currentTag.value, newTag: fresh });
  ElMessage.success('重命名成功');
  renameVisible.value = false;
  load();
};

const handleDelete = (row: unknown) => {
  const r = row as ITagStat;
  ElMessageBox.confirm(
    `确定删除「${r.tag}」吗？将从所有题目中移除该标签`,
    '提示',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(() => {
    deleteTag({ tag: r.tag }).then(() => {
      ElMessage.success('删除成功');
      load();
    });
  });
};

onMounted(load);
onUnmounted(() => {
  if (scrollBodyEl) {
    scrollBodyEl.removeEventListener('scroll', handleTableScroll);
    scrollBodyEl = null;
  }
});
</script>

<style scoped>
.tag-list {
  width: 100%;
}
.search :deep(.el-form-item) {
  margin-bottom: 0;
}
/* 列表总数状态：与违禁词/用户等管理页保持一致 */
.list-total {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
}
</style>
