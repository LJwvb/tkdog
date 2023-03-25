<template>
  <el-tabs v-model="active" class="tabs">
    <el-tab-pane
      v-for="(item, index) in paperList"
      :key="item.id"
      :label="item.name"
      :name="index"
      class="tab-pane"
    >
      <div class="test-card" v-for="paper in item.value" :key="paper.id">
        <TestCard :paper="paper" :name="item?.name" />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { getPaper } from '@/services';
import TestCard from '@/components/TestCard/index.vue';

const paperList = ref<any>([]);
const active = ref<any>(0);
const transFromName = (name: string) => {
  if (name === 'personPaper') {
    return '个人试卷';
  }
  if (name === 'purviewPaper') {
    return '公开试卷';
  }
};

onMounted(async () => {
  const res = await getPaper({ type: 'all' });
  paperList.value = Object.keys(res.data).map((key) => {
    return {
      name: transFromName(key),
      value: res.data[key],
    };
  });
});
</script>

<style scoped>
.tabs {
  width: 100%;
  height: 100%;
}
.tab-pane {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.test-card {
  width: 400px;
  height: 200px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
