<template>
  <div class="user-info-container">
    <el-tabs v-model="active" class="tabs">
      <el-tab-pane
        v-for="(item, index) in questionList"
        :key="item.id"
        :label="item.name"
        :name="index"
        class="tab-pane"
      >
        <div class="test-card" v-for="ques in item.value" :key="ques.id">
          <QuestionCard :question="ques" type="userQuestions" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';

import { getUserUploadQues } from '@/services';
import QuestionCard from '@/components/QuestionCard/index.vue';
const store = useStore();

const questionList = ref<any>([]);
const active = ref<any>(0);

const transFromName = (name: string) => {
  console.log(name);
  if (name === 'uncheck') {
    return '未审核通过的题目';
  }
  if (name === 'checked') {
    return '审核通过的题目';
  }
};
onMounted(async () => {
  const res = await getUserUploadQues({
    username: store?.state?.userData?.username,
  });
  questionList.value = Object.keys(res.data).map((key) => {
    return {
      name: transFromName(key),
      value: res.data[key],
    };
  });
});
</script>
<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
</style>
