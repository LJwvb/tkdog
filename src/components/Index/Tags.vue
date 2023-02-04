<template>
  <el-card class="box-card">

    <div class="card-header">

        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="最热" name="first">
            <div class="colonn">
              <wentiitem v-for="(item, index) in 1" :key="index"></wentiitem>
              <div class="roww center_center background1" style="padding-bottom: 10px;">
                <el-button type="primary" style="opacity: 1;">查看更多</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="最新" name="second">
            <New></New>
          </el-tab-pane>
          <el-tab-pane label="精选" name="third">
            <Best></Best>
          </el-tab-pane>
        </el-tabs>
      </div>

  </el-card>
</template>
<script lang="ts" setup>
import Hot from './question/Hot.vue'
import New from './question/New.vue'
import Best from './question/Best.vue'
import wentiitem from '@/components/Home/wentiitem.vue'



import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<style>
.demo-tabs>.el-tabs__content {
  padding-top: 10px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;

}

</style>
