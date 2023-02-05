<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <!-- <el-aside width="200px">
      <el-scrollbar>
        <el-menu>
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <message />
              </el-icon>编程知识
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">Option 1</el-menu-item>
              <el-menu-item index="1-2">Option 2</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <Finished />
              </el-icon>学科知识
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">Option 1</el-menu-item>
              <el-menu-item index="2-2">Option 2</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <TakeawayBox />
              </el-icon>备战目标
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">Option 1</el-menu-item>
              <el-menu-item index="3-2">Option 2</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon>
                <Connection />
              </el-icon>领域方向
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">Option 1</el-menu-item>
              <el-menu-item index="4-2">Option 2</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <el-icon>
                <Menu />
              </el-icon>
              标签大全
            </template>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside> -->
    <subject_bytype></subject_bytype>
    <shitilan></shitilan>
  </el-container>
</template>

<script lang="ts" setup>
import shitilan from '../components/shitilan.vue';
import subject_bytype from '../components/subject/subject_bytype.vue';
import { ref } from 'vue';
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: white;
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
