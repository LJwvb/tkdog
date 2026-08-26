<template>
  <div class="announcement-list">
    <el-card>
      <template #header>
        <div class="header">
          <span>公告管理</span>
          <el-button type="primary" @click="openDialog">发布公告</el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="公告列表" name="normal">
          <el-table v-loading="loading" :data="list" stripe>
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="content" label="内容" min-width="280" />
            <el-table-column label="发布时间" width="170">
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
          </el-table>

          <el-empty
            v-if="!loading && list.length === 0"
            :image-size="160"
            description="暂无公告"
          />
        </el-tab-pane>
        <el-tab-pane label="已删除公告" name="deleted">
          <el-table v-loading="deletedLoading" :data="deletedList" stripe>
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="content" label="内容" min-width="280" />
            <el-table-column label="发布时间" width="170">
              <template #default="{ row }">
                {{ transitionTime(row.ctime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ row }">
                <el-button
                  size="small"
                  type="success"
                  @click="handleRestore(row)"
                >
                  恢复
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-empty
            v-if="!deletedLoading && deletedList.length === 0"
            :image-size="160"
            description="没有已删除的公告"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 发布公告弹窗 -->
    <el-dialog v-model="dialogVisible" title="发布公告" width="520px">
      <el-form label-width="70px">
        <el-form-item label="标题" required>
          <el-input
            v-model="form.title"
            placeholder="请输入公告标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入公告内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
  getDeletedAnnouncements,
  restoreAnnouncement,
} from '@/services';
import { transitionTime } from '@/utils';
import type { IAnnouncement } from '@/types';

const list = ref<IAnnouncement[]>([]);
const loading = ref(true);
const dialogVisible = ref(false);
const activeTab = ref('normal');
const deletedList = ref<IAnnouncement[]>([]);
const deletedLoading = ref(false);
const form = reactive({
  title: '',
  content: '',
});

const load = async () => {
  loading.value = true;
  list.value = (await getAnnouncements()) ?? [];
  loading.value = false;
};

const openDialog = () => {
  form.title = '';
  form.content = '';
  dialogVisible.value = true;
};

const handleAdd = async () => {
  const title = form.title.trim();
  if (!title) {
    ElMessage.warning('请输入公告标题');
    return;
  }
  await addAnnouncement({ title, content: form.content.trim() });
  ElMessage.success('发布成功');
  dialogVisible.value = false;
  load();
};

const handleDelete = (row: unknown) => {
  const r = row as IAnnouncement;
  ElMessageBox.confirm(`确定删除「${r.title}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteAnnouncement({ id: r.id }).then(() => {
      ElMessage.success('删除成功');
      load();
    });
  });
};

const loadDeleted = async () => {
  deletedLoading.value = true;
  deletedList.value = (await getDeletedAnnouncements()) ?? [];
  deletedLoading.value = false;
};

const handleRestore = (row: unknown) => {
  const r = row as IAnnouncement;
  restoreAnnouncement({ id: r.id }).then(() => {
    ElMessage.success('已恢复');
    loadDeleted();
    load();
  });
};

const handleTabChange = (name: string | number) => {
  if (name === 'deleted') {
    loadDeleted();
  }
};

onMounted(load);
</script>

<style scoped>
.announcement-list {
  width: 100%;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
