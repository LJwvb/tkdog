<template>
  <div v-for="(item, index) in question" :key="index">
    <div class="card-container" @click="toProblem_info">
      <div class="title">
        <span> {{ item.question }} </span>
      </div>
      <div class="tags">
        <el-tag class="tag-item">
          {{ item.questionType }}
        </el-tag>
        <el-tag class="tag-item">
          {{ item.difficulty }}
        </el-tag>
        <el-tag class="tag-item">
          {{ item.direction }}
        </el-tag>
      </div>
      <div class="info">
        <span>简答题</span>
        <div class="line" />
        <span>{{ item.difficulty }}</span>
        <div class="line" />
        <span>2020-08-08</span>
      </div>
      <el-button type="primary" class="btn">选题</el-button>
      <div class="nums">
        <div class="num-item">
          <el-icon style="width: 15px; height: 15px">
            <View />
          </el-icon>
          <span>{{ item.browses_num }}</span>
        </div>
        <div class="num-item">
          <el-icon style="width: 15px; height: 15px">
            <Star />
          </el-icon>
          <span>{{ item.likes_num }}</span>
        </div>
        <div class="num-item">
          <el-icon style="width: 15px; height: 15px">
            <Odometer />
          </el-icon>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import router from '../../router';
// import { params } from '../api/params';
import { question } from '../api/question';
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
});

const toProblem_info = () => {
  router.push({
    path: '/problem_info',
  });
};
</script>
<style scoped>
.card-container {
  height: 200px;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  position: relative;
  border: 2px solid #e6e6e6;
  box-shadow: 0 10px 20px #e6e6e6;
}

.btn {
  float: right;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
}

.tags {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 10px;
}

.tag-item {
  margin-right: 10px;
}

.info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
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
  width: 300px;
  font-size: 13px;
  position: absolute;
  bottom: 10px;
}

.num-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
</style>
