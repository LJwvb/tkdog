<template>
  <div class="title-small">
    <div class="test-basket">
      <el-badge :value="badgeValue" :max="10" class="badge">
        <div class="basket-btn" @click="drawerClick">试题篮</div>
      </el-badge>
    </div>

    <el-drawer
      v-model="drawer"
      v-model:visible="drawer"
      title="试题篮"
      size="50%"
    >
      <el-table :data="basketTableData" style="width: 100%">
        <el-table-column label="试题" min-width="200">
          <template #default="scope">
            <div>{{ scope.row.question }}</div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="70">
          <template #default="scope">
            <div>{{ questionType(Number(scope.row.questionType)) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="难度" width="70">
          <template #default="scope">
            <div>{{ difficulty(Number(scope.row.difficulty)) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" min-width="120">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon><timer /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.data }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-if="store.state.selectedTopic.length" class="basket-actions">
        <el-button type="primary" @click="getPaper"> 组卷 </el-button>
        <el-button @click="clearAll"> 清空 </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { questionType, difficulty } from '@/utils';
import type { IQuestion } from '@/types';

import router from '@/router';
const store = useStore();
const drawer = ref(false);
const badgeValue = ref(0);

const basketTableData = ref([]);

watchEffect(
  () => {
    badgeValue.value = store.state.selectedTopic.length;
    basketTableData.value = store.state.selectedTopic;
  },
  { flush: 'post' },
);

const drawerClick = () => {
  drawer.value = true;
};

const handleDelete = (index: number) => {
  const selectedTopic = store.state.selectedTopic as IQuestion[];
  // 拷贝后删除，避免直接 mutate store state
  const next = [...selectedTopic];
  next.splice(index, 1);
  store.commit('addSelectedTopic', next);
};
const getPaper = () => {
  router.push('/addPaper');
  drawer.value = false;
};
const clearAll = () => {
  ElMessageBox.confirm('确定清空试题篮吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.commit('addSelectedTopic', []);
    ElMessage.success('清空成功');
  });
};
</script>
<style scoped>
.test-basket {
  position: fixed;
  bottom: 160px;
  right: 5px;
  width: 25px;
}

:deep(.el-badge__content.is-fixed) {
  transform: translateY(-50%) translateX(-50%);
}
.basket-btn {
  width: 25px;
  background-color: #409eff;
  color: #fff;
  border-radius: 3px;
  text-align: center;
  padding: 15px 5px 15px 2px;
}
.btn {
  margin-top: 50px;
}

/* 移动端：抽屉占满更多宽度，浮动按钮更贴边 */
@media (max-width: 768px) {
  :deep(.el-drawer) {
    width: 90% !important;
  }

  .test-basket {
    bottom: 120px;
    right: 0;
  }

  .basket-btn {
    width: 22px;
    padding: 12px 4px 12px 2px;
    font-size: 12px;
  }
}

/* 抽屉内表格优化 */
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;
}
:deep(.el-table) {
  flex: 1;
  border-radius: 6px;
  overflow: hidden;
}
:deep(.el-table th) {
  background: #f5f7fa !important;
  font-weight: 600;
  color: #303133;
}
:deep(.el-table__row:hover > td) {
  background: #f5f7fa !important;
}
:deep(.el-table .cell) {
  line-height: 1.6;
}
/* 试题内容限制宽度和换行 */
:deep(.el-table .el-table_1_column_1 .cell) {
  max-width: 300px;
  white-space: normal;
  word-break: break-all;
}
/* 抽屉底部按钮区 */
.basket-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}
</style>
