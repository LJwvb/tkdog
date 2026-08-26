<template>
  <el-result :icon="icon" :title="title" :sub-title="subTitle"> </el-result>
  <el-button
    v-if="props.error"
    class="prev-step"
    type="primary"
    @click="prevStep"
    >上一步</el-button
  >
  <el-button
    v-else
    class="prev-step"
    type="primary"
    @click="emit('goTestPaper')"
    >返回题目列表</el-button
  >
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  error: Object,
});

const emit = defineEmits<{
  (e: 'prev'): void;
  (e: 'goTestPaper'): void;
}>();
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
  emit('prev');
};
</script>

<style scoped></style>
