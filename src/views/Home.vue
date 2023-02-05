<template>
  <div class="home">
    <Tabs></Tabs>

    <el-row :gutter="40">
      <el-col class="grid-content" :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <!-- 动态页面主体
        <router-view />  -->
      </el-col>

      <!-- <el-col class="grid-content bg-purple-light" :xs="24" :sm="24" :md="16" :lg="6" :xl="16">
        <SideBar></SideBar>
      </el-col> -->
    </el-row>

    <el-backtop :right="100" :bottom="100" />

    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> -->
  </div>
</template>

<script lang="ts" setup>
import Tags from '@/components/Index/Tags.vue';
import Tabs from '@/components/Index/Tabs.vue';
import SideBar from '@/components/SideBar/SideBar.vue';
</script>
