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
    <el-button type="primary" class="btn" @click="selectedTopic">
      选题</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

import router from '@/router';
import type { IQuestion } from '@/types';
import { browseQuestion } from '@/services';
import { questionType, difficulty, transitionTime } from '@/utils';
const store = useStore();

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
});
const question = props.question as IQuestion;

const tags = question?.tags;
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
  const selectedTopic = store.state.selectedTopic;
  // 获取之前选中的题目id
  const selectedTopicIds = selectedTopic.map((item: IQuestion) => item.id);
  console.log(selectedTopic);
  // 判断是否已经选中
  if (selectedTopicIds.includes(id)) {
    ElMessage.error('已选中该题，若想取消请在试题篮已选题目中取消');
    return;
  } else {
    const data = {
      id: question.id,
      questionType: question.questionType,
      difficulty: question.difficulty,
      question: question.question,
      data: new Date().toLocaleString(),
    };
    store.commit('addSelectedTopic', [...selectedTopic, data]);
    ElMessage.success('选题成功，请在试题篮已选题目中查看');
  }
};
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
.btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
