<template>
  <div class="hello">
    <el-card class="box-card">
      <div class="colonn background1">
        <div class="rowsb padding23 border_bottom center_center">
          <div>我的试卷（1）</div>
        </div>
        <div class="roww padding23" style="margin-top: 30px">
          <el-dropdown split-button style="margin-right: 15px">
            范围
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>公开</el-dropdown-item>
                <el-dropdown-item>私有</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="colonn">
          <test_paper v-for="(item, index) in 2" :key="index"></test_paper>

          <div class="roww endend" style="padding: 10px 20px">
            <div>总数650</div>
            <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">

import paper_tem from '@/components/me/paper_tem.vue';
import test_paper from '@/components/me/test_paper.vue';
import router from '../../router';
import { ref } from 'vue';

const name = ref('me_compon');
const input = ref('');

{
  const toPastInfo = () => {
    router.push({
      path: '/volume',
    });
  };
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.jiandaee {
  color: rgba(170, 170, 170, 1);
  font-size: 13px;
  margin-left: 20px;
}

.line1 {
  width: 1px;
  height: 15px;
  background-color: #e6e6e6;
  margin: 0px 20px;
}

.biaoqian1 {
  padding: 0px 12px;
  font-size: 12px;
  background-color: #f5f5f5;
  color: #000000;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  margin-right: 15px;
  margin-bottom: 15px;
}

.biaoqian2 {
  padding: 0px 12px;
  font-size: 12px;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  margin-right: 15px;
  color: #389e0d;
  background: #f6ffed;
  border: 1px solid #389e0d;
}
</style>
