<template>
  <div class="left">
    <el-button type="primary" class="upload" @click="toaddSuject">
      上传
    </el-button>
    <el-dropdown>
      <span>
        <el-avatar :size="50" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="toInfo">
            <el-icon>
              <Avatar />
            </el-icon>
            个人中心
          </el-dropdown-item>
          <el-dropdown-item @click="toMessage">
            <el-icon>
              <Message />
            </el-icon>
            消息
          </el-dropdown-item>
          <el-dropdown-item divided style="color: #f56c6c" @click="toLogin">
            <el-icon>
              <SwitchButton />
            </el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import router from '../../router';
const toaddSuject = () => {
  router.push({
    path: '/add_subject',
  });
};
const toInfo = () => {
  router.push({
    path: '/user/me_info',
  });
};
const toMessage = () => {
  router.push({
    path: '/user/me_news',
  });
};
const toLogin = () => {
  router.push({
    path: '/Login',
  });
};
</script>
<style scoped>
.left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload {
  margin-right: 20px;
}
</style>
