<template>
  <el-row>
    <el-col :span="24">
      <el-card class="first">
        <template #header>
          <div class="card-header">
            <el-icon>
              <Lollipop />
            </el-icon>
            <span class="text">题库狗的每日一题</span>
          </div>
        </template>
        <el-skeleton :loading="loadingDaily" animated :rows="0">
          <div v-for="item in dailyData" :key="item.id" class="question">
            {{ item?.question }}
          </div>
          <el-button class="button" text @click="showModal('daily')">
            点击了解
          </el-button>
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
            <span class="text">关于本站</span>
          </div>
        </template>
        <div class="info">
          <span>
            题库狗一个干净且高级的面试刷题网站源码，支持自由组卷，通过Vue3+Node.js的全栈项目，程序包含网站前台+管理员后台
          </span>
          <el-button class="button" text @click="showModal('about')">
            点击了解
          </el-button>
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
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { getRankList, getDailyQuestion } from '@/services';

const rankData = ref();
const dailyData = ref();
const loadingRank = ref(true);
const loadingDaily = ref(true);

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

const showModal = (type: string) => {
  console.log(type);
};
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
}
.text {
  margin-left: 10px;
}
.question {
  width: 90%;
  word-wrap: break-word;
}

.border_bottom {
  display: flex;
  border-bottom: 1px solid #f5f5f5;
  justify-content: space-between;
  align-items: center;
}

.info {
  text-align: left;
  text-indent: 2em;
  height: 65px;
}
.button {
  position: absolute;
  bottom: 0px;
  right: 10px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.row {
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 10px 0;
}
.rank {
  font-size: large;
  margin-right: 10px;
  font-weight: bold;
}
.authority {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.name {
  margin-left: 10px;
}

.el-row {
  margin-bottom: 20px;
}
</style>
