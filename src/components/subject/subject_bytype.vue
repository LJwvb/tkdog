<template>
  <div class="wenticard">
    <div class="hello" style="background-color: rgba(240, 242, 245, 1)">
      <el-row>
        <el-col :span="24">
          <el-card class="first" style="margin: 10px">
            <div class="colonn">
              <div class="background1 colonn">
                <el-row>
                  <el-col :span="3">
                    <div class="">
                      <el-button style="color: #000000" type="text"
                        ><el-icon> <Search /> </el-icon>搜索</el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="10">
                    <div class="grid-content">
                      <el-input
                        placeholder="请输入内容"
                        v-model="input3"
                        class="inpuss"
                      >
                        <el-button
                          slot="append"
                          type="primary"
                          style="background: #409eff; color: white"
                        ></el-button>
                      </el-input>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="3">
                    <div class="grid-content">
                      <el-button style="color: #000000" type="text"
                        ><el-icon> <PictureRounded /> </el-icon>筛选</el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div class="grid-content">
                      <el-input
                        placeholder="类别,公司,方向"
                        v-model="input3"
                        class="inpuss"
                      >
                      </el-input>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="3">
                    <div class="grid-content">
                      <el-button style="color: #000000" type="text"
                        ><el-icon> <Notebook /> </el-icon>题型</el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="7.5">
                    <div class="grid-content">
                      <el-radio-group
                        v-model="tabPosition"
                        style="margin-bottom: 0px"
                        class="inpuss"
                      >
                        <el-radio-button label="top">简答</el-radio-button>
                        <el-radio-button label="right">单选</el-radio-button>
                        <el-radio-button label="bottom">不定项</el-radio-button>
                        <el-radio-button label="left">填空</el-radio-button>
                        <el-radio-button label="left">编程</el-radio-button>
                      </el-radio-group>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="3">
                    <div class="grid-content">
                      <el-button style="color: #000000" type="text "
                        ><el-icon> <Operation /> </el-icon>难度</el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="4.5">
                    <div class="grid-content">
                      <el-radio-group
                        v-model="tabPosition"
                        style="margin-bottom: 0px"
                        class="inpuss"
                      >
                        <el-radio-button label="top">简单</el-radio-button>
                        <el-radio-button label="right">中等</el-radio-button>
                        <el-radio-button label="bottom">困难</el-radio-button>
                      </el-radio-group>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card class="second" style="margin: 10px">
            <div class="colonn" style="/* justify-content: flex-end; */">
              <div class="roww background1">
                <div class="border_bottom">
                  <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"> -->
                  <!-- <el-menu-item index="1">最新</el-menu-item>
									<el-menu-item index="2">最热</el-menu-item>
									<el-menu-item index="3">最多收藏</el-menu-item>
									<el-menu-item index="4">最多被考</el-menu-item> -->
                  <!-- <el-menu-item index="5">///</el-menu-item> -->
                  <!-- </el-menu> -->
                  <div class="grid-content">
                    <el-tabs
                      v-model="activeName"
                      class="demo-tabs"
                      @tab-click="handleClick"
                      style="width: 500px"
                    >
                      <el-tab-pane label="最新" name="second"></el-tab-pane>
                      <el-tab-pane label="最热" name="first"></el-tab-pane>
                      <el-tab-pane label="最多收藏" name="third"></el-tab-pane>
                      <el-tab-pane label="最多被考" name="forth"></el-tab-pane>
                    </el-tabs>
                  </div>
                </div>

                <div class="allline border_bottom"></div>
                <div class="roww center_center border_bottom">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox label="精选"></el-checkbox>
                    <el-checkbox label="有解"></el-checkbox>
                  </el-checkbox-group>
                </div>
                <!-- <div style="width: 20px;" class="border_bottom"></div> -->
              </div>
              <div class="colonn background1">
                <QuestionCard
                  v-for="(item, index) in 3"
                  :key="index"
                ></QuestionCard>

                <div
                  class="roww endend"
                  style="padding: 10px 20px; justify-content: flex-end"
                >
                  <div style="line-height: 35px">总数650</div>
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import QuestionCard from '@/components/QuestionCard/index.vue';

import { ref, reactive } from 'vue';

const name = ref('me_compon');
const input2 = ref('Welcome to Your Vue.js App');
const input3 = ref('');
const activeName = ref('first');
const tabPosition = ref('');
const checkList = ref('[]');
const activeIndex = ref('1');

const handleClick = () => {};
// 	  handleSelect(){}
// 枪王创建试卷
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* tabs */
.deleteBorder .el-tabs__nav-wrap::after {
  height: 0;
}

.el-tabs__nav {
  background-color: #ffffff;
}

#tab-third {
  background-color: #ffffff;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  border: 1px solid #ffffff;
}
.el-card {
  margin: auto;
}

/* 	.new-tabs-header {
	  background: white;
	  .tabs-card {
	    .el-tabs__nav-scroll {
	      padding: 0;
	    }
	  }
	   .el-tabs__nav-wrap {
	    &::after {
	      display: none;
	    }
	  }
	  .el-tabs__header {
	    margin: 0;
	  }
	 .el-tabs__nav-scroll {
	    padding: 0 20px;
	  }
	   .el-tabs__active-bar {
	    background-color: $wit-primary; 
	    height: 4px;
	    border-radius: 2px;
	  }
	  .el-tabs__item:hover{
	    span{
	      color: $wit-primary; 
	    }
	  }
	 .el-tabs__item.is-active {
	
	    color: #333333;
	    font-weight: bold;
	    font-size: 16px;
	    position: relative;
	    span{
	      color: $wit-primary;
	    }
	  }
	.el-tabs__item:hover {
	    color: #333333;
	  }
	.el-tabs__item {
	    color: #909399;
	    font-size: 14px;
	    font-weight: 500;
	  }
	  .el-tabs.tabs-card .el-tabs__item span {
	    background: none;
	    box-shadow: none;
	    height: 54px;
	    line-height: 54px;
	    min-width: 0;
	    padding: 0;
	    margin: 0 18px;
	  }
	}         
	 */
.roww {
  justify-content: space-between;
}

.el-col-3 {
  max-width: 12.5%;
  flex: 0 0 7.5%;
}
</style>
