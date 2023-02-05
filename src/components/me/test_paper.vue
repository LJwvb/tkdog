<template>
  <div>
    <div class="colonn border_bottom">
      <div
        style="
          font-weight: bold;
          margin: 15px 0px;
          padding: 0px 20px 0px 20px;
          display: flex;
          flex-direction: row;
        "
      >
        2023腾讯春招面试题
      </div>
      <div
        class="roww center_center jiandaee"
        style="
          line-height: 20px;
          height: 20px;
          padding: 0px 20px 0px 0px;
          margin-top: 0px;
          margin-bottom: 0px;
        "
      >
        <div>2020-08-08</div>
        <div class="line1"></div>
        <div class="el-icon-magic-stick">12322</div>
        <div class="allline"></div>
      </div>

      <div class="roww">
        <div class="huanhang" style="padding: 20px 20px 0px 20px">
          <div class="biaoqian2">最新</div>
          <div class="biaoqian1" v-for="(item, index) in 3">标签二</div>
        </div>
        <div class="allline"></div>
        <div class="roww">
          <el-button type="danger" style="height: 35px">删除</el-button>
          <el-button type="primary" style="height: 35px">编辑</el-button>
        </div>
        <div style="width: 20px"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style>
.jiandaee {
  color: rgba(170, 170, 170, 1);
  font-size: 13px;
  margin-left: 20px;
}

.line1 {
  width: 1px;
  height: 15px;
  background-color: #e6e6e6;
  margin: 0px 20px;
}

.biaoqian1 {
  padding: 0px 12px;
  font-size: 12px;
  background-color: #f5f5f5;
  color: #000000;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  margin-right: 15px;
  margin-bottom: 15px;
}

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
