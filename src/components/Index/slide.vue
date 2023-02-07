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
        <div>
          <span
            >说说你对模块化方案的理解，比如 CommonJS、AMD、CMD、ES Module
            分别是什么？
          </span>
        </div>
        <el-button class="button" text @click="showModal('daily')">
          点击了解
        </el-button>
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
      <el-card class="box-card">
        <div class="clearfix">
          <div class="allline">
            <div>排行榜</div>
          </div>
        </div>
        <el-scrollbar height="400px">
          <div v-for="item in rankData" :key="item.rank">
            <div class="border_bottom">
              <div class="row">
                <div class="rank">{{ item.rank }}</div>
                <img :src="item.avatar" alt="" class="avatar" />
                <div class="name">{{ item.name }}</div>
              </div>
              <div class="">
                <div class="authority">
                  <div class="level">{{ item.level }}</div>
                  <div class="role">{{ item.role }}</div>
                </div>

                <div class="score" style="color: #99a9bf">
                  本月积分：{{ item.score }}
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import axios from 'axios';
axios({
  method: 'get',
  url: 'http://127.0.0.1:7002/api/getRankingList',
})
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {});
const showModal = (type: string) => {
  console.log(type);
};
// 模拟50条数据

const rankData = Array.from({ length: 50 }, (v, k) => {
  return {
    rank: k + 1,
    avatar:
      'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    name: '题库狗',
    level: 'Lv.1',
    role: '管理员',
    score: 100,
  };
});
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
}
.text {
  margin-left: 10px;
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
.role {
  margin-left: 10px;
}
.el-row {
  margin-bottom: 20px;
}
</style>
