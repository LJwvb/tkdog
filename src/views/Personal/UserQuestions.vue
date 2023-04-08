<template>
  <div
    class="user-info-container"
    v-loading="loading"
    element-loading-text="Loading..."
  >
    <el-card v-if="questionList?.length > 0" style="min-height: 500px">
      <el-tabs v-model="active" class="tabs">
        <el-tab-pane
          v-for="(item, index) in questionList"
          :key="item.id"
          :label="item.name"
          :name="index"
          class="tab-pane"
        >
          <div v-if="item?.value?.length > 0">
            <div class="test-card" v-for="ques in item.value" :key="ques.id">
              <QuestionCard :question="ques" :type="item.key" />
            </div>
          </div>
          <el-empty v-else :image-size="200" description="" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card v-else>
      <el-empty :image-size="200" description="没有上传题目" />
    </el-card>
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
const loading = ref(true);

const transFromName = (name: string) => {
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
  loading.value = false;
  if (res?.data?.uncheck?.length === 0 && res?.data?.checked?.length === 0) {
    questionList.value = [];
    return;
  }

  questionList.value = Object.keys(res.data).map((key) => {
    return {
      name: transFromName(key),
      key: key,
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
