<template>
  <el-result :icon="icon" :title="title" :sub-title="subTitle"> </el-result>
  <el-button
    class="prev-step"
    @click="prevStep"
    type="primary"
    v-if="props.error"
    >上一步</el-button
  >
  <el-button class="prev-step" @click="props.goTestPaper" type="primary" v-else
    >返回题目列表</el-button
  >
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  clickPre: {
    type: Function,
    required: true,
  },
  goTestPaper: {
    type: Function,
    required: true,
  },
  error: Object,
});
const icon = computed(() => {
  if (props.error) {
    return 'error';
  } else {
    return 'success';
  }
});
const title = computed(() => {
  if (props.error) {
    return '创建失败';
  } else {
    return '创建成功';
  }
});
const subTitle = computed(() => {
  if (props.error) {
    return props.error.message;
  } else {
    return '请去我的试卷列表查看';
  }
});

const prevStep = () => {
  props.clickPre();
};
</script>

<style scoped></style>
