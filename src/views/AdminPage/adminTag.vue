<template>
  <div class="tag-list">
    <el-card>
      <template #header>标签管理</template>
      <el-table v-loading="loading" :data="list" stripe>
        <el-table-column prop="tag" label="标签" min-width="200" />
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
            <el-button size="small" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty
        v-if="!loading && list.length === 0"
        :image-size="160"
        description="暂无标签"
      />
    </el-card>

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
import type { ITagStat } from '@/types';

const list = ref<ITagStat[]>([]);
const loading = ref(true);
const renameVisible = ref(false);
const currentTag = ref('');
const newTag = ref('');

const load = async () => {
  loading.value = true;
  list.value = (await getTagStats()) ?? [];
  loading.value = false;
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
</script>

<style scoped>
.tag-list {
  width: 100%;
  padding: 20px;
}
</style>
