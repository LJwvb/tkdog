<template>
  <div class="hello" style="width: 100%">
    <div v-if="activeName === 'chk'" class="search">
      <el-form ref="from" :model="form">
        <el-form-item label="搜索">
          <el-input
            v-model="form.keyword"
            placeholder="请输入搜索的内容"
            class="search"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left: 20px" @click="onSubmit"
        >搜索</el-button
      >
      <el-button @click="clearSearch">清空</el-button>
    </div>
    <el-container v-if="!clickSearch">
      <el-main style="padding: 10px">
        <el-card>
          <div class="batch-bar">
            <el-button type="success" @click="openImportDialog">
              批量导入题目
            </el-button>
            <el-button @click="exportCsv">导出 CSV</el-button>
            <el-button @click="downloadTemplate">下载导入模板</el-button>
          </div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              key="nochk"
              label="未审核的题目"
              name="nochk"
            ></el-tab-pane>
            <el-tab-pane
              key="chk"
              label="已审核的题目"
              name="chk"
            ></el-tab-pane>
            <el-tab-pane
              key="deleted"
              label="已删除的题目"
              name="deleted"
            ></el-tab-pane>
          </el-tabs>
          <div v-if="NoChkQuestions?.length === 0 && activeName === 'nochk'">
            <el-empty :image-size="200" description="没有未审核题目" />
          </div>
          <div
            v-if="activeName === 'nochk'"
            v-loading="loading"
            element-loading-text="加载中..."
          >
            <div v-for="item in NoChkQuestions" :key="item?.id">
              <QuestionCard
                :question="item"
                type="nochk"
                activeName="nochk"
                @delete="deleteQuestion"
                @check="check"
                @uncheck="uncheck"
              />
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
          <div
            v-if="activeName === 'chk'"
            v-loading="loading"
            element-loading-text="加载中..."
          >
            <VirtualList
              :data="ChkQuestions"
              :height="650"
              :estimated-item-height="200"
              :loading="loadingMore"
              :finished="ChkQuestions.length >= chkTotal"
              @load-more="loadMoreChk"
              ><template #default="{ item }">
                <QuestionCard
                  :question="item"
                  type="chk"
                  activeName="chk"
                  @delete="deleteQuestion"
                  @edit="handleEdit"
                /> </template
            ></VirtualList>
            <!-- 已审核列表走无限滚动加载，不再叠加分页器（两套分页会互相打架） -->
            <div v-if="chkTotal > 0" class="list-total">
              共 {{ chkTotal }} 条，已加载 {{ ChkQuestions.length }} 条
            </div>
          </div>
          <div v-if="ChkQuestions?.length === 0 && activeName === 'chk'">
            <el-empty :image-size="200" description="没有已审核题目" />
          </div>
          <div
            v-if="activeName === 'deleted'"
            v-loading="loading"
            element-loading-text="加载中..."
          >
            <div v-for="item in DeletedQuestions" :key="item?.id">
              <QuestionCard
                :question="item"
                type="chk"
                activeName="deleted"
                @restore="restoreQuestionFun"
              />
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
          <div
            v-if="DeletedQuestions?.length === 0 && activeName === 'deleted'"
          >
            <el-empty :image-size="200" description="没有已删除的题目" />
          </div>
        </el-card>
      </el-main>
    </el-container>
    <div v-else>
      <div v-if="searchData?.length === 0">
        <el-icon
          size="35"
          color="#aaa"
          style="float: right"
          @click="clearSearch"
          ><CircleClose
        /></el-icon>
        <el-empty :image-size="200" />
      </div>
      <div v-else>
        <div v-for="item in searchData" :key="item.id">
          <QuestionCard
            :question="item"
            activeName="chk"
            :isClickSearch="true"
          />
        </div>
        <el-pagination
          v-model:current-page="currentSearchPage"
          background
          layout="slot, prev, pager, next"
          :total="searchTotal"
          prev-text="上一页"
          next-text="下一页"
          :hide-on-single-page="true"
          @current-change="handleSearchCurrentChange"
        >
          <template #default> 共 {{ searchTotal }} 条 </template>
        </el-pagination>
      </div>
    </div>
  </div>

  <!-- 批量导入弹窗 -->
  <el-dialog
    v-model="importDialogVisible"
    title="批量导入题目（JSON）"
    width="640px"
  >
    <div class="import-tip">
      <p>
        支持单选(0)、多选(1)、判断(2)、简答(3)。每行一个 JSON
        对象，字段如下（客观题需带 options）：
      </p>
      <pre class="import-sample">{{
        `[
  {
    "question": "Vue 中 v-if 和 v-show 的区别？",
    "questionType": 0,
    "difficulty": 1,
    "subjectID": 5,
    "tags": "Vue,面试",
    "options": [
      {"code": "A", "value": "选项A"},
      {"code": "B", "value": "选项B"}
    ],
    "answer": "A"
  },
  {
    "question": "Vuex 是做什么的？",
    "questionType": 3,
    "subjectID": 5,
    "answer": "Vuex 是 Vue 的状态管理模式..."
  }
]`
      }}</pre>
    </div>
    <div class="import-upload">
      <input
        ref="fileInput"
        type="file"
        accept=".json,application/json"
        @change="handleFileChange"
      />
      <el-button
        type="primary"
        :disabled="!importList.length"
        @click="doImport"
      >
        确认导入（{{ importList.length }} 道）
      </el-button>
    </div>
    <div v-if="importList.length" class="import-preview">
      <div
        v-for="(item, index) in importList"
        :key="index"
        class="preview-item"
      >
        <span class="preview-index">{{ index + 1 }}.</span>
        <span class="preview-type">{{ typeName(item.questionType) }}</span>
        <span class="preview-question">{{ item.question }}</span>
      </div>
    </div>
  </el-dialog>

  <!-- 编辑题目弹窗 -->
  <el-dialog v-model="editVisible" title="编辑题目" width="640px">
    <el-form label-width="80px">
      <el-form-item label="题干">
        <el-input v-model="editForm.question" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="难度">
        <el-radio-group v-model="editForm.difficulty">
          <el-radio label="0">简单</el-radio>
          <el-radio label="1">中等</el-radio>
          <el-radio label="2">困难</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="editForm.tags" placeholder="多个标签用逗号分隔" />
      </el-form-item>
      <el-form-item label="答案">
        <el-input v-model="editForm.answer" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import QuestionCard from '@/components/QuestionCard/index.vue';
