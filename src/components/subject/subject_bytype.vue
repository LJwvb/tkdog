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
                        <el-radio-button v-for="item in data" :key="item.questionType" :label="item.title"
                          :name="item.questionType" :questionList="questionList" @currentSubTab="clickSubTab" :loading="loading"
                :isChangeTab="isChangeTab"></el-radio-button>
                      </el-radio-group>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="3">
                    <div class="grid-content">
                      <el-button style="color: #000000" type="text "><el-icon>
                          <Operation />
                        </el-icon>难度</el-button>
                    </div>
                  </el-col>
                  <el-col :span="4.5">
                    <div class="grid-content">
                      <el-radio-group v-model="tabPosition" style="margin-bottom: 0px" class="inpuss">
                        <el-radio-button v-for="item in diff" :key="item.difficulty" :label="item.title"
                          :name="item.difficulty" :questionList="questionList" @currentSubTab="clickSubTab" :loading="loading"
                :isChangeTab="isChangeTab"></el-radio-button>
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
                  <div class="grid-content">
                    <el-tabs v-model="active" class="demo-tabs" @tab-click="handleClick" style="width: 500px">
                      <el-tab-pane v-for="typeItem in types" :key="typeItem.id" :label="typeItem.name"
                        :name="typeItem.id">
                        <el-skeleton :loading="props.loading" animated :rows="40" style="width: 100%; height: 600px">
                          <el-empty description="暂时没有题目啊！ 等你上传" v-if="isEmpty" />
                          <div v-for="item in props.questionList" :key="item?.id">
                            <QuestionCard :question="item" />
                          </div>
                        </el-skeleton>
                      </el-tab-pane>
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
                <QuestionCard v-for="(item, index) in 3" :key="index"></QuestionCard>

                <div class="roww endend" style="padding: 10px 20px; justify-content: flex-end">
                  <div style="line-height: 35px">总数650</div>
                  <el-pagination background layout="prev, pager, next" :total="1000">
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
import { ref, watchEffect } from 'vue';
import type { IQuestion } from '@/types';
import type { IGetQuestionsParams } from '@/types';

const isEmpty = ref(false);
const input3 = ref('');
const active = ref<any>(0);
const tabPosition = ref(0);
const checkList = ref('[]');
const data = [
  {
    title: '单选题',
    name: 'first',
    content: '单选题',
    questionType: 0,
  },
  {
    title: '多选题',
    name: 'second',
    content: '多选题',
    questionType: 1,
  },
  {
    title: '判断题',
    name: 'third',
    content: '判断题',
    questionType: 2,
  },
  {
    title: '填空题',
    name: 'fourth',
    content: '填空题',
    questionType: 3,
  },
  {
    title: '简答题',
    name: 'fifth',
    content: '简答题',
    questionType: 4,
  },
];
const diff = [
  {
    title: '简单',
    name: 'first',
    content: '简单',
    difficulty: 0,
  },
  {
    title: '中等',
    name: 'second',
    content: '中等',
    difficulty: 1,
  },
  {
    title: '困难',
    name: 'third',
    content: '困难',
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
    name: '最多收藏',
    id: 2,
  },
  {
    name: '最多被考',
    id: 3,
  },
];
//传参
const params: IGetQuestionsParams = {
  currentPage: 0,
  pageSize: 3,
  subjectID: 0,
  catalogID: 0,
};
const props = defineProps({
  questionList: {
    type: Array as unknown as () => IQuestion[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: true,
  },
  isChangeTab: {
    type: Boolean,
    default: false,
  },
});
watchEffect(() => {
  if (props.isChangeTab) {
    active.value = 0;
  }
  if (props.questionList.length === 0) {
    isEmpty.value = true;
  } else {
    isEmpty.value = false;
  }
});
const handleClick = (tab: any) => {
  params.subjectID = tab.props.name;
  params.catalogID = 0;
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
