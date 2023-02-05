<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <Logo></Logo>
    </el-col>
    <el-col :span="8">
      <Menu></Menu>
    </el-col>
    <el-col :span="8">
      <Search></Search>
    </el-col>
    <el-col :span="4">
      <Avatar></Avatar>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import Avatar from './Avatar.vue';
import Logo from './Logo.vue';
import Menu from './Menu.vue';
import Search from './Search.vue';
</script>
<style lang="scss">
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
