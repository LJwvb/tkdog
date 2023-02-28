<template>
  <el-tabs v-model="active" class="tabs">
    <el-tab-pane
      v-for="(typeItem, index) in props.questionList"
      :key="typeItem.catalog.catalogID"
      :label="typeItem.catalog.catalogName"
      :name="index"
    >
      <div v-for="item in typeItem.questionList" :key="item?.id">
        <QuestionCard :question="item" />
      </div>
    </el-tab-pane>
    <el-pagination background layout="prev, pager, next" :page-size="limit" :total="totalCount"
      :current-page="currentPage" @current-change="pageChange" />
  </el-tabs>
</template>
<script lang="ts" setup>
import { defineProps, watchEffect } from 'vue';
import QuestionCard from '@/components/QuestionCard/index.vue';
import { ref } from 'vue';
import { isNaN } from '@/utils';
// import type { TabsPaneContext } from 'element-plus';
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
});
// 默认选中的子标签
const active = ref<any>(0);
watchEffect(() => {
  if (props.itemSubjectID === props.subjectID) {
    active.value = isNaN(props.catalogID)
      ? 0
      : props.questionList.findIndex(
          (item: any) => item.catalog.catalogID === props.catalogID,
        );
  }
});

// 当前页
let currentPage = ref(1);
// 总条数
let totalCount = ref(20);
// 每页显示限制
let limit = ref(1);
const pageChange = (p: number) => {
  currentPage.value = p;
  console.log(p);

  // 发起接口请求数据 , 请求参数中使用 currentPage.value 作为查询当前页码
};
</script>
<style>
.tabs {
  margin-bottom: 20px;
}
</style>
