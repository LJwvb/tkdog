<template>
  <div class="hello">
    <el-card class="box-card">
      <div class="colonn background1">
        <div class="rowsb padding23 border_bottom center_center">
          <div>浏览历史（10）</div>
        </div>
        <div class="colonn">
          <QuestionCard
            style="margin-top: 20px"
            v-for="(item, index) in 10"
            :key="index"
          ></QuestionCard>
          <div class="roww endend" style="padding: 10px 20px">
            <div>总数650</div>
            <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuestionCard from '@/components/QuestionCard/index.vue';

const name = ref('me_compon');
const input = ref('');

// me_collection.vue
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
