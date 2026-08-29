<template>
  <el-tabs v-model="active" class="tabs" @tab-click="tabClick">
    <div v-if="type === 'home'">
      <el-tab-pane
        v-for="(item, index) in catalogIDList"
        :key="item?.catalogID"
        :label="item?.catalogName"
        :name="index"
      >
        <VirtualList
          v-if="questionList.length > 0"
          :data="questionList"
          :height="listHeight"
          :estimated-item-height="200"
          :loading="loadingMore"
          :finished="noMore"
          @loadMore="handleLoadMore"
        >
          <template #default="{ item }">
            <QuestionCard :question="item" :type="props.type" />
          </template>
        </VirtualList>
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
        <VirtualList
          v-if="questionList?.length > 0"
          :data="questionList"
          :height="listHeight"
          :estimated-item-height="200"
          :loading="loadingMore"
          :finished="noMore"
          @loadMore="handleLoadMore"
        >
          <template #default="{ item }">
            <QuestionCard :question="item" :type="props.type" />
          </template>
        </VirtualList>
        <el-empty v-else :image-size="200" description="暂无题目" />
      </el-tab-pane>
    </div>
    <div v-else-if="type === 'userQuestions'">
      <el-tab-pane label="我的题目" name="0">
        <VirtualList
          v-if="questionList?.length > 0"
          :data="questionList"
          :height="listHeight"
          :estimated-item-height="200"
          :loading="loadingMore"
          :finished="noMore"
          @loadMore="handleLoadMore"
        >
          <template #default="{ item }">
            <QuestionCard :question="item" :type="type" />
          </template>
        </VirtualList>
        <el-empty v-else :image-size="200" description="没有上传题目" />
      </el-tab-pane>
    </div>
  </el-tabs>
</template>
<script lang="ts" setup>
import { watchEffect, ref, computed } from 'vue';
import type { PropType } from 'vue';

import QuestionCard from '@/components/QuestionCard/index.vue';
import VirtualList from '@/components/VirtualList/index.vue';
import { isNaN } from '@/utils';
import router from '@/router';
import type { IQuestion, ISubject } from '@/types';

// 接收父组件传递的数据
const props = defineProps({
  questionList: {
    type: Array as PropType<IQuestion[]>,
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
  total: {
    type: Number,
    default: 0,
  },
  loadingMore: {
    type: Boolean,
    default: false,
  },
  noMore: {
    type: Boolean,
    default: false,
  },
  listHeight: {
    type: Number,
    default: 600,
  },
  catalogIDList: {
    type: Array as PropType<
      Array<{ catalogID?: number; catalogName?: string }>
    >,
    default: () => [],
  },
  subjectIDList: {
    type: Array as PropType<ISubject[]>,
    default: () => [],
  },
});
// 默认选中的子标签
const active = ref<string | number>(0);
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
const emit = defineEmits(['tabClick', 'loadMore']);

const tabClick = (tab: { props: { name?: string | number } }) => {
  // 将index传递给父组件
  emit('tabClick', tab.props.name);
};

const handleLoadMore = () => {
  emit('loadMore');
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
