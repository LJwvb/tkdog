<template>
  <div class="hello" style="background-color: rgba(240, 242, 245, 1)">
    <el-container>
      <el-main style="padding: 10px">
        <el-card class="box-card">
          <div class="background1 colonn">
            <el-row>
              <el-col :span="3">
                <div class="grid-content">
                  <el-button style="color: #000000" type="text">
                    <el-icon>
                      <Search />
                    </el-icon>
                    搜索
                  </el-button>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content">
                  <el-input placeholder="请输入内容" v-model="input3" class="inpuss">
                    <el-button type="primary" style="background: #409eff; color: white"></el-button>
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <div class="grid-content">
                  <el-button style="color: #000000" type="text"><el-icon>
                      <PictureRounded />
                    </el-icon>筛选</el-button>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="grid-content">
                  <el-input placeholder="类别,公司,方向" v-model="input3" class="inpuss">
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <div class="grid-content">
                  <el-button style="color: #000000" type="text"><el-icon>
                      <Notebook />
                    </el-icon>题型</el-button>
                </div>
              </el-col>
              <el-col :span="7.5">
                <div class="grid-content">
                  <el-radio-group v-model="tabPosition" style="margin-bottom: 0px" class="inpuss">
                    <el-radio-button label="top">官方</el-radio-button>
                    <el-radio-button label="right">用户</el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <div class="colonn background1" style="margin-top: 25px">
          <div class="roww background1 bottom" style="padding: 0px 0px 30px 0px">
            <el-card class="box-card">
              <div class="border_bottom">
                <div class="card-header">
                  <div class="grid-content">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                      <el-tab-pane label="最热" name="first"></el-tab-pane>
                      <el-tab-pane label="最新" name="second"> </el-tab-pane>
                    </el-tabs>
                  </div>
                </div>
              </div>
              <div type="primary" style="
                  width: 80px;
                  height: 35px;
                  background-color: #409eff;
                  text-align: center;
                  line-height: 35px;
                  color: white;
                  float: right;
                  margin-top: -60px;
                " @click="addPaperInfo">
                创建试卷
              </div>

              <div class="huanhang" style="display: flex; flex-wrap: wrap">
                <div class="background1 colonn" style="width: 22%; margin: 1%; border: 1px solid #f5f5f5"
                  v-for="(item, index) in 6" @click="tovolumeInfo">
                  <div style="
                      font-size: 18px;
                      font-weight: bold;
                      margin-top: 15px;
                      margin-bottom: 20px;
                      line-height: 30px;
                      margin: 20px;
                    ">
                    百度2018校园招聘-机器学习/数据挖掘工程师
                  </div>

                  <div class="roww center_center" style="justify-content: space-around">
                    <img src="../../assets/tkdog.png" class="logo1" />
                  </div>

                  <div class="roww center_center jiandaee">
                    <div>2020-08-08</div>
                    <div class="line1"></div>
                    <div class="el-icon-sunny">1252</div>
                    <div class="allline"></div>
                  </div>
                  <div class="tags" style="display: flex; padding-bottom: 20px">
                    <el-tag>Tag 1</el-tag>
                    <el-tag class="ml-2" type="success">Tag 2</el-tag>
                    <el-tag class="ml-2" type="info">Tag 3</el-tag>
                    <el-tag class="ml-2" type="warning">Tag 4</el-tag>
                    <el-tag class="ml-2" type="danger">Tag 5</el-tag>
                  </div>
                </div>
              </div>

              <div class="roww endend" style="padding: 10px 20px; float: right">
                <div style="line-height: 35px">总数650</div>
                <el-pagination background layout="prev, pager, next" :total="1000">
                </el-pagination>
              </div>
            </el-card>
            <div style="width: 20px" class="border_bottom"></div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import router from '../../router';
import { ref, reactive } from 'vue';
const name = ref('me_compon');
const input2 = ref('Welcome to Your Vue.js App');
const input3 = ref('');
const activeName = ref('first');
const tabPosition = ref('');
const checkList = ref('[]');
const activeIndex = ref('1');
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
const handleClick = () => { };
// 	  handleSelect(){}
// 枪王创建试卷
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  background-color: rgba(240, 242, 245, 1);
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
</style>