import VirtualList from '@/components/VirtualList/index.vue';
import { ref, reactive, onMounted } from 'vue';
import {
  parseHashQuery,
  firstQueryValue,
  questionType,
  exportQuestionsToCsv,
} from '@/utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import { CircleClose } from '@element-plus/icons-vue';
import type { IImportQuestion, IQuestion } from '@/types';

import {
  getAllChkQuestions,
  getNoChkQuestions,
  deleteQuestions,
  chkQuestions,
  searchQuestion,
  importQuestions,
  updateQuestion,
  getDeletedQuestions,
  restoreQuestion,
} from '@/services';
interface IChkQuestion {
  id: number;
  chkState: number;
  chkRemarks?: string;
  activeName: string;
}
const { index } = parseHashQuery();
const activeName = ref(firstQueryValue(index, 'nochk'));
//获取已审核题目
const ChkQuestions = ref<IQuestion[]>([]);
const from = ref();
//获取未审核题目
const NoChkQuestions = ref();
const loading = ref(true);
const loadingMore = ref(false);
const currentNoChkPage = ref(1);
const noChkTotal = ref(0);
const chkTotal = ref(0);
const searchData = ref();
const clickSearch = ref(false);
const currentSearchPage = ref(1);
const searchTotal = ref(0);
// 已删除题目
const DeletedQuestions = ref<IQuestion[]>([]);
const currentDeletedPage = ref(1);
const deletedTotal = ref(0);
const deletedParams = reactive({
  currentPage: 1,
  pageSize: 10,
});
// 批量导入
const importDialogVisible = ref(false);
const importList = ref<IImportQuestion[]>([]);
const fileInput = ref<HTMLInputElement>();
// 编辑题目
const editVisible = ref(false);
const editForm = reactive({
  id: 0,
  question: '',
  answer: '',
  difficulty: '',
  tags: '',
});

