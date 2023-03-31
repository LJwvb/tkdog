<template>
  <div class="user-info-container">
    <el-card>
      <img :src="avatar" class="avatar" />
      <div>{{ username }}</div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const { avatar, ctime, email, last_login_time, username, sex } =
  store.state.userData;
</script>
<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
