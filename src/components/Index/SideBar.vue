<template>
  <el-row>
    <el-col :span="24">
      <el-card class="first">
        <template #header>
          <div class="card-header">
            <el-icon>
              <Lollipop />
            </el-icon>
            <span>题库狗的每日一题</span>
          </div>
        </template>
          <!-- <span>说说你对模块化方案的理解，比如 CommonJS、AMD、CMD、ES Module
            分别是什么？</span> -->
            <el-skeleton :loading="loadingDaily" animated :rows="0">
          <div v-for="item in dailyData" :key="item.id" class="question">
            {{ item?.question }}
          </div>
          <el-button class="button" text  @click="centerDialogVisible = true">
            点击了解</el-button>
      </el-skeleton>
      </el-card>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="24">
      <el-card class="second">
        <template #header>
          <div class="card-header">
            <el-icon>
              <Lollipop />
            </el-icon>
            <span>关于本站</span>
          </div>
        </template>
        <div class="normal">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        </div>
        <div class="info">
          <span>题库狗一个干净且高级的面试刷题网站源码，支持自由组卷，通过Vue3+Node.js的全栈项目，程序包含网站前台+管理员后台</span>

          <!-- <el-button class="button" text @click="showModal('daily')">
            点击了解</el-button> -->
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-card>
        <div>排行榜</div>
        <el-scrollbar height="400px">
          <el-skeleton :loading="loadingRank" animated :rows="10">
          <div v-for="(item, index) in rankData" :key="index">
            <div class="border_bottom">
              <div class="row">
                <div class="rank">{{ index + 1 }}</div>
                <img :src="item.avatar" alt="" class="avatar" />
                <div class="name">{{ item.username }}</div>
              </div>
              <div class="">
                <div class="level">获赞数：{{ item.get_likes_num }}</div>
                <div class="role">上传数：{{ item.upload_ques_num }}</div>
              </div>
            </div>
          </div>
          </el-skeleton>
        </el-scrollbar>
      </el-card>
    </el-col>
  </el-row>
  <el-dialog v-model="centerDialogVisible" title="题库狗的每日一题" width="30%" center>
  
      <el-skeleton :loading="loadingDaily" animated :rows="0">
          <div v-for="item in dailyData" :key="item.id" class="question">
            {{ item?.question }}
          </div>
   </el-skeleton>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">答案</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          退出
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
// import axios from 'axios';
// axios({
//   method: 'get',
//   url: 'http://127.0.0.1:7002/api/getRankingList',
// })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => { });
import { ref } from 'vue';
import { getRankList,getDailyQuestion } from '@/services';
const rankData = ref();
const dailyData = ref();
const loadingRank = ref(true);
const loadingDaily = ref(true);
const centerDialogVisible = ref(false);
const getRank = async () => {
  const res = await getRankList();
  rankData.value = res;
  loadingRank.value = false;
};
const getDaily = async () => {
  const res = await getDailyQuestion();
  dailyData.value = res;
  loadingDaily.value = false;
};
getRank();

getDaily();
// import { request } from '@/utils/request';
// interface RankData {
//   avatar: string;
//   username: string;
//   get_likes_num: number;
//   upload_ques_num: number;
// }
// const rankData = ref<RankData[]>([]);
// // 接口请求
// request('GEt', '/getRankingList').then((res: any) => {
//   console.log(res);
//   rankData.value = res.data.data;
// });

// const showModal = (type: string) => {
//   console.log(type);
// };
</script>

<style>
.colonn {
  display: flex;
  flex-direction: column;
}

.rank {
  font-size: 20px;
  font-weight: bolder;
  margin: auto;
  padding: 10px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.name {
  margin: auto;
}

.allline {
  display: flex;
  justify-content: space-between;
}

.border_bottom {
  display: flex;
  border-bottom: 1px solid #f5f5f5;
  justify-content: space-between;
}

.roww {
  display: flex;
}

.row {
  display: flex;
}

.info {
  text-align: left;
  text-indent: 2em;

  /* .button {
    float: right;
  } */
}

.normal {
  float: left;
  height: 80px;
}

.header {
  padding-top: 10px;
}

.el-row {
  margin-bottom: 20px;
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
}
</style>