const nochkParams = reactive({
  currentPage: 1,
  pageSize: 10,
});
const chkParams = reactive({
  currentPage: 1,
  pageSize: 10,
});
const form = reactive({
  keyword: '',
});
const getSearchDataParams = reactive({
  keyword: '',
  currentPage: 1,
  pageSize: 10,
});
const handleNoChkCurrentChange = (val: number) => {
  nochkParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getNoChkQuestion();
};
// 已审核列表：滚动到底部追加下一页（与分页器二选一，此处走无限滚动）
const loadMoreChk = async () => {
  if (loading.value || loadingMore.value) return;
  if (ChkQuestions.value.length >= chkTotal.value) return;
  loadingMore.value = true;
  chkParams.currentPage += 1;
  try {
    await getAllChkQuestion(true);
  } catch (err) {
    // 加载失败回退页码，避免页码与数据错位
    chkParams.currentPage -= 1;
  } finally {
    loadingMore.value = false;
  }
};
const getNoChkQuestion = async () => {
  const res = await getNoChkQuestions(nochkParams);
  NoChkQuestions.value = res.result;
  noChkTotal.value = res.total;
  loading.value = false;
};
const getAllChkQuestion = async (append = false) => {
  // 非追加（首次加载/切回标签页/删除后刷新）时回到第一页，
  // 否则会停留在上次滚动加载到的页码，导致列表只剩那一页数据
  if (!append) {
    chkParams.currentPage = 1;
  }
  const res = await getAllChkQuestions(chkParams);
  const list = res?.result ?? [];
  if (append) {
    ChkQuestions.value = [...ChkQuestions.value, ...list];
  } else {
    ChkQuestions.value = list;
  }
  chkTotal.value = res?.total ?? 0;
  loading.value = false;
};
// 导出当前标签页全部题目为 CSV
const exportCsv = async () => {
  const isChk = activeName.value === 'chk';
  const params = { currentPage: 1, pageSize: 99999 };
  const res = isChk
    ? await getAllChkQuestions(params)
    : await getNoChkQuestions(params);
  const list = res?.result ?? [];
  if (!list.length) {
    ElMessage.warning('没有可导出的题目');
    return;
  }
  exportQuestionsToCsv(list, isChk ? '已审核题目' : '未审核题目');
  ElMessage.success(`已导出 ${list.length} 道题目`);
};

