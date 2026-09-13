<template>
  <div class="sensitive-word">
    <el-card>
      <template #header>
        <div class="header">
          <span>违禁词管理</span>
          <el-button type="primary" @click="openDialog">添加</el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="违禁词列表" name="normal">
          <div class="search-bar">
            <el-input
              v-model="keyword"
              placeholder="搜索违禁词（模糊匹配）"
              clearable
              style="width: 260px"
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-table
            ref="wordTableRef"
            v-loading="loading"
            :data="list"
            stripe
            height="calc(100vh - 372px)"
            empty-text=""
          >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="word" label="违禁词" min-width="200" />
            <el-table-column label="级别" width="120" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.level === 2" type="warning">待审核</el-tag>
                <el-tag v-else type="danger">直接拦截</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ctime" label="添加时间" width="180">
              <template #default="{ row }">
                {{ transitionTime(row.ctime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ row }">
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
                description="暂无违禁词"
              />
            </template>
          </el-table>

          <div v-if="total > 0" class="list-total">
            共 {{ total }} 条，已加载 {{ list.length }} 条
          </div>
        </el-tab-pane>
        <el-tab-pane label="已删除违禁词" name="deleted">
          <el-table
            v-loading="deletedLoading"
            :data="deletedWords"
            stripe
            height="calc(100vh - 372px)"
            empty-text=""
          >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="word" label="违禁词" min-width="200" />
            <el-table-column label="级别" width="120" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.level === 2" type="warning">待审核</el-tag>
                <el-tag v-else type="danger">直接拦截</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ctime" label="添加时间" width="180">
              <template #default="{ row }">
                {{ transitionTime(row.ctime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template #default="{ row }">
                <el-button
                  size="small"
                  type="success"
                  @click="handleRestore(row)"
                >
                  恢复
                </el-button>
                <el-button size="small" type="danger" @click="handlePurge(row)">
                  彻底删除
                </el-button>
              </template>
            </el-table-column>

            <template #empty>
              <el-empty
                v-if="!deletedLoading && deletedWords.length === 0"
                :image-size="160"
                description="没有已删除的违禁词"
              />
            </template>
          </el-table>

          <el-pagination
            v-if="deletedTotal > 0"
            v-model:current-page="deletedPage"
            background
            layout="slot, prev, pager, next"
            :total="deletedTotal"
            :page-size="pageSize"
            prev-text="上一页"
            next-text="下一页"
            :hide-on-single-page="true"
            style="margin-top: 12px; justify-content: flex-end"
            @current-change="handleDeletedPageChange"
          >
            <template #default> 共 {{ deletedTotal }} 条 </template>
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加违禁词弹窗 -->
    <el-dialog v-model="dialogVisible" title="添加违禁词" width="440px">
      <el-form label-width="70px">
        <el-form-item label="违禁词" required>
          <el-input
            v-model="form.word"
            placeholder="请输入违禁词"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="form.level" style="width: 100%">
            <el-option label="直接拦截" :value="1" />
            <el-option label="待审核" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getSensitiveWords,
  addSensitiveWord,
  deleteSensitiveWord,
  getDeletedSensitiveWords,
  restoreSensitiveWord,
} from '@/services';
import { transitionTime } from '@/utils';
import { useInfiniteTable } from '@/composables/useInfiniteTable';
import type { ISensitiveWord } from '@/types';

const PAGE_SIZE = 50;
// deleted tab 仍走传统 el-pagination，需独立 pageSize 引用
const pageSize = PAGE_SIZE;

const wordTableRef = ref();
const keyword = ref('');
const activeTab = ref('normal');
const dialogVisible = ref(false);
const form = reactive({
  word: '',
  level: 1,
});

/**
 * 「违禁词列表」tab：滚动追加 + 不足一屏自动补屏
 * 「已删除违禁词」tab：仍保留传统 el-pagination（数据量小，且不需要滚动追加）
 */
const { list, total, loading, reset } = useInfiniteTable<ISensitiveWord>(
  (params) =>
    getSensitiveWords({
      ...params,
      keyword: keyword.value,
    }),
  { pageSize: PAGE_SIZE, tableRef: wordTableRef },
);

const deletedWords = ref<ISensitiveWord[]>([]);
const deletedLoading = ref(false);
const deletedPage = ref(1);
const deletedTotal = ref(0);

const handleSearch = () => {
  void reset();
};

const openDialog = () => {
  form.word = '';
  form.level = 1;
  dialogVisible.value = true;
};

const handleAdd = async () => {
  const word = form.word.trim();
  if (!word) {
    ElMessage.warning('请输入违禁词');
    return;
  }
  await addSensitiveWord({ word, level: form.level });
  ElMessage.success('添加成功');
  dialogVisible.value = false;
  void reset();
};

const handleDelete = (row: unknown) => {
  const r = row as ISensitiveWord;
  ElMessageBox.confirm(`确定删除「${r.word}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteSensitiveWord({ id: r.id }).then(() => {
      ElMessage.success('删除成功');
      void reset();
    });
  });
};

const loadDeleted = async () => {
  deletedLoading.value = true;
  const res = await getDeletedSensitiveWords({
    currentPage: deletedPage.value,
    pageSize: PAGE_SIZE,
  });
  deletedWords.value = res?.result ?? [];
  deletedTotal.value = res?.total ?? 0;
  deletedLoading.value = false;
};

const handleDeletedPageChange = (page: number) => {
  deletedPage.value = page;
  loadDeleted();
};

const handleRestore = (row: unknown) => {
  const r = row as ISensitiveWord;
  restoreSensitiveWord({ id: r.id }).then(() => {
    ElMessage.success('已恢复');
    loadDeleted();
    void reset();
  });
};

// 彻底删除（物理删除，二次强确认）
const handlePurge = (row: unknown) => {
  const r = row as ISensitiveWord;
  ElMessageBox.confirm(
    `彻底删除违禁词「${r.word}」？删除后无法恢复！`,
    '危险操作',
    {
      confirmButtonText: '彻底删除',
      cancelButtonText: '取消',
      type: 'error',
      confirmButtonClass: 'el-button--danger',
    },
  ).then(() => {
    deleteSensitiveWord({ id: r.id, purge: true }).then(() => {
      ElMessage.success('已彻底删除');
      loadDeleted();
    });
  });
};

const handleTabChange = (name: string | number) => {
  if (name === 'deleted') {
    loadDeleted();
  }
};

onMounted(() => {
  void reset();
});
</script>

<style scoped>
.sensitive-word {
  width: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

/* 去掉级别标签的过渡动画 */
:deep(.el-tag) {
  transition: none !important;
}

/* 列表总数状态 */
.list-total {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
}
</style>
