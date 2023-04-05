<template>
  <div
    class="hello"
    style="background-color: rgba(240, 242, 245, 1); width: 100%"
  >
    <el-container>
      <el-main style="padding: 10px">
        <el-card>
          <el-tabs v-model="activeNames" @tab-click="handleClick">
            <el-tab-pane label="未审核" name="nochk" :key="nochk"></el-tab-pane>
            <el-tab-pane label="已审核" name="chk" :key="chk"></el-tab-pane>
          </el-tabs>
          <div v-if="activeNames === 'nochk'" class="tab-pane">
            <div
              v-for="item in NoChkPaper"
              :key="item.paper_id"
              style="margin: 28px"
              class="test-card"
            >
              <TestCard
                :paper="item"
                :check="check"
                :uncheck="uncheck"
                :deletePaper="deletePaper"
                activeNames="nochk"
              />
            </div>
          </div>

          <div v-if="activeNames === 'chk'" class="tab-pane">
            <div
              v-for="item in ChkPaper"
              :key="item.paper_id"
              style="margin: 28px"
              class="test-card"
            >
              <TestCard
                :paper="item"
                :check="check"
                :uncheck="uncheck"
                :deletePaper="deletePaper"
                activeNames="chk"
              />
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import TestCard from '@/components/TestCard/index.vue';
import { ref, reactive, computed } from 'vue';
import {
  getNoChkPaper,
  chkPaper,
  getAllChkPaper,
  deletePapers,
} from '@/services';

const activeNames = ref('nochk');
interface IChkPapers {
  paperId: string;
  chkState: number;
}

// 选中的主标签页
// const currentTab = ref(isNaN(Number(subjectID)) ? 0 : Number(subjectID));

//获取未审核试卷
const NoChkPaper = ref();
const getNoChkPapers = async () => {
  const res = await getNoChkPaper();
  console.log(res);
  NoChkPaper.value = res;
};
getNoChkPapers();
//获取已审核试卷
const ChkPaper = ref();
const getAllChkPapers = async () => {
  const res = await getAllChkPaper();
  ChkPaper.value = res;
};
getAllChkPapers();
//删除试卷
const deletePaper = (paper_id: number) => {
  console.log(paper_id);
  deletePapers({ paperId: paper_id }).then((res) => {
    console.log(res);
    if (res.code === 200) {
      getNoChkPaper();
      getAllChkPapers();
    }
  });
};
const check = (params: IChkPapers) => {
  chkPaper(params).then((res) => {
    console.log(res);
    if (res.code === 200) {
      getNoChkPapers();
    }
  });
};
// getAllChkQuestion();
const uncheck = (params: IChkPapers) => {
  chkPaper(params).then((res) => {
    if (res.code == 200) {
      getNoChkPapers();
    }
  });
};
</script>

<style scoped>
body {
  background-color: rgba(240, 242, 245, 1);
}

.tab-pane {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-evenly; */
}

.test-card {
  width: 400px;
  height: 200px;
  margin-right: 20px;
  margin-bottom: 20px;
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

.btn1 {
  position: absolute;
  right: 10px;
  top: 10px;
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
