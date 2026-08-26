<template>
  <div
    v-loading="loading"
    class="user-info-container"
    element-loading-text="加载中..."
  >
    <el-tabs v-model="activeChkState" @tab-change="handleTabChange">
      <el-tab-pane label="未审核" :name="String(ChkState.Pending)" />
      <el-tab-pane label="已审核" :name="String(ChkState.Approved)" />
      <el-tab-pane label="不通过" :name="String(ChkState.Rejected)" />
    </el-tabs>

    <el-card style="min-height: 500px">
      <div v-if="questionList.length > 0">
        <div v-for="item in questionList" :key="item.id">
          <QuestionCard
            :question="item"
            type="userQuestions"
            :card-tip="cardTipFor(item, store.state.userData.username)"
            @edit="openEdit"
          />
        </div>
      </div>
      <el-empty v-else :image-size="200" description="没有上传题目" />

      <el-pagination
        v-model:current-page="currentPage"
        background
        layout="slot, prev, pager, next"
        :total="total"
        prev-text="上一页"
        next-text="下一页"
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
      >
        <template #default> 共 {{ total }} 条 </template>
      </el-pagination>
    </el-card>

    <!-- 编辑题目弹窗 -->
    <el-dialog v-model="editVisible" title="编辑题目" width="640px">
      <el-form label-width="80px">
        <el-form-item label="题干">
          <el-input
            v-model="editForm.question"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="难度">
          <el-radio-group v-model="editForm.difficulty">
            <el-radio label="0">简单</el-radio>
            <el-radio label="1">中等</el-radio>
            <el-radio label="2">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签">
          <el-input
            v-model="editForm.tags"
            placeholder="多个标签用逗号分隔"
          />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';

import { getUserUploadQues, updateQuestion } from '@/services';
import QuestionCard from '@/components/QuestionCard/index.vue';
import { ChkState, type IQuestion } from '@/types';
import { reviewingCardTip } from '@/utils';

const store = useStore();
const questionList = ref<IQuestion[]>([]);
const currentPage = ref(1);
const total = ref(0);
const loading = ref(true);
const activeChkState = ref(String(ChkState.Pending));

// 审核中（二次编辑后重新审核）题目点击卡片时的提示
const cardTipFor = reviewingCardTip;

const getUserUploadQuesParams = reactive({
  userId: store?.state?.userData?.userId as number,
  pageSize: 10,
  chkState: ChkState.Pending,
});

const getUserUploadQuesData = async () => {
  loading.value = true;
  const res = await getUserUploadQues({
    ...getUserUploadQuesParams,
    currentPage: currentPage.value,
  });
  questionList.value = res?.data ?? [];
  total.value = res?.total ?? 0;
  loading.value = false;
};

const handleTabChange = (name: string | number) => {
  getUserUploadQuesParams.chkState = Number(name);
  currentPage.value = 1;
  getUserUploadQuesData();
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  getUserUploadQuesData();
};

// ===== 编辑题目 =====
const editVisible = ref(false);
const editForm = reactive({
  id: 0,
  question: '',
  answer: '',
  difficulty: '',
  tags: '',
  chkState: 0,
});
const openEdit = (q: IQuestion) => {
  editForm.id = q.id;
  editForm.question = q.question;
  editForm.answer = q.answer;
  editForm.difficulty = String(q.difficulty ?? '');
  editForm.tags = Array.isArray(q.tags) ? q.tags.join(',') : q.tags || '';
  editForm.chkState = Number(q.chkState ?? 0);
  editVisible.value = true;
};
const saveEdit = async () => {
  if (!editForm.question.trim() || !editForm.answer.trim()) {
    ElMessage.warning('题干和答案不能为空');
    return;
  }
  // 审核通过的题目编辑后需重新审核，先弹二级确认
  if (editForm.chkState === 1) {
    try {
      await ElMessageBox.confirm(
        '该题已审核通过，编辑后需要重新审核，确认继续吗？',
        '提示',
        {
          confirmButtonText: '确认编辑',
          cancelButtonText: '取消',
          type: 'warning',
        },
      );
    } catch {
      return; // 用户取消
    }
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
  getUserUploadQuesData();
};

onMounted(() => {
  getUserUploadQuesData();
});
</script>

<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
</style>
