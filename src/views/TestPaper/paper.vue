<template>
  <div class="card-container">
    <div class="card" @click="toPaperInfo()">
      <div class="title">
        <span class="title-text"> {{ PaperList?.paper_title }} </span>
      </div>
      <img src="../../assets/tkdog.png" class="logo1" />

      <div class="tags" style="display: flex; padding-bottom: 20px">
        <!-- <el-tag class="ml-2" type="success"> -->
        <el-tag v-for="tag in tags" :key="tag" class="tag-item">
          {{ tag }}
        </el-tag>
        <!-- {{ PaperList?.paper_tags }} -->
      </div>
      <div class="nums">
        <!-- <div class="num-item">
          <el-icon>
            <View />
          </el-icon>
          <span class="num-text">{{ paperList?.purview }}</span>
        </div> -->
        <div class="num-item">
          <el-icon>
            <Clock />
          </el-icon>
          <span class="num-text">{{ ctime }}</span>
        </div>
        <div class="num-item">
          <el-icon>
            <User />
          </el-icon>
          <span class="num-text">{{ PaperList?.author }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import { useStore } from 'vuex';
import router from '@/router';
import type { IQuestion, IGetPaperParamsList } from '@/types';
import { transitionTime } from '@/utils';
const store = useStore();

const props = defineProps({
  PaperList: {
    type: Object,
    default: () => { },
  },
  author: {
    type: String,
    default: '',
  },
  currentPage: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 0,
  },
});

const PaperList = props.PaperList as IGetPaperParamsList;
const ctime = computed(() => {
  return transitionTime(props.PaperList?.ctime);
});
const toPaperInfo = () => {
  router.push({
    path: `/volume`,
  });
};

const tags = Array.isArray(PaperList?.paper_tags)
  ? PaperList?.paper_tags?.filter((item: string) => item !== '')
  : PaperList?.paper_tags?.split(',').filter((item: string) => item !== '');
</script>
<style scoped>
.card-container {
  height: 250px;
  width: 250px;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  position: relative;
  border: 1px solid #e6e6e6;
}

.card {
  width: 100%;
  height: 100%;
}

.logo1 {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.title {
  align-items: center;
  font-size: 25px;
  width: 100%;
  height: 100px;
  font-weight: bold;
}

.title-text {
  width: 90%;
  word-wrap: break-word;
}

.tags {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
}

.tag-item {
  margin-right: 10px;
}

.info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 13px;
  position: absolute;
  bottom: 40px;
}

.line {
  width: 1px;
  height: 10px;
  background-color: #ccc;
  margin: 0px 20px;
}

.nums {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  font-size: 13px;
  position: absolute;
  bottom: 10px;
}

.num-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.num-text {
  margin-left: 5px;
}

.btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
