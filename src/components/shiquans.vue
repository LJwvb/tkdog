<template>
  <div class="title-small">
    <div class="grid-content background1 bg-purple">
      <div class="colonn">
        <div class="rowsb border_bottom center_center" style="padding: 20px">
          <div style="font-size: 20px; font-weight: bold">
            百度2018校园招聘-机器学习
          </div>
          <el-button>操作</el-button>
        </div>
        <div
          class="border_bottom"
          v-for="(item, index) in 10"
          style="padding: 20px"
        >
          <div>百度2018校园招聘-机器学习</div>
          <div style="font-weight: bold; margin: 15px 0px">1.单选题</div>
          <div style="font-weight: bold; margin: 15px 0px">
            以下不是SVM核函数的是
          </div>
          <div style="margin-top: 40px">A：Sigmoid核函数</div>
          <div style="margin-top: 20px">B：Sigmoid核函数</div>
          <div style="margin-top: 20px">C：Sigmoid核函数</div>
          <div style="margin-top: 20px">D：Sigmoid核函数</div>
          <div style="margin-top: 20px">解析：C</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style></style>
