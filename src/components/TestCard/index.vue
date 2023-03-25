<template>
  <el-card class="test-paper-container" @click="goPaperDetail">
    <div class="test-title">{{ paper.paper_title }}</div>
    <div class="tags">
      <el-tag v-for="tag in tags" :key="tag" class="tag-item">
        {{ tag }}
      </el-tag>
    </div>
    <div class="paper-info">
      <div class="ctime">
        <el-icon style="width: 15px; height: 15px">
          <Timer />
        </el-icon>
        <span class="value">{{ addDate }}</span>
      </div>
      <div class="author">
        <el-icon style="width: 15px; height: 15px">
          <User />
        </el-icon>
        <span class="value">{{ paper.author }}</span>
      </div>
    </div>
    <div class="watermark">{{ name }}</div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { transitionTime } from '@/utils';
import router from '@/router';

const props = defineProps({
  paper: {
    type: Object as any,
    default: () => {},
  },
  name: {
    type: String,
    default: '',
  },
});

const tags = computed(() => {
  if (Array.isArray(props.paper?.paper_tags)) {
    return props.paper?.paper_tags?.filter((item: string) => item !== '');
  }
  return props.paper?.paper_tags
    ?.split(',')
    .filter((item: string) => item !== '');
});
const addDate = computed(() => {
  return transitionTime(props.paper?.ctime);
});
const goPaperDetail = () => {
  router.push({
    path: '/testPaper/paperDetail',
    query: {
      paperID: props.paper?.paper_id,
    },
  });
};
</script>

<style scoped>
.test-paper-container {
  position: relative;
  height: 100%;
}
.test-title {
  font-size: 20px;
  font-weight: 600;
  z-index: 1;
}
.tags {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
}
.tag-item {
  margin-right: 10px;
}
.paper-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: var(--el-card-padding);
}
.author {
  margin-left: 20px;
}
.watermark {
  position: absolute;
  top: -20px;
  right: -20px;
  transform: rotate(-45deg);
  color: #ccc;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #ccc;
}
</style>
