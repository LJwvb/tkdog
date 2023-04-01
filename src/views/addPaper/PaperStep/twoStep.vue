<template>
  <el-button class="prev-step" @click="prevStep" type="primary"
    >上一步</el-button
  >
</template>

<script setup lang="ts">
const props = defineProps<{
  clickPre: () => void;
}>();

const prevStep = () => {
  props.clickPre();
};
</script>

<style scoped></style>
