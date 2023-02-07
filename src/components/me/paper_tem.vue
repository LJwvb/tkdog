<template>
  <div class="title-small">
    <div class="colonn border_bottom">
      <div
        style="font-weight: bold; margin: 15px 0px; padding: 0px 20px 0px 20px"
      >
        2023腾讯春招面试题
      </div>

      <div class="huanhang" style="padding: 0px 20px 0px 20px">
        <div class="biaoqian1" v-for="(item, index) in 7">标签二</div>
      </div>

      <div
        class="roww center_center jiandaee"
        style="
          line-height: 20px;
          height: 20px;
          padding: 0px 20px 10px 0px;
          margin-top: 0px;
          margin-bottom: 0px;
        "
      >
        <div>2020-08-08</div>
        <div class="line1"></div>
        <div class="el-icon-scissors">困难</div>
        <div class="allline"></div>
      </div>
      <div
        class="roww"
        style="
          padding-bottom: 15px;
          border-bottom: #f5f5f5 solid 1px;
          margin-bottom: 10px;
        "
      >
        <div class="roww center_center" style="margin-right: 20px">
          <el-icon style="width: 15px; height: 15px">
            <View />
          </el-icon>
          <div class="nums">16472</div>
        </div>
        <div class="roww center_center" style="margin-right: 20px">
          <el-icon style="width: 15px; height: 15px">
            <Star />
          </el-icon>
          <div class="nums">16472</div>
        </div>
        <div class="roww center_center" style="margin-right: 20px">
          <el-icon style="width: 15px; height: 15px">
            <ChatDotRound />
          </el-icon>
          <div class="nums">16472</div>
        </div>
        <div class="roww center_center" style="margin-right: 20px">
          <el-icon style="width: 15px; height: 15px">
            <Odometer />
          </el-icon>
          <div class="nums">16472</div>
        </div>

        <div style="" class="bens">选题</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
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
</style>
