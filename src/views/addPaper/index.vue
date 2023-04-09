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
      <FourStep
        v-if="active === 2"
        :clickPre="prev"
        :error="error"
        :goTestPaper="goTestPaper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import queryString from 'query-string';
import { useStore } from 'vuex';

import OneStep from './PaperStep/oneStep.vue';
import ThreeStep from './PaperStep/threeStep.vue';
import FourStep from './PaperStep/fourStep.vue';
import { getPaperQuestion } from '@/services';
import { ElMessage } from 'element-plus';

const { step } = queryString.parse(window?.location?.href?.split('?')[1] || '');

const router = useRouter();
const store = useStore();
let timer: any = null;

const active = ref(step ? Number(step) : 0);
const error = ref();
const paperInfo = ref(store.state.paperInfo);
const questionList = ref(store.state.selectedTopic);
watch(
  () => store.state.paperInfo,
  (val) => {
    paperInfo.value = val;
  },
  { deep: true },
);
const next = () => {
  if (active.value++ > 1) active.value = 0;
};
const prev = () => {
  if (active.value-- < 0) active.value = 1;
};
const goTestPaper = () => {
  if (store.state.userData.isAdmin) {
    router.push({
      path: '/adminQuestion',
      query: {
        index: 'chk',
      },
    });
  } else {
    router.push('/questionPage');
  }
  clearTimeout(timer);
};
const done = () => {
  getPaperQuestion({
    ids: questionList.value?.map((item: any) => item.id)?.join(','),
    paperTitle: paperInfo.value?.name,
    paperTags: paperInfo.value?.dynamicTags?.join(','),
    purview: store.state.userData?.isAdmin ? -1 : paperInfo.value?.auth,
    author: store.state.userData.username,
  }).then((res) => {
    if (res.code === 200) {
      store.commit('setPaperInfo', {});
      store.commit('addSelectedTopic', []);
      ElMessage({
        message: res.message,
        type: 'success',
        duration: 1000,
      });
      // 倒计时5s
      let count = 5;
      timer = setInterval(() => {
        if (count === 1) {
          if (store.state.userData.isAdmin) {
            router.push('/adminTestPaper');
            store.commit('setActiveMenuIndex', '3');
          } else {
            router.push('/user/UserTestPaper');
            store.commit('setActiveMenuIndex', '4');
          }
          clearInterval(timer);
        }
        ElMessage({
          message: `试卷创建成功,${count}秒后跳转到试卷列表`,
          type: 'success',
          duration: 1000,
        });
        count--;
      }, 1000);
    } else {
      ElMessage({
        message: res.message,
        type: 'error',
        duration: 3000,
      });
      error.value = res;
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
  position: relative;
  top: 10px;
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
