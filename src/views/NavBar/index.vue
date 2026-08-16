<template>
  <div v-if="!store.state.userData.isAdmin" class="nav-container">
    <div class="logo">
      <img src="../../assets/tkdog.png" width="50" />
      <div class="title">
        <span>题库狗</span>
      </div>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="nav"
      mode="horizontal"
      @select="handleSelect"
    >
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
    <div class="left">
      <el-button circle @click="toggleTheme">
        <el-icon>
          <Moon v-if="!isDark" />
          <Sunny v-else />
        </el-icon>
      </el-button>
      <el-badge
        :value="unreadCount"
        :hidden="unreadCount === 0"
        :max="99"
        class="msg-badge"
      >
        <el-button circle @click="toMessage">
          <el-icon><Bell /></el-icon>
        </el-button>
      </el-badge>
      <el-button type="primary" class="upload" @click="toAddSubject">
        上传
      </el-button>
      <el-dropdown>
        <el-avatar
          :size="50"
          :src="store.state.userData?.avatar"
          style="width: 50px; height: 50px"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toInfo">
              <el-icon>
                <Avatar />
              </el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item @click="editPassword">
              <el-icon>
                <Edit />
              </el-icon>
              修改密码
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
    <el-dialog
      v-model="dialogVisibleEditPassword"
      title="修改密码"
      width="400px"
      center
    >
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" status-icon>
        <el-form-item prop="password" placeholder="请输入密码">
          <el-input
            v-model="ruleForm.password"
            placeholder="请输入长度在 6 到 20 个字符的密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <div v-else-if="store.state.userData.isAdmin" class="nav-container">
    <div class="logo">
      <img src="../../assets/tkdog.png" width="50" />
      <div class="title">
        <span>题库狗后台管理</span>
      </div>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="nav"
      mode="horizontal"
      @select="handleSelect"
    >
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
      <el-menu-item index="5" @click="toCommentAdmin">
        <el-icon><ChatLineSquare /></el-icon>
        <span>评论管理</span>
      </el-menu-item>
      <el-menu-item index="6" @click="toSensitiveWord">
        <el-icon><Warning /></el-icon>
        <span>违禁词管理</span>
      </el-menu-item>
      <el-menu-item index="7" @click="toFeedback">
        <el-icon><ChatDotRound /></el-icon>
        <span>纠错反馈</span>
        <el-badge
          v-if="feedbackCount > 0"
          :value="feedbackCount"
          :max="99"
          class="menu-badge"
        />
      </el-menu-item>
      <el-menu-item index="8" @click="toAnnouncement">
        <el-icon><Bell /></el-icon>
        <span>公告管理</span>
      </el-menu-item>
      <el-menu-item index="9" @click="toReview">
        <el-icon><View /></el-icon>
        <span>主观题复核</span>
      </el-menu-item>
      <el-menu-item index="10" @click="toTag">
        <el-icon><Collection /></el-icon>
        <span>标签管理</span>
      </el-menu-item>
    </el-menu>
    <!-- <el-input placeholder="请输入搜索的内容" size="large" class="search">
      <template #append>
        <el-button :icon="Search" size="large" />
      </template>
    </el-input> -->
    <div class="left">
      <el-button type="primary" class="upload" @click="toAddSubject">
        上传
      </el-button>
      <el-dropdown>
        <span>
          <el-avatar
            :size="50"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
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
  <div v-else></div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, reactive, onMounted } from 'vue';
import router from '../../router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import {
  editUserInfo,
  logout,
  getUnreadCount,
  getUnresolvedFeedbackCount,
} from '@/services';
import UploadQuestion from '@/components/UploadQuestion/index.vue';
import {
  HomeFilled,
  Notebook,
  List,
  User,
  Avatar,
  Edit,
  SwitchButton,
  ChatLineSquare,
  Bell,
  Warning,
  ChatDotRound,
  Moon,
  Sunny,
  View,
  Collection,
} from '@element-plus/icons-vue';

