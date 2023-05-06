dd
<template>
  <el-tabs v-model="active" class="tabs" @tab-click="tabClick">
    <div v-if="type === 'home'">
      <el-tab-pane
        v-for="(item, index) in catalogIDList"
        :key="item?.catalogID"
        :label="item?.catalogName"
        :name="index"
      >
        <div v-if="questionList.length > 0">
          <div v-for="item in questionList" :key="item?.id">
            <QuestionCard :question="item" :type="props.type" />
          </div>
        </div>
        <el-empty v-else :image-size="200" description="暂无题目" />
        <div class="more" @click="goQuestion">前往题目页查看更多题目>>></div>
      </el-tab-pane>
    </div>
    <div v-else-if="type === 'all'">
      <el-tab-pane
        v-for="typeItem in subjectIDList"
        :key="typeItem.subjectID"
        :label="typeItem.content"
        :name="typeItem.subjectID"
      >
        <div v-if="questionList?.length > 0">
          <div v-for="item in questionList" :key="item?.id">
            <QuestionCard :question="item" :type="props.type" />
          </div>
        </div>
        <el-empty v-else :image-size="200" description="暂无题目" />
      </el-tab-pane>
    </div>
    <div v-else-if="type === 'userQuestions'">
      <el-tab-pane
        v-for="(typeItem, index) in questionList"
        :key="typeItem.id"
        :label="typeItem.type"
        :name="index"
      >
        <div v-if="typeItem.result.length > 0">
          <div v-for="item in typeItem.result" :key="item?.id">
            <QuestionCard :question="item" :type="type" />
          </div>
        </div>
        <el-empty v-else :image-size="200" description="没有上传题目" />
      </el-tab-pane>
    </div>
  </el-tabs>

  <el-pagination
    v-model:current-page="currentPage"
    background
    layout="slot, prev, pager, next"
    :total="total"
    prev-text="上一页"
    next-text="下一页"
    hide-on-single-page="true"
    @current-change="handleCurrentChange"
  >
    <template #default> 共 {{ total }} 条 </template>
  </el-pagination>
</template>
<script lang="ts" setup>
import { defineProps, watchEffect, ref } from 'vue';

import QuestionCard from '@/components/QuestionCard/index.vue';
import { isNaN } from '@/utils';
import router from '@/router';

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
  currentPage: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
  catalogIDList: {
    type: Array as any,
    default: () => [],
  },
  subjectIDList: {
    type: Array as any,
    default: () => [],
  },
});
// 默认选中的子标签
const active = ref<any>(0);
const currentPage = ref(props.currentPage);
watchEffect(() => {
  if (props.type === 'all') {
    active.value = props?.subjectID || 0;
  } else {
    if (props?.itemSubjectID === props?.subjectID) {
      active.value = isNaN(props?.catalogID) ? 0 : props.catalogID;
    }
  }
});
const goQuestion = () => {
  // 跳转到题目页
  router.push({
    path: '/questionPage',
    query: {
      subjectID: props?.itemSubjectID,
    },
  });
};
const emit = defineEmits(['tabClick', 'handleCurrentChange']);

const tabClick = (tab: any) => {
  currentPage.value = 1;
  // 将index传递给父组件
  emit('tabClick', tab.props.name);
};
const handleCurrentChange = (page: number) => {
  emit('handleCurrentChange', page);
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
