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
    <div class="left">
      <el-button type="primary" class="upload" @click="toAddSubject">
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
    <el-dialog v-model="dialogVisibleEditPassword" title="修改密码" width="400px" center>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" status-icon>
        <el-form-item prop="password" placeholder="请输入密码">
          <el-input v-model="ruleForm.password" placeholder="请输入长度在 6 到 20 个字符的密码" />
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
      <el-button type="primary" class="upload" @click="toAddSubject">
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
import { ref, watchEffect, reactive } from 'vue';
import router from '../../router';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { editUserInfo } from '@/services';
import UploadQuestion from '@/components/UploadQuestion/index.vue';
import { max } from 'lodash';

const dialogVisible = ref(false);
const dialogVisibleEditPassword = ref(false);
const store = useStore();
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
  alert(111111)
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
  await formEl.validate((valid, fields) => {
    console.log(valid, fields);
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
        router.push({
          path: '/Login',
        });
      });
    } else {
      return false;
    }
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