const dialogVisible = ref(false);
const dialogVisibleEditPassword = ref(false);
const store = useStore();
// 暗色模式切换
const isDark = ref(document.documentElement.classList.contains('dark'));
const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};
// 未读数放入 store，UserMessage 标记已读后实时同步到角标
const unreadCount = computed(() => store.state.unreadCount);
const feedbackCount = ref(0);

const loadUnread = async () => {
  if (store.state.userData.isAdmin) return;
  try {
    const res = await getUnreadCount();
    store.commit('setUnreadCount', res?.count ?? 0);
  } catch {
    // 忽略未读角标拉取失败
  }
};
const loadFeedbackCount = async () => {
  if (!store.state.userData.isAdmin) return;
  try {
    const res = await getUnresolvedFeedbackCount();
    feedbackCount.value = res?.count ?? 0;
  } catch {
    // 忽略
  }
};
const toMessage = () => {
  store.commit('setActiveMenuIndex', '4');
  router.push({ path: '/user/UserMessage' });
};
onMounted(() => {
  loadUnread();
  loadFeedbackCount();
});
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  password: '',
});
const rules = reactive<FormRules>({
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur',
    },
  ],
});

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
      activeIndex.value = store.state.activeMenuIndex ?? '1';
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
const toAddSubject = () => {
  dialogVisible.value = true;
};
const toInfo = () => {
  store.commit('setActiveMenuIndex', '4');
  router.push({
    path: '/user',
  });
};

const editPassword = () => {
  dialogVisibleEditPassword.value = true;
};
const cancel = () => {
  dialogVisibleEditPassword.value = false;
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      const params = {
        password: ruleForm.password,
        phone: store.state.userData.phone,
      };
      editUserInfo(params).then(() => {
        ElMessage({
          type: 'success',
          message: `修改成功,需要重新登录`,
        });
        store.commit('setUserData', {});

        dialogVisibleEditPassword.value = false;
        resetForm(formEl);
        router.go(-router.currentRoute.value.meta.index!);
      });
    } else {
      return;
    }
  });
};
const toLogin = () => {
  // 清除后端 session，防止退出后 session 残留
  logout();
  // 回退到最初的路由
  if (store.state.userData.isAdmin) {
    router
      .push({
        path: '/admin',
      })
      .finally(() => {
        window.location.reload();
      });
  } else {
    router.go(-router.currentRoute.value.meta.index!);
  }
  store.commit('setUserData', {});
  store.commit('setActiveMenuIndex', '1');
  store.commit('setBrowseTopicsId', []);
  store.commit('addSelectedTopic', []);
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
const toCommentAdmin = () => {
  router.push({
    path: '/adminComment',
  });
};
const toSensitiveWord = () => {
  router.push({
    path: '/adminSensitiveWord',
  });
};
const toFeedback = () => {
  router.push({
    path: '/adminFeedback',
  });
};
const toAnnouncement = () => {
  router.push({
    path: '/adminAnnouncement',
  });
};
const toReview = () => {
  router.push({
    path: '/adminReview',
  });
};
const toTag = () => {
  router.push({
    path: '/adminTag',
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
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%);
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
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

.msg-badge {
  margin-right: 16px;
}

/* 移动端导航栏精简 */
@media (width <= 768px) {
  .nav-container {
    flex-wrap: nowrap;
  }

  .logo img {
    width: 34px;
  }

  .title {
    font-size: 15px;
  }

  .nav {
    margin-left: 8px;
    min-width: 0;
  }

  .nav :deep(.el-menu-item) {
    padding: 0 12px;
  }

  .left {
    margin-left: auto;
    flex-shrink: 0;
  }

  .upload {
    margin-right: 8px;
    padding: 8px 12px;
  }

  .msg-badge {
    margin-right: 8px;
  }
}

.menu-badge {
  margin-left: 6px;
}
</style>
