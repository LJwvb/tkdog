<template>
  <div class="title-small">
    <div class="test-basket">
      <el-badge :value="badgeValue" :max="10" class="badge">
        <div @click="drawerClick" class="basket-btn">试题篮</div>
      </el-badge>
    </div>

    <el-drawer v-model="drawer" title="试题篮" size="50%" v-model:visible="drawer">
      <el-table :data="basketTableData" style="width: 100%">
        <el-table-column label="试题">
          <template #default="scope">
            <div>{{ scope.row.question }}</div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="80">
          <template #default="scope">
            <div>{{ questionType(Number(scope.row.questionType)) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="难度" width="80">
          <template #default="scope">
            <div>{{ difficulty(Number(scope.row.difficulty)) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon>
                <timer />
              </el-icon>
              <span style="margin-left: 10px">{{ scope.row.data }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="store.state.selectedTopic.length">
        <el-button @click="getPaper" type="primary" class="btn">
          组卷
        </el-button>
        <el-button @click="clearAll" type="primary" class="btn">
          清空
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { questionType, difficulty } from '@/utils';
import { getPaperQuestion } from '@/services';
import type { IGetPaperParams } from '@/types';
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

const handleDelete = (row: any) => {
  // 获取之前选中的题目
  const selectedTopic = store.state.selectedTopic;
  // 删除当前选中的题目
  selectedTopic.splice(row, 1);
  store.commit('addSelectedTopic', selectedTopic);
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

::v-deep .el-badge__content.is-fixed {
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
</style>
