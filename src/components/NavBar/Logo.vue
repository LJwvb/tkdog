<template>
  <div class="mainpic">
    <img src="../../assets/tkdog.png" width="50">
    <div class="title">
      <span>题库狗</span>
    </div>
  </div>

</template>

<script setup lang="ts">


</script>
<style lang="scss">
.mainpic {
  display: flex;
  padding-left: 10px;
}

.title {
  padding-top: 15px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.bg-purple {
  background-color: #c792ea;
}
</style>