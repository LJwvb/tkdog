<template>
  <div class="wenticard" style="width: 100%">
    <div class="hello" style="background-color: rgba(240, 242, 245, 1)">
      <el-row>
        <el-col :span="24">
          <el-card class="first" style="margin: 10px">
            <div class="colonn">
              <div class="background1 colonn">
                <el-row>
                  <el-col :span="3">
                    <div class="">
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
                      <el-input
                        placeholder="请输入内容"
                        v-model="input3"
                        class="inpuss"
                      >
                        <el-button
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
                        v-model="QuestionChoice.questionType"
                        style="margin-bottom: 0px"
                        class="inpuss"
                      >
                        <el-radio-button
                          v-for="item in data"
                          :key="item.questionType"
                          :label="item.title"
                          :name="item.questionType"
                        ></el-radio-button>
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
                        v-model="QuestionChoice.difficulty"
                        style="margin-bottom: 0px"
                        class="inpuss"
                      >
                        <el-radio-button
                          v-for="item in diff"
                          :key="item.difficulty"
                          :label="item.title"
                          :name="item.difficulty"
                        ></el-radio-button>
                      </el-radio-group>
                    </div>
                  </el-col>
                </el-row>
                <el-button type="primary" @click="confirmChoice()"></el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card class="second" style="margin: 10px">
            <div class="colonn" style="/* justify-content: flex-end; */">
              <div class="roww background1">
                <div class="border_bottom">
                  <div class="grid-content">
                    <el-tabs
                      v-model="currentTab"
                      @tab-click="handleClick"
                      class="el-table"
                    >
                      <el-tab-pane
                        v-for="typeItem in types"
                        :key="typeItem.id"
                        :label="typeItem.name"
                        :name="typeItem.id"
                        :questionList="questionList"
                        @currentSubTab="clickSubTab"
                        :loading="loading"
                        :isChangeTab="isChangeTab"
                      >
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </div>

                <div class="allline border_bottom"></div>
                <div class="roww center_center border_bottom">
                  <el-checkbox-group>
                    <el-checkbox label="精选"></el-checkbox>
                    <el-checkbox label="有解"></el-checkbox>
                  </el-checkbox-group>
                </div>
                <!-- <div style="width: 20px;" class="border_bottom"></div> -->
              </div>
              <div class="colonn background1">
                <div v-for="item in questionList" :key="item?.id">
                  <QuestionCard
                  v-for="(item, index) in 3"
                  :key="index"
                ></QuestionCard>

                </div>
              </div>
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
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import QuestionCard from '@/components/QuestionCard/index.vue';
import { ref } from 'vue';
import { getQuestionList } from '@/services';
import type { IGetQuestionsParams } from '@/types';
const input3 = ref('');
const loading = ref(true);
const questionList = ref();
const currentTab = ref(0);
//是否切换主标签页
let isChangeTab = false;

let QuestionChoice = ref({
  // search: '',
  difficulty: 0,
  questionType: 0,
  // tags: [],
});

const data = [
  {
    title: '单选题',

    questionType: 0,
  },
  {
    title: '多选题',
    questionType: 1,
  },
  {
    title: '判断题',
    questionType: 2,
  },
  {
    title: '填空题',
    questionType: 3,
  },
  {
    title: '简答题',
    questionType: 4,
  },
];
const diff = [
  {
    title: '简单',
    difficulty: 0,
  },
  {
    title: '中等',
    difficulty: 1,
  },
  {
    title: '困难',
    difficulty: 2,
  },
];
const types = [
  {
    name: '最热',
    id: 0,
  },
  {
    name: '最新',
    id: 1,
  },
  {
    name: '精选',
    id: 2,
  },
];

//传参
const params: IGetQuestionsParams = {
  currentPage: 0,
  pageSize: 3,
  subjectID: -1,
  catalogID: 0,
};
const confirmChoice = () => {
  console.log(QuestionChoice.value);
  console.log(questionList.value);
  let b;
  if (QuestionChoice.value === '中等') {
    b = 1;
  }
  const a = questionList.value.filter((item) => item.catalogID === b);
  console.log(a);

  // getQuestionList(QuestionChoice.value).then((res) => {
  //   console.log(res);
  // });
};
//题目列表
const getQuestionListData = async () => {
  const res = await getQuestionList(params);
  questionList.value = res.result;
  console.log(res);
};

//初始化
getQuestionListData();
// 切换子标签页
const clickSubTab = (val: any) => {
  isChangeTab = false;
  params.catalogID = val;
  getQuestionListData();
};
//切换主标签
const handleClick = (tab: any) => {
  isChangeTab = true;
  params.catalogID = tab.props.name;
  getQuestionListData();
};
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

.roww {
  justify-content: space-between;
}

.el-col-3 {
  max-width: 12.5%;
  flex: 0 0 4.5%;
}
</style>
