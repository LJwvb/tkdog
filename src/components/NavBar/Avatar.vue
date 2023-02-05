<template>
  <el-row>
    <el-col :xs="0" :sm="0" :md="0" :lg="12" :xl="12">
      <el-dropdown style="padding-top: 10%">
        <!-- <el-button type="primary" size="large">
          上传<el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>上传题目
              
  </el-dropdown-item>

            <el-dropdown-item>创建试卷</el-dropdown-item>
          </el-dropdown-menu>
        </template> -->
        <el-button type="primary" class="search" @click="toaddSuject">上传</el-button>
      </el-dropdown>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
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
    </el-col>
  </el-row>
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
<style >
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
