<template>
  <div class="card-container" @click="toproblem_info">
    <div class="title">
      <span> 什么是事件？E与 Firefox的事件机制有什么区别？如何阻止冒泡？ </span>
      <el-button type="primary" class="btn">选题</el-button>
    </div>
    <div class="tags">
      <el-tag v-for="tag in tags" :key="tag" class="tag-item">
        {{ tag }}
      </el-tag>
    </div>
    <div class="info">
      <span>简答题</span>
      <div class="line" />
      <span>困难</span>
      <div class="line" />
      <span>2020-08-08</span>
    </div>
    <div class="nums">
      <div class="num-item">
        <el-icon style="width: 15px; height: 15px">
          <View />
        </el-icon>
        <span>16472</span>
      </div>
      <div class="num-item">
        <el-icon style="width: 15px; height: 15px">
          <Star />
        </el-icon>
        <span>16472</span>
      </div>
      <div class="num-item">
        <el-icon style="width: 15px; height: 15px">
          <ChatDotRound />
        </el-icon>
        <span>16472</span>
      </div>
      <div class="num-item">
        <el-icon style="width: 15px; height: 15px">
          <Odometer />
        </el-icon>
        <span>16472</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, h } from 'vue';
import router from '../../router';
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
});
const tags = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'];

const toproblem_info = () => {
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
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 25px;
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
