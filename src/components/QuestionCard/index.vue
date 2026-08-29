<template>
  <div class="card-container">
    <div class="card" @click="toProblemInfo()">
      <div class="title-row">
        <div class="title">
          <span class="title-text"> {{ question?.question }} </span>
        </div>
        <div class="title-actions">
          <el-button
            v-if="
              props.type === '' ||
              props.type === 'checked' ||
              props.type === 'all'
            "
            type="primary"
            size="small"
            :disabled="isChecked"
            @click.stop="selectedTopic"
            >{{ isChecked ? '已选题' : '选题' }}</el-button
          >
        </div>
      </div>
      <div class="tags">
        <el-tag v-for="tag in tags" :key="tag" class="tag-item" size="small">
          {{ tag }}
        </el-tag>
      </div>
      <div class="card-footer">
        <div class="info">
          <span>{{ typeName }}</span>
          <div class="line" />
          <span>{{ degreeDifficulty }}</span>
          <div class="line" />
          <span>{{ addDate }}</span>
          <template v-if="updateInfo">
            <div class="line" />
            <span class="update-info">{{ updateInfo }}</span>
          </template>
        </div>
        <div class="nums">
          <div class="num-item">
            <el-icon><View /></el-icon>
            <span class="num-text">{{ question?.browses_num ?? 0 }}</span>
          </div>
          <div class="num-item">
            <el-icon><Star /></el-icon>
            <span class="num-text">{{ question?.likes_num ?? 0 }}</span>
          </div>
          <div class="num-item">
            <el-icon><Collection /></el-icon>
            <span class="num-text">{{ question?.favorite_num ?? 0 }}</span>
          </div>
          <div class="num-item">
            <el-icon><User /></el-icon>
            <span class="num-text">{{ question?.creator }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-actions">
      <div v-if="store.state.userData.isAdmin" class="admin-actions">
        <el-button
          v-if="activeName === 'deleted'"
          type="success"
          size="small"
          @click="() => emit('restore', question.id)"
          >恢复</el-button
        >
        <el-button
          v-if="activeName !== 'deleted'"
          type="danger"
          size="small"
          @click="
            () => {
              emit('delete', question.id, activeName);
            }
          "
          >删除</el-button
        >
        <el-button
          v-if="activeName === 'nochk'"
          type="primary"
          size="small"
          @click="openReview('check')"
          >审核通过</el-button
        >
        <el-button
          v-if="activeName === 'nochk'"
          type="info"
          size="small"
          @click="openReview('uncheck')"
          >审核不通过</el-button
        >
        <el-button
          v-if="activeName === 'chk'"
          type="primary"
          size="small"
          :disabled="isChecked"
          @click="selectedTopic"
        >
          {{ isChecked ? '已选题' : '选题' }}</el-button
        >
        <el-button
          v-if="activeName === 'chk'"
          type="warning"
          size="small"
          @click="() => emit('edit', question)"
          >编辑</el-button
        >
      </div>
      <el-button
        v-if="props.type === 'userQuestions'"
        type="warning"
        size="small"
        @click="() => emit('edit', question)"
        >编辑</el-button
      >
      <el-button
        v-if="props.type === 'paper'"
        type="danger"
        size="small"
        @click="deleteTopic"
        >删除</el-button
      >
    </div>
  </div>

  <!-- 审核弹窗：可自定义审核建议，默认「审核通过 / 审核不通过」 -->
  <el-dialog
    v-model="reviewDialogVisible"
    :title="reviewAction === 'check' ? '审核通过' : '审核不通过'"
    width="480px"
    append-to-body
  >
    <el-form label-position="top">
      <el-form-item label="审核建议（将通知给上传用户）">
        <el-input
          v-model="reviewRemark"
          type="textarea"
          :rows="4"
          maxlength="200"
          show-word-limit
          placeholder="可填写审核建议，留空则使用默认文案"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="reviewDialogVisible = false">取消</el-button>
      <el-button
        :type="reviewAction === 'check' ? 'primary' : 'info'"
        @click="confirmReview"
        >确认</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import type { PropType } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

import router from '@/router';
import { ChkState, type IQuestion } from '@/types';
import { questionType, difficulty, transitionTime } from '@/utils';
import { View, Star, Collection, User } from '@element-plus/icons-vue';
const store = useStore();
const isChecked = ref(false);
const props = defineProps({
  question: {
    type: Object as PropType<IQuestion>,
    default: () => ({}),
  },
  type: {
    type: String,
    default: '',
  },
  isClickSearch: {
    type: Boolean,
    default: false,
  },
  catalogID: {
    type: Number,
    default: 0,
  },
  activeName: {
    type: String,
    default: '',
  },
  // 点击卡片时的提示文案：设置后点击不再跳详情，改为弹出提示
  cardTip: {
    type: String,
    default: '',
  },
});

/* eslint-disable @typescript-eslint/no-explicit-any --
 * 审核/删除事件参数的具体契约由调用方（管理端页面）决定，这里用 any 保持签名兼容。 */
const emit = defineEmits<{
  (e: 'delete', id: number, activeName: string): void;
  (e: 'check', params: any, activeName: string): void;
  (e: 'uncheck', params: any, activeName: string): void;
  (e: 'edit', question: IQuestion): void;
  (e: 'restore', id: number): void;
}>();
const question = props.question as IQuestion;
const checkParams = {
  id: question.id,
  chkState: ChkState.Approved,
  chkRemarks: '审核通过',
};
const unCheckParams = {
  id: question.id,
  chkState: ChkState.Rejected,
  chkRemarks: '审核不通过',
};

// 审核弹窗：可自定义审核建议，默认「审核通过 / 审核不通过」
const reviewDialogVisible = ref(false);
const reviewAction = ref<'check' | 'uncheck'>('check');
const reviewRemark = ref('');
const openReview = (action: 'check' | 'uncheck') => {
  reviewAction.value = action;
  reviewRemark.value = action === 'check' ? '审核通过' : '审核不通过';
  reviewDialogVisible.value = true;
};
const confirmReview = () => {
  const base = reviewAction.value === 'check' ? checkParams : unCheckParams;
  const params = {
    ...base,
    chkRemarks: reviewRemark.value.trim() || base.chkRemarks,
  };
  if (reviewAction.value === 'check') {
    emit('check', params, props.activeName);
  } else {
    emit('uncheck', params, props.activeName);
  }
  reviewDialogVisible.value = false;
};

const tags = Array.isArray(question?.tags)
  ? question?.tags?.filter((item: string) => item !== '')
  : question?.tags?.split(',').filter((item: string) => item !== '');

const id = question?.id;
const typeName = computed(() => {
  return questionType(Number(question?.questionType));
});
const degreeDifficulty = computed(() => {
  return difficulty(Number(question?.difficulty));
});
const addDate = computed(() => {
  return transitionTime(question?.addDate);
});
const updateInfo = computed(() => {
  if (!question?.updateTime) return '';
  const t = transitionTime(question.updateTime);
  return question.updateUser
    ? `${question.updateUser} 修改于 ${t}`
    : `修改于 ${t}`;
});

const toProblemInfo = () => {
  // 设置了提示文案时不跳详情，改为弹出提示
  if (props.cardTip) {
    ElMessage.info(props.cardTip);
    return;
  }
  router.push({
    path: `/problemInfo`,
    query: {
      id,
      type: props?.type,
      isClickSearch: String(props?.isClickSearch),
      catalogID: props?.catalogID,
    },
  });
};
const selectedTopic = () => {
  // 获取之前选中的题目A
  const stateSelectedTopic = store.state.selectedTopic;
  // 获取之前选中的题目id
  const selectedTopicIds = stateSelectedTopic.map((item: IQuestion) => item.id);
  // 判断是否已经选中
  if (selectedTopicIds.includes(id)) {
    ElMessage.error('已选中该题，若想取消请在试题篮已选题目中取消');
    return;
  } else {
    const data = {
      ...question,
      data: new Date().toLocaleString(),
    };
    store.commit('addSelectedTopic', [...stateSelectedTopic, data]);
    ElMessage.success('选题成功，请在试题篮已选题目中查看');
    isChecked.value = true;
  }
};
const deleteTopic = () => {
  const selectedTopic = store.state.selectedTopic;
  const selectedTopicIds = selectedTopic.map((item: IQuestion) => item.id);
  const index = selectedTopicIds.indexOf(id);
  if (index !== -1) {
    // 拷贝后删除，避免直接 mutate store state
    const next = [...selectedTopic];
    next.splice(index, 1);
    store.commit('setSelectedTopic', next);
  }
  isChecked.value = false;
  ElMessage.success('删除成功');
};
watchEffect(() => {
  // 获取之前选中的题目
  const stateSelectedTopic = store.state.selectedTopic;
  // 获取之前选中的题目id
  const selectedTopicIds = stateSelectedTopic.map((item: IQuestion) => item.id);
  if (selectedTopicIds.includes(id)) {
    isChecked.value = true;
  } else {
    isChecked.value = false;
  }
});
</script>
<style scoped>
.card-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.25s ease, transform 0.25s ease,
    border-color 0.25s ease;
  cursor: pointer;
}

.card-container:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #c0c4cc;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: #1f2d3d;
  flex: 1;
  min-width: 0;
}

.title-actions {
  flex-shrink: 0;
  padding-top: 2px;
}

.title-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  margin-right: 0 !important;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.info {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #909399;
  flex-wrap: wrap;
  gap: 0;
}

.line {
  width: 1px;
  height: 12px;
  background-color: #dcdfe6;
  margin: 0 12px;
}

.update-info {
  color: #e6a23c;
}

.nums {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 13px;
  color: #909399;
  flex-shrink: 0;
}

.num-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.num-text {
  margin-left: 0;
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.admin-actions {
  display: flex;
  gap: 8px;
}
</style>
