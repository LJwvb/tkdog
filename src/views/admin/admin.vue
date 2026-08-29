<template>
  <div class="login-container">
    <div class="loginBox">
      <div class="title-box">
        <img src="@/assets/tkdog.png" alt="" />
        <span class="title">题库狗</span>
        <span class="line"></span>
        <span class="sub-title">管理员登录</span>
      </div>

      <!--
        model：模型值，它里面的属性值要跟后台一致，因为要提交给后台
        rules：校验规则
        ref：将来获取表单实例
       -->
      <el-form ref="ruleFormRef" class="login-form">
        <!-- prop要跟model中的属性和rules中的属性，保持一致 -->
        <el-form-item prop="name">
          <el-input
            v-model="ruleForm.name"
            prefix-icon="user"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            prefix-icon="lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="toLogin"
            >登录</el-button
          >
        </el-form-item>
        <el-button
          type="primary"
          style="width: 100%; margin-bottom: 10px"
          @click="toPersonLogin"
          >去个人登录</el-button
        >
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, unref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { adminLogin } from '@/services';
import { ElMessage, type FormInstance } from 'element-plus';

const store = useStore();

// 表单的ref
const ruleFormRef = ref<FormInstance>();

// 路由对象
const router = useRouter();

const ruleForm = reactive({
  name: '', // 账号
  password: '', // 密码
});

// 登录
const toLogin = async () => {
  const form = unref(ruleFormRef);
  if (!form) return;

  try {
    // 先校验表单，通过后再发请求（避免空表单也发出请求）
    await form.validate();
    const result = await adminLogin(ruleForm);

    store.commit('setUserData', {
      ...result,
      phone: 'admin',
      username: result?.name ?? 'admin',
      isAdmin: true,
    });
    store.commit('setBrowseTopicsId', []);
    ElMessage.success({
      message: '登录成功~',
      type: 'success',
    });
    localStorage.setItem('uid', String(ruleForm.name));
    router.push('/adminHome');
  } catch (error) {
    ElMessage.error('登录失败，请稍后重试');
    // eslint-disable-next-line no-console
    console.error('Admin login error:', error);
  }
};
const toPersonLogin = () => {
  router.push('/');
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;

  display: flex;
  align-items: center;
  justify-content: space-around;
  /* background: linear-gradient(225deg, #1493fa, #01c6fa); */
  background: url(../../assets/bg.jpg) no-repeat;
  background-size: 100% 100%;
}

.left {
  width: 478px;
  height: 550px;
  background: #f5f5f5;
  padding: 48px;
}

.title-box {
  display: flex;
  align-items: center;
}

.title-box img {
  width: 35px;
  height: 35px;
  margin-right: 10px;
}

.title {
  font-size: 24px;
  margin-right: 14px;
}

.line {
  width: 1px;
  background-color: #c7c7c7;
  height: 27px;
  margin-right: 12px;
}

.sub-title {
  font-size: 22px;
}

.loginBox {
  padding: 35px 35px 15px 35px;
  background: #f5f5f5;
}

.login-form {
  margin-top: 29px;
}
</style>
