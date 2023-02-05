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
        <div>
          <span>说说你对模块化方案的理解，比如 CommonJS、AMD、CMD、ES Module
            分别是什么？</span>
          <el-button class="button" text>点击了解</el-button>
        </div>
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
          <el-button class="button" text>点击了解</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-card class="box-card" style="margin-bottom: 20px">
        <div slot="header" class="clearfix">
          <div class="roww allline">
            <div>本月排行</div>
            <div class="allline"></div>
            <div>更多</div>
            <!-- <div @click="toMoreIncentive">更多</div> -->
          </div>
        </div>
        <div class="colonn">
          <div class="roww border_bottom" v-for="(item, index) in 2" style="padding-bottom: 25px; padding-top: 25px">
            <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" style="
                width: 30px;
                height: 30px;
                border-radius: 50%;
                margin-right: 15px;
              " />
            <div class="colonn">
              <div class="roww" style="display: flex; justify-content: space-around">
                <el-tooltip style="background-color: #ffffff" effect="dark" content="Top Center 提示文字" placement="top">
                  <div slot="content">
                    <userInfo></userInfo>
                  </div>
                  <div>活宝</div>
                </el-tooltip>

                <div class="lveeltag">V2</div>
                <div class="guanliyuan">管理员</div>
              </div>
              <div class="roww" style="margin-top: 7px">
                <div style="color: #99a9bf">本月积分：45</div>
                <div class="allline" style="font-size: 20px"></div>
              </div>
            </div>
          </div>
        </div>
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
  .catch((err) => { });
</script>

<style >
.colonn {
  display: flex;
  flex-direction: column;
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

.info {
  text-align: left;
  text-indent: 2em;

  .button {
    float: right;
  }
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
