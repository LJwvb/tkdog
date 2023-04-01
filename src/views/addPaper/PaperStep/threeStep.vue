<template>
  <QuestionCard
    v-for="item in questionList"
    :key="item.id"
    :question="item"
    type="paper"
  />
  <el-empty
    :image-size="200"
    v-if="questionList.length === 0"
    description="题目列表为空,快去添加题目呀~"
  >
    <el-button type="primary" @click="addQuestion">添加题目</el-button>
  </el-empty>

  <el-button class="prev-step" @click="prevStep" type="primary"
    >上一步</el-button
  >
  <el-button
    class="next-step"
    @click="nextStep"
    type="primary"
    v-if="questionList.length !== 0"
    >创建试卷</el-button
  >
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import QuestionCard from '@/components/QuestionCard/index.vue';

import router from '@/router';

const store = useStore();

const questionList = store.state.selectedTopic;

const props = defineProps<{
  done: () => void;
  clickNext: () => void;
  clickPre: () => void;
}>();

const prevStep = () => {
  props.clickPre();
};

const nextStep = () => {
  props.clickNext();

  props.done();
};
const addQuestion = () => {
  router.push('/questionPage');
};
</script>

<style scoped></style>
