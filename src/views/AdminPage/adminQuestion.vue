<template>
  <div class="hello" style="width: 100%">
    <el-container>
      <el-main style="padding: 10px">
        <el-card>
          <el-tabs v-model="activeName">
            <el-tab-pane label="未审核" name="nochk" key="nochk"></el-tab-pane>
            <el-tab-pane label="已审核" name="chk" key="chk"></el-tab-pane>
          </el-tabs>
          <div v-if="NoChkQuestions?.length === 0 && activeName === 'nochk'">
            <el-empty :image-size="200" description="没有未审核题目" />
          </div>
          <div
            v-if="activeName === 'nochk'"
            style="min-height: 500px"
            v-loading="loading"
            element-loading-text="Loading..."
          >
            <div v-for="item in NoChkQuestions" :key="item?.id">
              <QuestionCard
                :question="item"
                type="admin"
                :deleteQuestion="deleteQuestion"
                :check="check"
                :uncheck="uncheck"
                activeName="nochk"
              />
            </div>
          </div>
          <div
            v-if="activeName === 'chk'"
            style="min-height: 500px"
            v-loading="loading"
            element-loading-text="Loading..."
          >
            <div v-for="item in ChkQuestions" :key="item?.id">
              <QuestionCard
                :question="item"
                type="admin"
                :deleteQuestion="deleteQuestion"
                activeName="chk"
              />
            </div>
          </div>
          <div v-if="ChkQuestions?.length === 0 && activeName === 'chk'">
            <el-empty :image-size="200" description="没有已审核题目" />
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import QuestionCard from '@/components/QuestionCard/index.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import {
  getAllChkQuestions,
  getNoChkQuestions,
  deleteQuestions,
  chkQuestions,
} from '@/services';
interface IChkQuestion {
  id: number;
  chkState: number;
  chkUser: string;
  chkRemarks?: string;
  creator: string;
}
const activeName = ref('nochk');
//获取已审核题目
const ChkQuestions = ref();

//获取未审核题目
const NoChkQuestions = ref();
const loading = ref(true);

const getNoChkQuestion = async () => {
  const res = await getNoChkQuestions();
  NoChkQuestions.value = res.result;
};
const getAllChkQuestion = async () => {
  const res = await getAllChkQuestions();
  ChkQuestions.value = res;
};
onMounted(() => {
  getNoChkQuestion();
  getAllChkQuestion();
  loading.value = false;
});

const deleteQuestion = (id: number) => {
  deleteQuestions({ id }).then((res) => {
    if (res.code === 200) {
      getNoChkQuestion();
      getAllChkQuestion();
    }
  });
};
const check = (params: IChkQuestion) => {
  chkQuestions(params).then((res) => {
    if (res.code === 200) {
      getNoChkQuestion();
      getAllChkQuestion();
    }
  });
};
const uncheck = (params: IChkQuestion) => {
  chkQuestions(params).then((res) => {
    if (res.code == 200) {
      getNoChkQuestion();
    }
  });
};
</script>

<style scoped>
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
::v-deep .el-loading-mask {
  z-index: 9;
}
</style>