// 下载题目导入模板（CSV）
const downloadTemplate = () => {
  const headers = [
    '题干',
    '题型(0单选/1多选/2判断/3简答)',
    '难度(0简单/1中等/2困难)',
    '科目ID',
    '答案',
    '选项(A|xx,B|yy)',
    '标签',
  ];
  const example = [
    'HTML 中用于插入图片的标签是？',
    '0',
    '0',
    '2',
    'A',
    'A|<img>、B|<image>、C|<pic>、D|<figure>',
    'HTML,基础',
  ];
  const csv = '\ufeff' + [headers.join(','), example.join(',')].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '题目导入模板.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
const getDeletedQuestion = async () => {
  const res = await getDeletedQuestions(deletedParams);
  DeletedQuestions.value = res.result;
  deletedTotal.value = res.total;
  loading.value = false;
};
const handleDeletedCurrentChange = (val: number) => {
  deletedParams.currentPage = val;
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getDeletedQuestion();
};
const restoreQuestionFun = (id: number) => {
  restoreQuestion({ id }).then(() => {
    ElMessage.success('已恢复');
    getDeletedQuestion();
  });
};
const handleClick = (tab: { props: { name?: string | number } }) => {
  loading.value = true;
  if (tab.props.name === 'nochk') {
    getNoChkQuestion();
  } else if (tab.props.name === 'deleted') {
    getDeletedQuestion();
  } else {
    getAllChkQuestion();
  }
};
const onSubmit = () => {
  if (!form.keyword) {
    ElMessage.error('请输入搜索关键词');
    return;
  }
  loading.value = true;
  getSearchData({ currentPage: 1 });
};
const clearSearch = () => {
  form.keyword = '';
  clickSearch.value = false;
};

const getSearchData = (val?: { currentPage: number }) => {
  searchQuestion({
    ...form,
    currentPage: val ? val.currentPage : currentSearchPage.value,
    pageSize: 10,
  }).then((res) => {
    searchData.value = res?.result;
    searchTotal.value = res?.total;
    clickSearch.value = true;
    loading.value = false;
  });
};
const handleSearchCurrentChange = (val: number) => {
  getSearchDataParams.currentPage = val;
  // 滚到顶部
  document.documentElement.scrollTop = 0;
  loading.value = true;
  getSearchData();
};
onMounted(() => {
  getNoChkQuestion();
  getAllChkQuestion();
  loading.value = false;
});

const deleteQuestion = (id: number, activeName: string) => {
  ElMessageBox.confirm(
    '确定删除该题目吗？相关评论、点赞、试卷引用将一并清理',
    '提示',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(() => {
    deleteQuestions({ id }).then(() => {
      if (activeName === 'nochk') {
        getNoChkQuestion();
      } else {
        getAllChkQuestion();
      }
    });
  });
};
const check = (params: IChkQuestion) => {
  chkQuestions(params).then(() => {
    if (activeName.value === 'nochk') {
      getNoChkQuestion();
    } else {
      getAllChkQuestion();
    }
  });
};
const uncheck = (params: IChkQuestion) => {
  chkQuestions(params).then(() => {
    if (activeName.value === 'nochk') {
      getNoChkQuestion();
    } else {
      getAllChkQuestion();
    }
  });
};

// ===== 批量导入 =====
const typeName = (qt: number | string) => questionType(Number(qt));
const openImportDialog = () => {
  importList.value = [];
  importDialogVisible.value = true;
};
const handleFileChange = () => {
  const file = fileInput.value?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result ?? ''));
      const list = Array.isArray(parsed) ? parsed : [];
      importList.value = list as IImportQuestion[];
      ElMessage.success(`已解析 ${list.length} 道题目`);
    } catch {
      ElMessage.error('JSON 解析失败，请检查文件格式');
      importList.value = [];
    }
    // 允许重复选择同一文件
    if (fileInput.value) fileInput.value.value = '';
  };
  reader.readAsText(file, 'utf-8');
};
const doImport = async () => {
  if (!importList.value.length) return;
  const res = await importQuestions({ questions: importList.value });
  ElMessage.success(`成功导入 ${res?.imported ?? 0} 道题目`);
  importDialogVisible.value = false;
  importList.value = [];
  // 刷新列表
  getNoChkQuestion();
  getAllChkQuestion();
};

// ===== 编辑题目 =====
const handleEdit = (q: IQuestion) => {
  editForm.id = q.id;
  editForm.question = q.question;
  editForm.answer = q.answer;
  editForm.difficulty = String(q.difficulty ?? '');
  editForm.tags = Array.isArray(q.tags) ? q.tags.join(',') : q.tags || '';
  editVisible.value = true;
};

const saveEdit = async () => {
  if (!editForm.question.trim() || !editForm.answer.trim()) {
    ElMessage.warning('题干和答案不能为空');
    return;
  }
  await updateQuestion({
    id: editForm.id,
    question: editForm.question,
    answer: editForm.answer,
    difficulty: editForm.difficulty,
    tags: editForm.tags,
  });
  ElMessage.success('修改成功');
  editVisible.value = false;
  getAllChkQuestion();
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
.search {
  display: flex;
  flex-direction: row;
}
:deep(.el-loading-mask) {
  z-index: 9;
}
.batch-bar {
  margin-bottom: 12px;
}
.import-tip {
  color: #606266;
  font-size: 13px;
}
.import-sample {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.6;
  overflow: auto;
  max-height: 200px;
  margin: 8px 0 12px;
}
.import-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}
.import-preview {
  margin-top: 12px;
  max-height: 220px;
  overflow: auto;
  border: 1px solid #eee;
  border-radius: 4px;
}
.preview-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}
.preview-index {
  color: #909399;
  flex-shrink: 0;
}
.preview-type {
  flex-shrink: 0;
  font-size: 12px;
  background-color: #f5f5f5;
  color: #333;
  padding: 1px 8px;
  border-radius: 3px;
}
.preview-question {
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-total {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
}
</style>
