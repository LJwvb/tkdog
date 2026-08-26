<template>
  <div class="test-paper-container">
    <el-card class="container" @click="goPaperDetail">
      <div class="test-title">{{ paper?.paper_title }}</div>
      <div class="tags">
        <el-tag v-for="tag in tags" :key="tag" class="tag-item">
          {{ tag }}
        </el-tag>
      </div>
      <div class="paper-info">
        <div class="ctime">
          <el-icon style="width: 15px; height: 15px">
            <Timer />
          </el-icon>
          <span class="value">{{ addDate }}</span>
        </div>
        <div class="author">
          <el-icon style="width: 15px; height: 15px">
            <User />
          </el-icon>
          <span class="value">{{ paper?.author }}</span>
        </div>
      </div>
      <div class="watermark">{{ name }}</div>
    </el-card>
    <div v-if="store.state.userData.isAdmin">
      <el-button
        v-if="activeNames === 'deleted'"
        type="success"
        class="btn1"
        @click="() => emit('restore', props.paper?.paper_id)"
        >恢复</el-button
      >
      <el-button
        v-if="activeNames !== 'deleted'"
        type="danger"
        class="btn2"
        @click="
          () => {
            emit('delete', props.paper?.paper_id, activeNames);
          }
        "
        >删除</el-button
      >
      <el-button
        v-if="activeNames === 'nochk'"
        type="primary"
        class="btn1"
        @click="() => emit('check', checkParams, activeNames)"
        >审核通过</el-button
      >
      <el-button
        v-if="activeNames === 'nochk'"
        type="info"
        class="btn3"
        @click="() => emit('uncheck', unCheckParams, activeNames)"
        >审核不通过</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { transitionTime } from '@/utils';
import router from '@/router';
import { useStore } from 'vuex';
import { ChkState, type IPaperCard } from '@/types';
import { Timer, User } from '@element-plus/icons-vue';

const store = useStore();

const props = defineProps({
  paper: {
    type: Object as PropType<IPaperCard>,
    default: () => ({}),
  },
  name: {
    type: String,
    default: '',
  },
  activeNames: {
    type: String,
    default: '',
  },
});

/* eslint-disable @typescript-eslint/no-explicit-any --
 * 审核/删除事件参数的具体契约由调用方（管理端页面）决定，这里用 any 保持签名兼容。 */
const emit = defineEmits<{
  (e: 'delete', paperId: any, activeNames: string): void;
  (e: 'check', params: any, activeNames: string): void;
  (e: 'uncheck', params: any, activeNames: string): void;
  (e: 'restore', paperId: any): void;
}>();

const checkParams = {
  paperId: props.paper?.paper_id,
  chkState: ChkState.Approved,
};
const unCheckParams = {
  paperId: props.paper?.paper_id,
  chkState: ChkState.Rejected,
};
const tags = computed(() => {
  if (Array.isArray(props.paper?.paper_tags)) {
    return props.paper?.paper_tags?.filter((item: string) => item !== '');
  }
  return props.paper?.paper_tags
    ?.split(',')
    .filter((item: string) => item !== '');
});
const addDate = computed(() => {
  return transitionTime(props.paper?.ctime);
});
const goPaperDetail = () => {
  router.push({
    path: '/testPaper/paperDetail',
    query: {
      paperID: props.paper?.paper_id,
    },
  });
};
</script>

<style scoped>
.test-paper-container {
  position: relative;
  height: 100%;
}
.container {
  position: relative;
  cursor: pointer;
  height: 100%;
}

.test-title {
  font-size: 20px;
  font-weight: 600;
  z-index: 1;
}

.tags {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
}

.tag-item {
  margin-right: 10px;
}

.paper-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: var(--el-card-padding);
}

.author {
  margin-left: 20px;
}

.watermark {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #b0b6bd;
  font-size: 12px;
  line-height: 1;
  padding: 4px 8px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background-color: #fafafa;
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
