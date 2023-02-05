<template>
  <div class="hello">
    <el-card class="box-card" style="margin: 20px 20px 20px 0">
      <div class="colonn background1">
        <div
          class="rowsb padding23 border_bottom center_center"
          style="justify-content: space-between"
        >
          <div>我的消息（3）</div>
          <div class="roww">
            <el-button>全部已读</el-button>
            <el-button>清空</el-button>
          </div>
        </div>

        <div class="colonn" style="margin: 10px">
          <newitem v-for="(item, index) in 4" :key="index + 'a'"></newitem>
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
import newitem from '@/components/me/newitem.vue';

// import wentiitem from "@/components/Home/wentiitem.vue"
const name = ref('me_compon');
const input = ref('');
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.biaoqian2 {
  padding: 0px 12px;
  font-size: 12px;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  margin-right: 15px;
  color: #389e0d;
  background: #f6ffed;
  border: 1px solid #389e0d;
}
</style>
