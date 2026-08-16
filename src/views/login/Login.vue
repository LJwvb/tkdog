<template>
  <div class="login-container">
    <div class="loginBox">
      <div class="title-box">
        <img src="@/assets/tkdog.png" alt="" class="logo" />
        <span class="title">题库狗</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="phone">
          <el-input
            v-model="ruleForm.phone"
            prefix-icon="user"
            placeholder="请输入手机号"
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
        <el-row>
          <el-col :span="16">
            <el-form-item prop="code">
              <el-input
                v-model="ruleForm.code"
                prefix-icon="key"
                placeholder="请输入验证码"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <!-- eslint-disable vue/no-v-html -->
            <div
              style="cursor: pointer; min-width: 120px"
              @click="changeLoginCaptcha"
              v-html="loginCaptcha"
            ></div>
            <!-- eslint-enable vue/no-v-html -->
          </el-col>
        </el-row>
        <el-form-item prop="checked">
          <div class="agreement-row">
            <el-checkbox v-model="ruleForm.checked" label="0"
              >我已阅读并同意</el-checkbox
            >
            <el-link type="primary" target="__blank">用户协议</el-link>
            <span class="agreement-sep">和</span>
            <el-link type="primary">隐私条款</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="toLogin"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="toRegister"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item>
          <div class="forgot-row">
            <el-link type="primary" @click="forgotVisible = true"
              >忘记密码？</el-link
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt="" />
    </div>
    <!-- 注册子组件 -->
    <register ref="registerRef"></register>
    <!-- 忘记密码弹窗 -->
    <el-dialog v-model="forgotVisible" title="重置密码" width="420px">
      <el-form label-width="80px">
        <el-form-item label="手机号">
          <el-input
            v-model="forgotForm.phone"
            placeholder="请输入注册时的手机号"
          />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            v-model="forgotForm.password"
            type="password"
            show-password
            placeholder="请输入 6-16 位新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="forgotVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForgot">确认重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, unref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { login, getCaptcha, resetPassword } from '@/services';
import { ElMessage, type FormInstance } from 'element-plus';
import type { ICaptcha } from '@/types';
import Register from '@/views/login/register.vue';
import md5 from 'md5';
const store = useStore();

// 表单的ref
const ruleFormRef = ref<FormInstance>();
// 子组件的ref
const registerRef = ref<InstanceType<typeof Register>>();
// 路由对象
const router = useRouter();

const loginCaptcha = ref<string>('');
const CaptchaPassword = ref<string>('');
// 忘记密码
const forgotVisible = ref(false);
const forgotForm = reactive({
  phone: '',
  password: '',
});
const submitForgot = async () => {
  const reg = /^1[3456789][0-9]{9}$/;
  if (!reg.test(forgotForm.phone)) {
    ElMessage.error('手机号不合法');
    return;
  }
  if (forgotForm.password.length < 6 || forgotForm.password.length > 16) {
    ElMessage.error('密码长度需在6-16位之间');
    return;
  }
  await resetPassword({
    phone: forgotForm.phone,
    password: forgotForm.password,
  });
  ElMessage.success('密码重置成功，请重新登录');
  forgotVisible.value = false;
  forgotForm.phone = '';
  forgotForm.password = '';
};

//传验证参
const params: ICaptcha = {
  width: 120,
  height: 30,
};
// 获取验证码列表
const Captcha = async () => {
  const res = await getCaptcha(params);
  loginCaptcha.value = res.data;
  CaptchaPassword.value = res.text;
};
Captcha();

const changeLoginCaptcha = async () => {
  const res = await getCaptcha(params);
  loginCaptcha.value = res.data;
  CaptchaPassword.value = res.text;
};
const ruleForm = reactive({
  phone: '', // 手机号
  password: '', // 密码
  code: '', // 验证码
  checked: '', // 是否同意用户协议
});

// 校验规则
const rules = ref({
  phone: [
    {
      validator: (
        _rule: unknown,
        value: string,
        callback: (error?: Error) => void,
      ) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }

        const reg = /^1[3456789][0-9]{9}$/;
        if (!reg.test(value)) {
          return callback(new Error('手机号不合法'));
        }

        callback();
      },
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 16, message: '密码必须在6-16位之间', trigger: 'blur' },
  ],
  code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
});

// 登录
const toLogin = async () => {
  const form = unref(ruleFormRef);

  if (!form) return;
  try {
    if (md5(ruleForm.code) === CaptchaPassword.value) {
      if (ruleForm.checked) {
        login(ruleForm).then(async (data) => {
          await form.validate();

          store.commit('setUserData', { ...data, phone: ruleForm.phone });
          ElMessage.success({
            message: '登录成功~',
            type: 'success',
          });
          localStorage.setItem('uid', ruleForm.phone);
          router.push('/');
        });
      } else {
        ElMessage.error('请勾选用户协议');
      }
    } else {
      ElMessage.error('验证码错误');
      changeLoginCaptcha();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error);
    changeLoginCaptcha();
  }
};

// 弹出注册子组件
const toRegister = () => {
  if (!registerRef.value) return;
  registerRef.value.dialogVisible = true;
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
.logo {
  width: 35px;
  height: 35px;
  margin-right: 10px;
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
  /* width: 350px; */
  background: #f5f5f5;
}

.login-form {
  margin-top: 29px;
}
.forgot-row {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
.agreement-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}
.agreement-sep {
  color: #909399;
}
</style>
