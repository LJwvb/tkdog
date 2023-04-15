<template>
  <div class="user-info-container">
    <el-card v-if="paperList?.length > 0" class="user-info-paper">
      <div v-for="item in paperList" :key="item.id" class="test-card">
        <TestCard :paper="item" name="上传的试卷" />
      </div>
    </el-card>
    <el-card v-else>
      <el-empty :image-size="200" description="没有创建试卷" />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';

import { getPaper } from '@/services';
import TestCard from '@/components/TestCard/index.vue';
const store = useStore();
const paperList = ref();

onMounted(() => {
  getPaper({ author: store?.state?.userData?.username }).then((res) => {
    paperList.value = res?.data;
  });
});
</script>
<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
.user-info-paper > ::v-deep .el-card__body {
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: space-between;
}
.test-card {
  width: 400px;
  height: 200px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
