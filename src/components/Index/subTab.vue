<template>
  <el-tabs v-model="active" class="tabs" @tab-click="tabClick">
    <el-tab-pane
      v-for="(typeItem, index) in props.questionList"
      :key="typeItem.catalog.catalogID"
      :label="typeItem.catalog.catalogName"
      :name="index"
    >
      <div v-for="item in typeItem.questionList" :key="item?.id">
        <QuestionCard :question="item" :type="props.type" />
      </div>
      <div class="more" @click="goQuestion" v-if="props.type !== 'all'">
        前往题目页查看更多题目>>>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { defineProps, watchEffect, ref } from 'vue';

import QuestionCard from '@/components/QuestionCard/index.vue';
import { isNaN } from '@/utils';
import { useStore } from 'vuex';
import router from '@/router';

const store = useStore();
// 接收父组件传递的数据
const props = defineProps({
  questionList: {
    type: Array as any,
    default: () => [],
  },
  catalogID: {
    type: Number,
    default: 0,
  },
  subjectID: {
    type: Number,
    default: 0,
  },
  itemSubjectID: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: '',
  },
});
// 默认选中的子标签
const active = ref<any>(0);
watchEffect(() => {
  if (props.type === 'all') {
    active.value = props?.catalogID || 0;
  } else {
    if (props?.itemSubjectID === props?.subjectID) {
      active.value = isNaN(props?.catalogID)
        ? 0
        : props.questionList.findIndex(
            (item: any) => item?.catalog?.catalogID === props?.catalogID,
          );
    }
  }
});
const goQuestion = () => {
  // 跳转到题目页
  router.push({
    path: '/questionPage',
  });
  // store.commit('setActiveMenuIndex', '2');
};
const emit = defineEmits(['tabClick']);

const tabClick = (tab: any) => {
  // 将index传递给父组件
  emit('tabClick', tab.props.name);
};
</script>
<style scoped>
.more {
  color: #000;
  float: right;
  cursor: pointer;
  text-decoration: underline;
}
</style>
