<template>
  <div class="hello" style="width: 100%">
    <el-container>
      <el-main style="padding: 10px">
        <el-card>
          <el-tabs v-model="activeNames" @tab-click="handleClick">
            <el-tab-pane label="未审核的试卷" name="nochk"></el-tab-pane>
            <el-tab-pane label="已审核的试卷" name="chk"></el-tab-pane>
            <el-tab-pane label="已删除的试卷" name="deleted"></el-tab-pane>
          </el-tabs>
          <div v-if="NoChkPaper?.length === 0 && activeNames === 'nochk'">
            <el-empty :image-size="200" description="没有未审核试卷" />
          </div>
          <div v-if="activeNames === 'nochk'">
            <div
              v-loading="loading"
              class="tab-pane-nochk"
              element-loading-text="加载中..."
            >
              <div
                v-for="item in NoChkPaper"
                :key="item.paper_id"
                class="test-card"
              >
                <TestCard
                  :paper="item"
                  activeNames="nochk"
                  :name="
                    item?.purview === PaperPurview.Public ? '公开' : '私有'
                  "
                  @check="check"
                  @uncheck="uncheck"
                  @delete="deletePaper"
                />
              </div>
            </div>
            <el-pagination
              v-model:current-page="currentNoChkPage"
              background
              layout="slot, prev, pager, next"
              :total="noChkTotal"
              prev-text="上一页"
              next-text="下一页"
              :hide-on-single-page="true"
              @current-change="handleNoChkCurrentChange"
            >
              <template #default> 共 {{ noChkTotal }} 条 </template>
            </el-pagination>
          </div>
          <div v-if="activeNames === 'chk'">
            <div
              v-loading="loading"
              class="tab-pane"
              element-loading-text="加载中..."
            >
              <div
                v-for="item in ChkPaper"
                :key="item.paper_id"
                class="test-card"
              >
                <TestCard
                  :paper="item"
                  activeNames="chk"
                  :name="
                    item?.purview === PaperPurview.Private
                      ? '私有个人试卷'
                      : '公开试卷'
                  "
                  @delete="deletePaper"
                />
              </div>
            </div>
            <el-pagination
              v-model:current-page="currentChkPage"
              background
              layout="slot, prev, pager, next"
              :total="chkTotal"
              prev-text="上一页"
              next-text="下一页"
              :hide-on-single-page="true"
              @current-change="handleChkCurrentChange"
            >
              <template #default> 共 {{ chkTotal }} 条 </template>
            </el-pagination>
          </div>
          <div v-if="ChkPaper?.length === 0 && activeNames === 'chk'">
            <el-empty :image-size="200" description="没有已审核试卷" />
          </div>
          <div v-if="activeNames === 'deleted'">
            <div
              v-loading="loading"
              class="tab-pane"
              element-loading-text="加载中..."
            >
              <div
                v-for="item in DeletedPaper"
                :key="item.paper_id"
                class="test-card"
              >
                <TestCard
                  :paper="item"
                  activeNames="deleted"
                  name="已删除"
                  @restore="restorePaperFun"
                />
              </div>
            </div>
            <el-pagination
              v-model:current-page="currentDeletedPage"
              background
              layout="slot, prev, pager, next"
              :total="deletedTotal"
              prev-text="上一页"
              next-text="下一页"
              :hide-on-single-page="true"
              @current-change="handleDeletedCurrentChange"
            >
              <template #default> 共 {{ deletedTotal }} 条 </template>
            </el-pagination>
          </div>
          <div v-if="DeletedPaper?.length === 0 && activeNames === 'deleted'">
            <el-empty :image-size="200" description="没有已删除的试卷" />
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import TestCard from '@/components/TestCard/index.vue';
import { ref, reactive, onMounted } from 'vue';
import queryString from 'query-string';
import { ElMessage } from 'element-plus';
import { firstQueryValue } from '@/utils';

import {
  getNoChkPaper,
  chkPaper,
  getAllChkPaper,
  deletePapers,
  getDeletedPapers,
  restorePaper,
} from '@/services';
import { PaperPurview, type IPaperCard } from '@/types';

interface IChkPapers {
  paperId: string;
  chkState: number;
  activeNames: string;
}
const { index } = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);
const NoChkPaper = ref<IPaperCard[]>([]); //获取未审核试卷
const ChkPaper = ref<IPaperCard[]>([]); //获取已审核试卷
const DeletedPaper = ref<IPaperCard[]>([]); //获取已删除试卷
const activeNames = ref(firstQueryValue(index, 'nochk'));
const loading = ref(true);
const currentNoChkPage = ref(1);
const currentChkPage = ref(1);
const currentDeletedPage = ref(1);
const noChkTotal = ref(0);
const chkTotal = ref(0);
const deletedTotal = ref(0);

const nochkParams = reactive({
  currentPage: 1,
  pageSize: 10,
});
const chkParams = reactive({
  currentPage: 1,
  pageSize: 10,
});
const deletedParams = reactive({
  currentPage: 1,
  pageSize: 10,
});

const handleNoChkCurrentChange = (val: number) => {
  nochkParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getNoChkPapers();
};
const handleChkCurrentChange = (val: number) => {
  chkParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getAllChkPapers();
};

const getNoChkPapers = async () => {
  const res = await getNoChkPaper(nochkParams);
  NoChkPaper.value = res?.result;
  noChkTotal.value = res?.total;
  loading.value = false;
};

const getAllChkPapers = async () => {
  const res = await getAllChkPaper(chkParams);
  ChkPaper.value = res?.result;
  chkTotal.value = res?.total;
  loading.value = false;
};
const getDeletedPapersFun = async () => {
  const res = await getDeletedPapers(deletedParams);
  DeletedPaper.value = res?.result;
  deletedTotal.value = res?.total;
  loading.value = false;
};
const handleDeletedCurrentChange = (val: number) => {
  deletedParams.currentPage = val;
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getDeletedPapersFun();
};
const restorePaperFun = (paperId: number) => {
  restorePaper({ paperId }).then(() => {
    ElMessage.success('已恢复');
    getDeletedPapersFun();
  });
};
const handleClick = (tab: { props: { name?: string | number } }) => {
  loading.value = true;
  if (tab.props.name === 'nochk') {
    getNoChkPapers();
  } else if (tab.props.name === 'deleted') {
    getDeletedPapersFun();
  } else {
    getAllChkPapers();
  }
};

onMounted(() => {
  getNoChkPapers();
  getAllChkPapers();
  loading.value = false;
});
//删除试卷
const deletePaper = (paper_id: number, activeNames: string) => {
  deletePapers({ paperId: paper_id }).then(() => {
    if (activeNames === 'nochk') {
      getNoChkPapers();
    } else {
      getAllChkPapers();
    }
  });
};

const check = (params: IChkPapers) => {
  chkPaper(params).then(() => {
    if (activeNames.value === 'nochk') {
      getNoChkPapers();
    } else {
      getAllChkPapers();
    }
  });
};
const uncheck = (params: IChkPapers) => {
  chkPaper(params).then(() => {
    if (activeNames.value === 'nochk') {
      getNoChkPapers();
    } else {
      getAllChkPapers();
    }
  });
};
</script>

<style scoped>
.tab-pane {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.tab-pane-nochk {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
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
  border: 1px solid #fff;
}

.biaoqian1 {
  padding: 0 12px;
  font-size: 12px;
  background-color: #f5f5f5;
  color: #000;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  margin-right: 15px;
  margin-bottom: 10px;
}

.jiandaee {
  color: rgb(170 170 170 / 100%);
  font-size: 13px;
  margin: 15px 0;
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
  margin: 0 20px;
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
