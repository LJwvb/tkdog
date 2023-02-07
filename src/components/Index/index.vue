<template>
  <div class="index">
    <div class="index-left">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="el-table">
        <el-tab-pane
          v-for="item in data"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <Tags :content="item.content" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Tags from './Tags.vue';

const data = [
  {
    title: 'javaScript',
    name: 'first',
    content: 'javaScript',
  },
  {
    title: 'CSS',
    name: 'second',
    content: 'CSS',
  },
  {
    title: 'HTML',
    name: 'third',
    content: 'HTML',
  },
  {
    title: 'ES6',
    name: 'fourth',
    content: 'ES6',
  },
  {
    title: 'React',
    name: 'fifth',
    content: 'React',
  },
  {
    title: 'Vue',
    name: 'sixth',
    content: 'Vue',
  },
  {
    title: 'Node',
    name: 'seventh',
    content: 'Node',
  },
  {
    title: 'webpack',
    name: 'eighth',
    content: 'webpack',
  },
  {
    title: 'TypeScript',
    name: 'ninth',
    content: 'TypeScript',
  },
  {
    title: '编程题',
    name: 'tenth',
    content: '编程题',
  },
  {
    title: '计算机基础',
    name: 'eleventh',
    content: '计算机基础',
  },
  {
    title: '计算机网络',
    name: 'twelfth',
    content: '计算机网络',
  },
];
const activeName = ref('first');
const handleClick = (tab: any, event: any) => {
  console.log(tab, event);
};
</script>
<style scoped>
.el-table {
  background-color: #fff;
  padding: 20px;
  box-shadow: var(--el-box-shadow-light);
  border-radius: var(--el-card-border-radius);
  border: 1px solid var(--el-card-border-color);
}
:global(.el-tabs__content) {
  overflow: visible !important;
}
</style>
