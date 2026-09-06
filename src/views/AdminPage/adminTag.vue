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
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTagStats, renameTag, deleteTag } from '@/services';
import { useInfiniteTable } from '@/composables/useInfiniteTable';
import type { ITagStat } from '@/types';

const tagTableRef = ref();
const keyword = ref('');
const renameVisible = ref(false);
const currentTag = ref('');
const newTag = ref('');

const { list, total, loading, reset } = useInfiniteTable<ITagStat>(
  (params) =>
    getTagStats({
      ...params,
      keyword: keyword.value,
    }),
  { pageSize: 50, tableRef: tagTableRef },
);

const onSearch = () => {
  void reset();
};
const onReset = () => {
  keyword.value = '';
  void reset();
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
  void reset();
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
      void reset();
    });
  });
};

onMounted(() => {
  void reset();
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
