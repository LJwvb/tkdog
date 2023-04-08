<template>
  <div class="info-container">
    <el-card style="margin-bottom: 20px">
      <div v-for="(item, index) in paperDetail" :key="item.id">
        <div class="question-title">
          <h2 style="display: inline">{{ index + 1 }}:</h2>
          {{ item.question }}
        </div>
        <div class="question-answer" v-html="item.answer"></div>
      </div>
      <div class="watermark">{{ name }}</div>
    </el-card>
  </div>
  <div class="slide-container">
    <el-card style="margin-bottom: 20px">
      <div class="paper-info">
        <h4>试卷信息</h4>
        <div>标题：{{ paperInfo?.paper_title }}</div>
        <div class="tags" v-if="tags?.length > 0">
          标签：
          <el-tag v-for="tag in tags" :key="tag" class="tag-item">
            {{ tag }}
          </el-tag>
        </div>
        <div>发布时间：{{ addDate }}</div>
        <div class="creator">
          <div>上传者：</div>
          <div class="creator-info">
            <el-icon>
              <Avatar />
            </el-icon>
            <div style="margin-left: 5px">{{ paperInfo?.author }}</div>
          </div>
          <div class="allline"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted } from 'vue';
import { getPaperDetail } from '@/services';
import queryString from 'query-string';
import { transitionTime } from '@/utils';

const { paperID } = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);
const paperDetail = ref<any>([]);
const paperInfo = ref<any>({});

onMounted(async () => {
  const res = await getPaperDetail({ paperId: paperID });
  paperDetail.value = res?.data?.questions;
  paperInfo.value = res?.data?.paperInfo;
});
const addDate = computed(() => {
  return transitionTime(paperInfo.value?.ctime);
});
const tags = computed(() => {
  if (Array.isArray(paperInfo?.value?.paper_tags)) {
    return paperInfo.value?.paper_tags?.filter((item: string) => item !== '');
  }
  return paperInfo.value?.paper_tags
    ?.split(',')
    .filter((item: string) => item !== '');
});
const name = computed(() => {
  return paperInfo.value?.purview === 0 ? '公开试卷' : '个人试卷';
});
</script>

<style scoped>
.info-container {
  width: 70%;
  position: relative;
}
.watermark {
  position: absolute;
  top: 0px;
  right: 0px;
  transform: rotate(-45deg);
  color: #ccc;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #ccc;
}
.question-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}
.question-answer {
  margin-bottom: 20px;
}
.slide-container {
  width: 30%;
  margin-left: 20px;
}
.paper-info {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.creator {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.creator-info {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.tags {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.tag-item {
  margin-right: 10px;
}
</style>
