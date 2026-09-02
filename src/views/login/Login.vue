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
        <el-row :gutter="10">
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
          <el-col :span="8">
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="captcha-img"
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
          <el-button type="primary" class="login-btn" @click="toLogin"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button class="register-btn" @click="toRegister">注册</el-button>
        </el-form-item>
        <el-form-item>
          <div class="forgot-row">
            <el-link type="primary" @click="openForgot">忘记密码？</el-link>
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
        <el-form-item label="验证码">
          <el-row :gutter="8">
            <el-col :span="14">
              <el-input v-model="forgotForm.code" placeholder="请输入验证码" />
            </el-col>
            <el-col :span="10">
              <!-- eslint-disable vue/no-v-html -->
              <div
                style="cursor: pointer"
                @click="changeForgotCaptcha"
                v-html="forgotCaptcha"
              ></div>
              <!-- eslint-enable vue/no-v-html -->
            </el-col>
          </el-row>
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
const store = useStore();

// 表单的ref
const ruleFormRef = ref<FormInstance>();
// 子组件的ref
const registerRef = ref<InstanceType<typeof Register>>();
// 路由对象
const router = useRouter();

const loginCaptcha = ref<string>('');
const forgotCaptcha = ref<string>('');
// 忘记密码
const forgotVisible = ref(false);
const forgotForm = reactive({
  phone: '',
  password: '',
  code: '',
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
  if (!forgotForm.code) {
    ElMessage.error('请输入验证码');
    return;
  }
  // 验证码随请求提交，由服务端校验
  await resetPassword({
    phone: forgotForm.phone,
    password: forgotForm.password,
    code: forgotForm.code,
  });
  ElMessage.success('密码重置成功，请重新登录');
  forgotVisible.value = false;
  forgotForm.phone = '';
  forgotForm.password = '';
  forgotForm.code = '';
};

//传验证参
const params: ICaptcha = {
  width: 120,
  height: 36,
};
// 获取验证码（答案由服务端校验，前端只展示图片）
const Captcha = async () => {
  const res = await getCaptcha(params);
  loginCaptcha.value = res.data;
};
Captcha();

const changeLoginCaptcha = async () => {
  const res = await getCaptcha(params);
  loginCaptcha.value = res.data;
};
const changeForgotCaptcha = async () => {
  const res = await getCaptcha(params);
  forgotCaptcha.value = res.data;
};
const openForgot = () => {
  forgotVisible.value = true;
  changeForgotCaptcha();
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

// 登录（验证码由服务端校验，前端不再做 md5 对比）
const toLogin = async () => {
  const form = unref(ruleFormRef);

  if (!form) return;
  try {
    if (!ruleForm.checked) {
      ElMessage.error('请勾选用户协议');
      return;
    }
    await form.validate();
    const data = await login(ruleForm);
    // 后端返回完整用户信息（含本人手机号），直接写入登录态
    store.commit('setUserData', data);
    ElMessage.success({
      message: '登录成功~',
      type: 'success',
    });
    localStorage.setItem('uid', ruleForm.phone);
    router.push('/');
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
  /* fixed 四边拉伸铺满完整视口（含滚动槽），避免 scrollbar-gutter 下右侧露出空隙 */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: 100% 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  background: url(../../assets/bg.jpg) no-repeat;
  background-size: 100% 100%;
}
.logo {
  width: 35px;
  height: 35px;
  margin-right: 10px;
}

.title-box {
  display: flex;
  align-items: center;
}

.title {
  font-size: 24px;
  margin-right: 14px;
  font-weight: 600;
  color: #303133;
}

.line {
  width: 1px;
  background-color: #dcdfe6;
  height: 24px;
  margin-right: 12px;
}

.sub-title {
  font-size: 20px;
  color: #606266;
}

.loginBox {
  padding: 36px 36px 20px 36px;
  width: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}

.login-form {
  margin-top: 24px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 15px;
  font-weight: 500;
}

.register-btn {
  width: 100%;
  height: 40px;
  font-size: 15px;
}

.captcha-img {
  cursor: pointer;
  min-width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  overflow: hidden;
}

.captcha-img :deep(img),
.captcha-img :deep(svg) {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  flex-wrap: wrap;
}
.agreement-sep {
  color: #909399;
}

.right {
  flex-shrink: 0;
}

.right img {
  max-width: 500px;
  height: auto;
}

@media (max-width: 900px) {
  .login-container {
    gap: 0;
  }
  .right {
    display: none;
  }
  .loginBox {
    width: 90%;
    max-width: 400px;
  }
}
</style>
