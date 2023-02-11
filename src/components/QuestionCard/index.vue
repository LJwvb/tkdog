<template>
  <div class="card-container" @click="toproblem_info">
    <div class="title">
      <span class="title-text"> {{ question.question }} </span>
      <el-button type="primary" class="btn">选题</el-button>
    </div>
    <div class="tags">
      <el-tag v-for="tag in tags" :key="tag" class="tag-item">
        {{ tag }}
      </el-tag>
    </div>
    <div class="info">
      <span>{{ questionType }}</span>
      <div class="line" />
      <span>{{ difficulty }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import router from '../../router';
import type { IQuestion } from '@/types';

const props = defineProps({
  question: {
    type: Array as unknown as () => IQuestion,
    default: () => [],
  },
});
const question = props.question as IQuestion;

const tags = question.tags;
const questionType = computed(() => {
  switch (Number(question.questionType)) {
    case 0:
      return '单选题';
    case 1:
      return '多选题';
    case 2:
      return '判断题';
    case 3:
      return '填空题';
    case 4:
      return '简答题';
    default:
      return '';
  }
});
const difficulty = computed(() => {
  switch (Number(question.difficulty)) {
    case 0:
      return '简单';
    case 1:
      return '中等';
    case 2:
      return '困难';
    default:
      return '';
  }
});
const addDate = computed(() => {
  const date = new Date(question.addDate);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
});

const toproblem_info = () => {
  router.push({
    path: '/problem_info',
  });
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 25px;
  width: 100%;
  font-weight: bold;
}
.title-text {
  width: 80%;
  text-overflow: ellipsis;
  white-space: pre-wrap;
}
.tags {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 10px;
}
.tag-item {
  margin-right: 10px;
}
.info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
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
</style>
