<template>
  <div class="nav-container" v-if="!store.state.userData.isAdmin">
    <div class="logo">
      <img src="../../assets/tkdog.png" width="50" />
      <div class="title">
        <span>题库狗</span>
      </div>
    </div>
    <el-menu :default-active="activeIndex" class="nav" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="toHome">
        <el-icon>
          <HomeFilled />
        </el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="2" @click="toSubject">
        <el-icon>
          <Notebook />
        </el-icon>
        <span>题目</span>
      </el-menu-item>
      <el-menu-item index="3" @click="toTest">
        <el-icon>
          <List />
        </el-icon>
        <span>试卷</span>
      </el-menu-item>
      <el-menu-item index="4" @click="toUser">
        <el-icon>
          <User />
        </el-icon>
        <span>用户</span>
      </el-menu-item>
    </el-menu>
    <!-- <el-input placeholder="请输入搜索的内容" size="large" class="search">
      <template #append>
        <el-button :icon="Search" size="large" />
      </template>
    </el-input> -->
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
    <UploadQuestion v-model:dialogVisible="dialogVisible" />
  </div>
  <div class="nav-container" v-else>
    <div class="logo">
      <img src="../../assets/tkdog.png" width="50" />
      <div class="title">
        <span>题库狗</span>
      </div>
    </div>
    <el-menu :default-active="activeIndex" class="nav" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="toHomeAdmin">
        <el-icon>
          <HomeFilled />
        </el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="2" @click="toSubjectAdmin">
        <el-icon>
          <Notebook />
        </el-icon>
        <span>题目管理</span>
      </el-menu-item>
      <el-menu-item index="3" @click="toTestAdmin">
        <el-icon>
          <List />
        </el-icon>
        <span>试卷管理</span>
      </el-menu-item>
      <el-menu-item index="4" @click="toUserAdmin">
        <el-icon>
          <User />
        </el-icon>
        <span>用户管理</span>
      </el-menu-item>
    </el-menu>
    <!-- <el-input placeholder="请输入搜索的内容" size="large" class="search">
      <template #append>
        <el-button :icon="Search" size="large" />
      </template>
    </el-input> -->
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
    <UploadQuestion v-model:dialogVisible="dialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import router from '../../router';
import { useStore } from 'vuex';
import UploadQuestion from '../UploadQuestion/index.vue';
import { max } from 'lodash';
const dialogVisible = ref(false);
const store = useStore();

const activeIndex = ref(store.state.activeMenuIndex ?? '1');
// 监听路由变化
watchEffect(() => {
  const path = router.currentRoute.value.path;
  switch (path) {
    case '/':
      activeIndex.value = '1';
      break;
    case '/questionPage':
      activeIndex.value = '2';
      break;
    case '/testPaper':
      activeIndex.value = '3';
      break;
    case '/user':
      activeIndex.value = '4';
      break;
    default:
      activeIndex.value = '1';
      break;
  }
});
const handleSelect = (key: string) => {
  store.commit('setActiveMenuIndex', key);
};

const toHome = () => {
  router.push({
    path: '/',
  });
};
const toSubject = () => {
  router.push({
    path: '/questionPage',
  });
};
const toTest = () => {
  router.push({
    path: '/testPaper',
  });
};
const toUser = () => {
  router.push({
    path: '/user',
  });
};
const toaddSuject = () => {
  dialogVisible.value = true;
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
  store.commit('setUserData', {});
  router.go(-max);
};

//管理员
const toHomeAdmin = () => {
  router.push({
    path: '/adminHome',
  });
};
const toSubjectAdmin = () => {
  router.push({
    path: '/adminQuestion',
  });
};
const toTestAdmin = () => {
  router.push({
    path: '/adminTestPaper',
  });
};
const toUserAdmin = () => {
  router.push({
    path: '/adminUser',
  });
};
</script>
<style scoped>
.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-left: 10px;
  white-space: nowrap;
}

.nav {
  border: none !important;
  width: 100%;
  margin-left: 60px;
}

.search {
  width: 600px;
  margin-right: 20px;
}

.left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload {
  margin-right: 20px;
}
</style>
