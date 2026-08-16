<template>
  <div class="paper-page">
    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="按试卷名称或标签搜索"
        clearable
        style="max-width: 360px"
        @input="handleSearch"
      />
    </div>
    <el-tabs v-model="active" class="tabs">
      <el-tab-pane
        v-for="(item, index) in filteredPaperList"
        :key="index"
        :label="item.name"
        :name="index"
        class="tab-pane"
      >
        <div
          v-for="paper in item.value"
          :key="paper.paper_id"
          class="test-card"
        >
          <TestCard :paper="paper" :name="item?.name" />
        </div>
        <div v-if="item.value.length === 0" class="tabs">
          <el-empty :image-size="200" description="没有试卷" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getPaper } from '@/services';
import TestCard from '@/components/TestCard/index.vue';
import type { IPaperCard } from '@/types';

const paperList = ref<Array<{ name?: string; value: IPaperCard[] }>>([]);
const active = ref<string | number>(0);
const keyword = ref('');

const transFromName = (name: string) => {
  if (name === 'personPaper') {
    return '个人的公开的试卷';
  }
  if (name === 'purviewPaper') {
    return '官方试卷';
  }
  return name;
};

const filteredPaperList = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (!kw) return paperList.value;
  return paperList.value.map((item) => ({
    ...item,
    value: (item.value ?? []).filter((p) => {
      const title = String(p.paper_title ?? '').toLowerCase();
      const tags = Array.isArray(p.paper_tags)
        ? p.paper_tags.join(',')
        : String(p.paper_tags ?? '');
      return title.includes(kw) || tags.toLowerCase().includes(kw);
    }),
  }));
});

const handleSearch = () => {
  active.value = 0;
};

onMounted(async () => {
  const res = await getPaper({ type: 'all' });
  paperList.value = Object.keys(res).map((key) => {
    return {
      name: transFromName(key),
      value: res[key] as unknown as IPaperCard[],
    };
  });
});
</script>

<style scoped>
.paper-page {
  width: 100%;
}
.search-bar {
  margin-bottom: 12px;
}
.tabs {
  width: 100%;
  height: 100%;
}
.tab-pane {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.test-card {
  width: 400px;
  height: 200px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
