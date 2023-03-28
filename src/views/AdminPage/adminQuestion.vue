<template>
  <div
    class="hello"
    style="background-color: rgba(240, 242, 245, 1); width: 100%"
  >
    <el-container>
      <el-main style="padding: 10px">
        <el-card>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="未审核" name="nochk" :key="nochk"></el-tab-pane>
            <el-tab-pane label="已审核" name="chk" :key="chk"></el-tab-pane>


          </el-tabs>
          <div v-if="activeName === 'nochk'">
            <div
              v-for="item in NoChkQuestions"
              :key="item?.id"
              style="margin: 28px"
            >
              <QuestionCard :question="item"  type="item?.id" />
            </div>
          </div>

          <div  v-if="activeName === 'chk'">
            <div
              v-for="item in questionList"
              :key="item?.id"
              style="margin: 28px"
            >
              <QuestionCard :question1="item" type="all" />
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import QuestionCard from '@/components/QuestionCard/index.vue';
import { ref, reactive, computed } from 'vue';
import { getQuestionList,getNoChkQuestions } from '@/services';

const activeName = ref('nochk');


const loading = ref(true);

const questionList = ref();

// 选中的主标签页
// const currentTab = ref(isNaN(Number(subjectID)) ? 0 : Number(subjectID));

//获取未审核题目
const NoChkQuestions = ref();
const getNoChkQuestion = async () => {
  const res = await getNoChkQuestions();
  console.log(res.result);
  
  NoChkQuestions.value = res.result;
};

getNoChkQuestion();
// 获取题目列表
const getQuestionListData = async () => {
  if (questionList.value) return;
  const res = await getQuestionList({});
  questionList.value = res.result;
  console.log(res.result);
  
  
};
// 初始化
getQuestionListData();
// const getLabel = (i: string) => {
//   if (i === 'purviewPaper') {
//     return '官方';
//   } else {
//     return '个人';
//   }
// };


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
