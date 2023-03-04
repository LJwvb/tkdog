<template>
  <div class="add-paper">
    <el-steps :active="active" finish-status="success" class="steps">
      <el-step title="试卷信息" />
      <!-- <el-step title="选择题目" /> -->
      <el-step title="游览题目" />
      <el-step
        :title="error ? '失败' : '成功'"
        :status="error ? 'error' : 'process'"
      />
    </el-steps>
    <div class="step-content">
      <OneStep v-if="active === 0" :clickNext="next" />
      <!-- <TwoStep v-if="active === 1" :clickNext="next" :clickPre="prev" /> -->
      <ThreeStep
        v-if="active === 1"
        :done="done"
        :clickPre="prev"
        :clickNext="next"
      />
      <FourStep v-if="active === 2" :clickPre="prev" :error="error" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import queryString from 'query-string';
import { useStore } from 'vuex';

import OneStep from '@/components/PaperStep/oneStep.vue';
// import TwoStep from '@/components/PaperStep/twoStep.vue';
import ThreeStep from '@/components/PaperStep/threeStep.vue';
import FourStep from '@/components/PaperStep/fourStep.vue';
import { getPaperQuestion } from '@/services';
import { ElMessage } from 'element-plus';

const { step } = queryString.parse(window?.location?.href?.split('?')[1] || '');

const router = useRouter();
const store = useStore();

// router.push({
//   path: '/addPaper/addPaperone',
// });
const active = ref(step ? Number(step) : 0);
const questionList = store.state.selectedTopic;
const paperInfo = store.state.paperInfo;
const error = ref();
const next = () => {
  if (active.value++ > 1) active.value = 0;
};
const prev = () => {
  if (active.value-- < 0) active.value = 1;
};
const done = () => {
  getPaperQuestion({
    ids: questionList.map((item: any) => item.id).join(','),
    paperTitle: paperInfo.name,
    paperTags: paperInfo.dynamicTags.join(','),
    purview: paperInfo.auth,
    author: store.state.userData.username,
  }).then((res) => {
    if (res.code === 200) {
      // 倒计时5s
      let count = 5;
      const timer = setInterval(() => {
        if (count === 1) {
          clearInterval(timer);
          router.push('/testPaper');
        }
        ElMessage({
          message: `试卷创建成功,${count}秒后跳转到试卷列表`,
          type: 'success',
          duration: 1000,
        });
        count--;
      }, 1000);
    }
  });
};
</script>

<style scoped>
.add-paper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.steps {
  width: 100%;
}
.step-content {
  position: absolute;
  top: 100px;
  width: 100%;
}
.next-step {
  position: absolute;
}
::v-deep .el-step__head.is-success .el-step__icon-inner.is-status {
  color: var(--el-color-success);
}
::v-deep .el-step__head.is-error .el-step__icon-inner.is-status {
  color: var(--el-color-danger);
}
</style>
