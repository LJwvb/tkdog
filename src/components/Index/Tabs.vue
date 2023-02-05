<template>
  <div class="tabs">
    <el-row :gutter="24">
      <el-col :span="17">
        <div class="grid-content">
          <el-tabs
            v-model="activeName"
            type="card"
            class="demo-tabs"
            @tab-click="handleClick"
          >
            <el-tab-pane label="javaScript" name="first"
              ><Tags></Tags
            ></el-tab-pane>
            <el-tab-pane label="CSS" name="second"><Tags></Tags></el-tab-pane>
            <el-tab-pane label="HTML" name="third"><Tags></Tags></el-tab-pane>
            <el-tab-pane label="ES6" name="fourth"><Tags></Tags></el-tab-pane>
            <el-tab-pane label="React" name="fifth"><Tags></Tags></el-tab-pane>
            <el-tab-pane label="Vue" name="sixth"><Tags></Tags></el-tab-pane>
            <el-tab-pane label="Node" name="seventh"><Tags></Tags></el-tab-pane>
            <el-tab-pane label="webpack" name="eighth"
              ><Tags></Tags
            ></el-tab-pane>
            <el-tab-pane label="TypeScript" name="ninth"
              ><Tags></Tags
            ></el-tab-pane>
            <el-tab-pane label="编程题" name="tenth"><Tags></Tags></el-tab-pane>
            <el-tab-pane label="计算机基础" name="eleventh"
              ><Tags></Tags
            ></el-tab-pane>
            <el-tab-pane label="计算机网络" name="twelfth"
              ><Tags></Tags
            ></el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col
        class="grid-content bg-purple-light"
        :xs="24"
        :sm="24"
        :md="16"
        :lg="7"
        :xl="16"
      >
        <SideBar></SideBar>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import Tags from './Tags.vue';
import SideBar from '@/components/SideBar/SideBar.vue';

const activeName = ref('first');

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>
<style lang="scss">
.tabs {
  padding-top: 15px;
}
.el-row {
  margin-bottom: 20px;
}
.el-tabs__nav-scroll {
  background-color: white;
}
.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  float: flex;
  // background-color:white;
}

.demo-tabs > .el-tabs__content {
  padding-left: 20px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
