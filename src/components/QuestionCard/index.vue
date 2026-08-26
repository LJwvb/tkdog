<template>
  <div class="card-container">
    <div class="card" @click="toProblemInfo()">
      <div class="title">
        <span class="title-text"> {{ question?.question }} </span>
      </div>
      <div class="tags">
        <el-tag v-for="tag in tags" :key="tag" class="tag-item">
          {{ tag }}
        </el-tag>
      </div>
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
          <el-icon style="width: 15px; height: 15px">
            <View />
          </el-icon>
          <span class="num-text">{{ question?.browses_num ?? 0 }}</span>
        </div>
        <div class="num-item">
          <el-icon style="width: 15px; height: 15px">
            <Star />
          </el-icon>
          <span class="num-text">{{ question?.likes_num ?? 0 }}</span>
        </div>
        <div class="num-item">
          <el-icon style="width: 15px; height: 15px">
            <Collection />
          </el-icon>
          <span class="num-text">{{ question?.favorite_num ?? 0 }}</span>
        </div>
        <div class="num-item">
          <el-icon style="width: 15px; height: 15px">
            <User />
          </el-icon>
          <span class="num-text">{{ question?.creator }}</span>
        </div>
      </div>
    </div>
    <el-button
      v-if="
        props.type === '' || props.type === 'checked' || props.type === 'all'
      "
      type="primary"
      class="btn0"
      :disabled="isChecked"
      @click="selectedTopic"
      >{{ isChecked ? '已选题' : '选题' }}</el-button
    >
    <div v-if="store.state.userData.isAdmin">
      <el-button
        v-if="activeName === 'deleted'"
        type="success"
        class="btn1"
        @click="() => emit('restore', question.id)"
        >恢复</el-button
      >
      <el-button
        v-if="activeName !== 'deleted'"
        type="danger"
        class="btn2"
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
        class="btn1"
        @click="openReview('check')"
        >审核通过</el-button
      >
      <el-button
        v-if="activeName === 'nochk'"
        type="info"
        class="btn3"
        @click="openReview('uncheck')"
        >审核不通过</el-button
      >
      <el-button
        v-if="activeName === 'chk'"
        type="primary"
        class="btn1"
        :disabled="isChecked"
        @click="selectedTopic"
      >
        {{ isChecked ? '已选题' : '选题' }}</el-button
      >
      <el-button
        v-if="activeName === 'chk'"
        type="warning"
        class="btn-edit"
        @click="() => emit('edit', question)"
        >编辑</el-button
      >
    </div>
    <el-button
      v-if="props.type === 'userQuestions'"
      type="warning"
      class="btn-edit"
      @click="() => emit('edit', question)"
      >编辑</el-button
    >
    <el-button
      v-if="props.type === 'paper'"
      type="danger"
      class="btn0"
      @click="deleteTopic"
      >删除</el-button
    >
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
  return question.updateUser ? `${question.updateUser} 修改于 ${t}` : `修改于 ${t}`;
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
  height: 200px;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  position: relative;
  border: 2px solid #e6e6e6;
  box-shadow: -10px -10px 20px #e6e6e6 inset;
}

.card {
  width: 100%;
  height: 100%;
}

.title {
  align-items: center;
  font-size: 25px;
  width: 100%;
  font-weight: bold;
}

.title-text {
  width: 90%;
  word-wrap: break-word;
}

.tags {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
}

.tag-item {
  margin-right: 10px;
}

.info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 13px;
  position: absolute;
  bottom: 40px;
}

.line {
  width: 1px;
  height: 10px;
  background-color: #ccc;
  margin: 0px 20px;
}

.update-info {
  color: #e6a23c;
}

.nums {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 400px;
  font-size: 13px;
  position: absolute;
  bottom: 10px;
}

.num-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.num-text {
  margin-left: 5px;
}

.btn0 {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.btn1 {
  position: absolute;
  right: 10px;
  top: 10px;
}

.btn2 {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.btn3 {
  position: absolute;
  right: 10px;
  bottom: 95px;
}
.btn-edit {
  position: absolute;
  right: 10px;
  top: 50px;
}
</style>
