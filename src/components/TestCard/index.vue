<template>
  <el-card class="test-paper-container" @click="goPaperDetail">
    <div >
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
    </div>
    <div v-if="store.state.userData.isAdmin">
      <el-button
        type="danger"
        class="btn2"
        @click="
          () => {
            deletePaper(props.paper?.paper_id);
          }
        "
        >删除</el-button
      >
      <el-button
        type="primary"
        class="btn1"
        v-if="activeNames === 'nochk'"
        @click="() => check(checkParams)"
        >审核通过</el-button
      >
      <el-button
        type="info"
        class="btn3"
        v-if="activeNames === 'nochk'"
        @click="() => uncheck(unCheckParams)"
        >审核不通过</el-button
      >
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { transitionTime } from '@/utils';
import router from '@/router';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  paper: {
    type: Object as any,
    default: () => {},
  },
  name: {
    type: String,
    default: '',
  },
  deletePaper: {
    type: Function,
    default: () => {},
  },
  check: {
    type: Function,
    default: () => {},
  },
  uncheck: {
    type: Function,
    default: () => {},
  },
  activeNames: {
    type: String,
    default: '',
  },
});

const checkParams = {
  paperId: props.paper?.paper_id,
  chkState: 1,
};
const unCheckParams = {
  paperId: props.paper?.paper_id,
  chkState: 2,
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
  top: -20px;
  right: -20px;
  transform: rotate(-45deg);
  color: #ccc;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #ccc;
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
