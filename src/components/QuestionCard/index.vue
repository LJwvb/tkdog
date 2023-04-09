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
        <span>{{ type }}</span>
        <div class="line" />
        <span>{{ degreeDifficulty }}</span>
        <div class="line" />
        <span>{{ addDate }}</span>
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
            <User />
          </el-icon>
          <span class="num-text">{{ question?.creator }}</span>
        </div>
      </div>
    </div>
    <el-button
      type="primary"
      class="btn0"
      @click="selectedTopic"
      v-if="
        props.type === '' || props.type === 'checked' || props.type === 'all'
      "
      :disabled="isChecked"
      >{{ isChecked ? '已选题' : '选题' }}</el-button
    >
    <div v-if="store.state.userData.isAdmin">
      <el-button
        type="danger"
        class="btn2"
        @click="
          () => {
            deleteQuestion(question.id);
          }
        "
        >删除</el-button
      >
      <el-button
        type="primary"
        class="btn1"
        v-if="activeName === 'nochk'"
        @click="() => check(checkParams)"
        >审核通过</el-button
      >
      <el-button
        type="info"
        class="btn3"
        v-if="activeName === 'nochk'"
        @click="() => uncheck(unCheckParams)"
        >审核不通过</el-button
      >
      <el-button
        type="primary"
        class="btn1"
        @click="selectedTopic"
        :disabled="isChecked"
        v-if="activeName === 'chk'"
      >
        {{ isChecked ? '已选题' : '选题' }}</el-button
      >
    </div>
    <el-button
      type="danger"
      class="btn0"
      @click="deleteTopic"
      v-if="props.type === 'paper'"
      >删除</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, watchEffect, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

import router from '@/router';
import type { IQuestion } from '@/types';
import { browseQuestion, deleteQuestions, getQuestionList } from '@/services';
import { questionType, difficulty, transitionTime } from '@/utils';
const store = useStore();
const isChecked = ref(false);
const props = defineProps({
  question: {
    type: Array as unknown as () => IQuestion,
    default: () => [],
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
  deleteQuestion: {
    type: Function,
    default: () => {},
  },
  check: {
    type: Function,
    default: () => {},
  },
  uncheck: {
    type: Function,
    default: () => {},
  },
  activeName: {
    type: String,
    default: '',
  },
});
console.log(props);
const question = props.question as IQuestion;
const checkParams = {
  id: question.id,
  chkState: 1,
  chkUser: store.state.userData.name,
  chkRemarks: '审核通过',
  creator: question.creator,
};
const unCheckParams = {
  id: question.id,
  chkState: -1,
  chkUser: store.state.userData.name,
  chkRemarks: '审核不通过',
  creator: question.creator,
};

const tags = Array.isArray(question?.tags)
  ? question?.tags?.filter((item: string) => item !== '')
  : question?.tags?.split(',').filter((item: string) => item !== '');

const id = question?.id;
const type = computed(() => {
  return questionType(Number(question?.questionType));
});
const degreeDifficulty = computed(() => {
  return difficulty(Number(question?.difficulty));
});
const addDate = computed(() => {
  return transitionTime(question?.addDate);
});

const toProblemInfo = () => {
  router.push({
    path: `/problemInfo`,
    query: {
      id,
      type: props?.type,
      isClickSearch: String(props?.isClickSearch),
      catalogID: props?.catalogID,
    },
  });
  const setBrowseTopicsId = store.state.browseTopicsId;
  const setBrowseTopicsIds = setBrowseTopicsId.map((item: string) => item);
  if (!setBrowseTopicsIds.includes(id)) {
    store.commit('setBrowseTopicsId', [...store.state.browseTopicsId, id]);
    browseQuestion({ id, username: store.state.userData.username });
  }
};
const selectedTopic = () => {
  // 获取之前选中的题目
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
  selectedTopic.splice(index, 1);
  store.commit('setSelectedTopic', selectedTopic);
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

.nums {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
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
</style>
