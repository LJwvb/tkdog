<template>
  <div class="card-container" @click="toProblemInfo()">
    <div class="title">
      <span class="title-text"> {{ question.question }} </span>
    </div>
    <div class="tags">
      <el-tag v-for="tag in tags" :key="tag" class="tag-item">
        {{ tag }}
      </el-tag>
    </div>
    <div class="info">
      <span>{{ type }}</span>
      <div class="line" />
      <span>{{ degreeDifficulty }}</span>
      <div class="line" />
      <span>{{ addDate }}</span>
    </div>
    <div class="nums">
      <div class="num-item">
        <el-icon style="width: 15px; height: 15px">
          <View />
        </el-icon>
        <span class="num-text">{{ question.browses_num ?? 0 }}</span>
      </div>
      <div class="num-item">
        <el-icon style="width: 15px; height: 15px">
          <Star />
        </el-icon>
        <span class="num-text">{{ question.likes_num ?? 0 }}</span>
      </div>
      <div class="num-item">
        <el-icon style="width: 15px; height: 15px">
          <User />
        </el-icon>
        <span class="num-text">{{ question.creator }}</span>
      </div>
    </div>
    <el-button type="primary" class="btn">选题</el-button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import router from '@/router';
import type { IQuestion } from '@/types';
import { browseQuestion } from '@/services';
import { questionType, difficulty, transitionTime } from '@/utils';

const props = defineProps({
  question: {
    type: Array as unknown as () => IQuestion,
    default: () => [],
  },
});
const question = props.question as IQuestion;

const tags = question.tags;
const id = question.id;

const type = computed(() => {
  return questionType(Number(question.questionType));
});
const degreeDifficulty = computed(() => {
  return difficulty(Number(question.difficulty));
});
const addDate = computed(() => {
  return transitionTime(question.addDate);
});

const toProblemInfo = () => {
  router.push({
    path: `/problemInfo`,
    query: {
      id,
    },
  });
  // 浏览量
  browseQuestion({ id });
};
</script>
<style scoped>
.card-container {
  height: 200px;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  position: relative;
  border: 2px solid #e6e6e6;
  box-shadow: 0 10px 20px #e6e6e6;
}
.title {
  align-items: center;
  font-size: 25px;
  width: 100%;
  font-weight: bold;
}
.title-text {
  width: 90%;
  word-wrap: break-word;
}
.tags {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
}
.tag-item {
  margin-right: 10px;
}
.info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 13px;
  position: absolute;
  bottom: 40px;
}

.line {
  width: 1px;
  height: 10px;
  background-color: #ccc;
  margin: 0px 20px;
}
.nums {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  font-size: 13px;
  position: absolute;
  bottom: 10px;
}
.num-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
.num-text {
  margin-left: 5px;
}
.btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
