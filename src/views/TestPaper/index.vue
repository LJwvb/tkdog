<template>
  <div
    class="hello"
    style="background-color: rgba(240, 242, 245, 1); width: 100%"
  >
    <el-container>
      <el-main style="padding: 10px">
        <el-card>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="官方" name="first" :key="first"></el-tab-pane>
            <el-tab-pane label="用户" name="second" :key="second"></el-tab-pane>
            <!-- <el-tab-pane v-for="(item, index) in PaperList" :key="index" :label="getLabel(index)" :name="index"> -->
            <!-- <div class="paperCard">
                <Paper :PaperList="item" type="item?.paper_title" />
              </div> -->
            <!-- <div class="paperCard">
            <div v-for="item in PaperList" :key="item?.PaperList" style="margin: 28px">
              <paper :PaperList="item" type="item?.purviewPaper?.paper_title" />
            </div>
          </div> -->
            <!-- </el-tab-pane> -->
            <div class="createPaper" @click="addPaperInfo">创建试卷</div>
          </el-tabs>
          <div class="paperCard" v-if="activeName === 'first'">
            <div
              v-for="item in PaperList?.purviewPaper"
              :key="item?.PaperList"
              style="margin: 28px"
            >
              <paper :PaperList="item" type="item?.paper_title"  />
            </div>
          </div>

          <div class="paperCard" v-if="activeName === 'second'">
            <div
              v-for="item in PaperList?.personPaper"
              :key="item?.PaperList"
              style="margin: 28px"
            >
              <paper :PaperList="item" type="item?.paper_title" />
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import router from '../../router';
import Paper from '@/views/TestPaper/paper.vue';
import { ref, reactive, computed } from 'vue';
import queryString from 'query-string';
import type { IGetPaperParamsList } from '@/types';
import { getPaperList } from '@/services';
const activeName = ref('first');
const PaperList = ref();

//传参
const params: IGetPaperParamsList = {
  type: 'all',
  currentPage: 0,
  pageSize: 1,
 paper_tags: [],
};
// 获取试卷题目
const getPaperData = async () => {
  if (PaperList.value) return;
  const res = await getPaperList(params);
  PaperList.value = res.data;
  console.log(PaperList.value);
};
// 初始化
getPaperData();
// const getLabel = (i: string) => {
//   if (i === 'purviewPaper') {
//     return '官方';
//   } else {
//     return '个人';
//   }
// };
const tovolumeInfo = () => {
  router.push({
    path: '/volume',
  });
};
const addPaperInfo = () => {
  router.push({
    path: '/addPaper',
  });
};
// const handleClick = (tab, event) => {
//   console.log(tab, event);
// };
</script>

<style scoped>
body {
  background-color: rgba(240, 242, 245, 1);
}

.createPaper {
  width: 80px;
  height: 35px;
  background-color: #409eff;
  text-align: center;
  line-height: 35px;
  color: white;
  float: right;
  margin-top: -60px;
}

.logo1 {
  width: 60px;
  height: 60px;
  margin-top: 25px;
  margin-bottom: 10px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  border: 1px solid #ffffff;
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
  margin-bottom: 10px;
}

.jiandaee {
  color: rgba(170, 170, 170, 1);
  font-size: 13px;
  margin: 15px 0px;
  margin-left: 20px;
}

.line1 {
  width: 1px;
  height: 15px;
  background-color: #e6e6e6;
  margin: 0px 20px;
}

.el-col-3 {
  max-width: 12.5%;
  flex: 0 0 4.5%;
}

.paperCard {
  display: flex;
  flex-wrap: wrap;
}
</style>
