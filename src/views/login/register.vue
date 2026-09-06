<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="register-dialog"
      width="560px"
      align-center
    >
      <template #header>
        <div class="reg-header">
          <h3 class="reg-title">注册账号</h3>
          <p class="reg-sub">加入题库狗，开启高效刷题之旅</p>
        </div>
      </template>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="70px"
        label-position="left"
      >
        <el-form-item label="昵称" prop="username">
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="1"> 男 </el-radio>
            <el-radio label="0"> 女 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item label="图形码" prop="code">
              <el-input v-model="ruleForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" style="margin-left: 10px">
            <!-- eslint-disable vue/no-v-html -->
            <div
              style="cursor: pointer"
              @click="Captcha"
              v-html="registerCaptcha"
            ></div>
            <!-- eslint-enable vue/no-v-html -->
          </el-col>
        </el-row>
        <el-form-item prop="checked">
          <div class="agreement-row">
            <el-checkbox v-model="ruleForm.checked" label="0"
              >我已阅读并同意</el-checkbox
            >
            <el-link type="primary" @click="openAgreement('user')"
              >《用户协议》</el-link
            >
            <span class="agreement-sep">和</span>
            <el-link type="primary" @click="openAgreement('privacy')"
              >《隐私政策》</el-link
            >
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button class="reg-cancel" @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button class="reg-submit" @click="handleRegister">注 册</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { register, getCaptcha } from '@/services';
import type { ICaptcha } from '@/types';

// 表单的ref
const ruleFormRef = ref<FormInstance>();
// 对话框显示隐藏
const dialogVisible = ref(false);

const registerCaptcha = ref<string>('');

// 传验证参
const params: ICaptcha = {
  width: 150,
  height: 30,
};

// 获取验证码（答案由服务端校验，前端只展示图片）
const Captcha = async () => {
  const res = await getCaptcha(params);
  registerCaptcha.value = res.data;
};

// 模型
const ruleForm = reactive({
  avatar: '', // 头像的地址
  username: '', // 用户昵称
  email: '', // 邮箱
  phone: '', // 手机
  password: '', // 密码
  sex: '', //性别
  code: '', // 图形码
  checked: '', // 是否同意用户协议
});

// 校验规则
const rules = {
  sex: [{ required: true, message: '性别不能为空', trigger: 'change' }],
  username: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  email: [
    {
      required: true,
      validator: (
        _rule: unknown,
        value: string,
        callback: (error?: Error) => void,
      ) => {
        if (!value) return callback(new Error('邮箱不能为空'));
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!reg.test(value)) return callback(new Error('邮箱不合法'));
        callback();
      },
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      validator: (
        _rule: unknown,
        value: string,
        callback: (error?: Error) => void,
      ) => {
        if (!value) return callback(new Error('手机号不能为空'));
        const reg = /^1[3456789][0-9]{9}$/;
        if (!reg.test(value)) return callback(new Error('手机号不合法'));
        callback();
      },
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '密码长度必须是6-20位之间',
      trigger: 'blur',
    },
  ],
  code: [{ required: true, message: '图形码不能为空', trigger: 'blur' }],
  checked: [
    {
      required: true,
      message: '请先阅读并同意用户协议和隐私政策',
      trigger: 'change',
    },
  ],
};

// 打开用户协议/隐私政策（优先新窗口；被拦截时当前页跳转兜底）
const openAgreement = (type: 'user' | 'privacy') => {
  const base =
    window.location.origin + window.location.pathname + window.location.search;
  const hash = type === 'privacy' ? '#/privacy' : '#/agreement';
  const win = window.open(base + hash, '_blank');
  if (!win) {
    // 当前页跳转兜底（协议页返回按钮会回到上一页）
    window.location.hash = hash;
  }
};

// 注册（验证码随请求提交，由服务端校验）
const handleRegister = async () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    await register(ruleForm);
    ElMessage.success({
      message: '注册成功~',
      type: 'success',
    });
    dialogVisible.value = false;
  });
};

watch(dialogVisible, (newValue) => {
  if (newValue) {
    // 打开注册弹窗时才获取验证码，避免登录页加载时多请求一次
    Captcha();
  } else {
    ruleFormRef.value?.resetFields();
  }
});

// <script setup> 默认不对外暴露内部状态，父组件需要通过 ref 控制弹窗显隐
defineExpose({ dialogVisible });
</script>

<style>
/* ===== 玻璃拟态注册弹窗（teleport 到 body，使用全局样式） ===== */
.register-dialog {
  background: rgba(13, 27, 45, 0.82);
  backdrop-filter: blur(26px) saturate(150%);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
  border: 1px solid rgba(140, 200, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 28px 70px rgba(0, 8, 20, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.register-dialog .el-dialog__header {
  padding: 26px 28px 0;
  border-bottom: none;
}
.register-dialog .el-dialog__body {
  padding: 20px 28px 8px;
}
.register-dialog .el-dialog__footer {
  padding: 8px 28px 26px;
}
.register-dialog .el-dialog__headerbtn .el-dialog__close {
  color: rgba(190, 220, 250, 0.6);
}
.register-dialog .el-dialog__headerbtn:hover .el-dialog__close {
  color: #fff;
}

.reg-header {
  text-align: center;
}
.reg-title {
  font-size: 24px;
  font-weight: 700;
  color: #f0f8ff;
  letter-spacing: 3px;
  margin: 0 0 4px;
}
.reg-sub {
  font-size: 13px;
  color: rgba(190, 220, 250, 0.6);
  margin: 0;
}

/* 表单适配深色玻璃 */
.register-dialog .el-form-item__label {
  color: rgba(200, 225, 250, 0.85);
  font-size: 14px;
}
.register-dialog .el-input__wrapper {
  background-color: #162236 !important;
  background: #162236 !important;
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgba(140, 200, 255, 0.18) inset;
  transition: all 0.3s ease;
}
.register-dialog .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px rgba(0, 190, 255, 0.4) inset;
  background-color: #1a2638 !important;
}
.register-dialog .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1.5px rgba(0, 190, 255, 0.75) inset,
    0 0 16px rgba(0, 170, 255, 0.15);
  background-color: #1c2a40 !important;
}
.register-dialog .el-input__wrapper.is-error {
  background-color: #162236 !important;
  box-shadow: 0 0 0 1px rgba(255, 80, 80, 0.5) inset;
}
.register-dialog .el-input__inner {
  color: #eaf6ff !important;
  -webkit-text-fill-color: #eaf6ff !important;
}
.register-dialog .el-input__inner::placeholder {
  color: rgba(180, 210, 240, 0.45) !important;
}
/* 浏览器自动填充（autofill）覆盖 */
.register-dialog input:-webkit-autofill,
.register-dialog input:-internal-autofill-selected {
  -webkit-box-shadow: 0 0 0 1000px #162236 inset !important;
  box-shadow: 0 0 0 1000px #162236 inset !important;
  -webkit-text-fill-color: #eaf6ff !important;
  caret-color: #eaf6ff !important;
  transition: background-color 5000s ease-in-out 0s !important;
}
.register-dialog input:-webkit-autofill:hover,
.register-dialog input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #1c2a40 inset !important;
  box-shadow: 0 0 0 1000px #1c2a40 inset !important;
  -webkit-text-fill-color: #eaf6ff !important;
}
.register-dialog .el-radio__label {
  color: rgba(200, 225, 250, 0.85);
}
.register-dialog .el-radio__inner {
  background: transparent;
  border-color: rgba(140, 200, 255, 0.4);
}
.register-dialog .el-radio.is-checked .el-radio__inner {
  background: #00a6ff;
  border-color: #00a6ff;
}

/* 协议行 */
.register-dialog .agreement-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  flex-wrap: wrap;
  color: rgba(200, 225, 250, 0.75);
}
.register-dialog .agreement-sep {
  color: rgba(190, 220, 250, 0.5);
}
.register-dialog .agreement-row .el-checkbox__label {
  color: rgba(200, 225, 250, 0.75);
  font-size: 13px;
}
.register-dialog .agreement-row .el-checkbox__inner {
  background: transparent;
  border-color: rgba(140, 200, 255, 0.4);
}
.register-dialog .agreement-row .el-checkbox.is-checked .el-checkbox__inner {
  background: #00a6ff;
  border-color: #00a6ff;
}
.register-dialog .agreement-row .el-link {
  font-size: 13px;
  --el-link-primary-text-color: #4fc3ff;
}

/* 按钮 */
.reg-cancel {
  border-radius: 10px;
  color: rgba(220, 240, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(140, 200, 255, 0.25);
  transition: all 0.3s ease;
}
.reg-cancel:hover {
  border-color: rgba(0, 190, 255, 0.6);
  background: rgba(0, 170, 255, 0.12);
  color: #fff;
}
.reg-submit {
  border: none;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 4px;
  background: linear-gradient(120deg, #00c6ff, #0072ff, #00c6ff);
  background-size: 200% 100%;
  box-shadow: 0 8px 22px rgba(0, 120, 255, 0.35);
  transition: all 0.35s ease;
}
.reg-submit:hover {
  background-position: 100% 0;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 140, 255, 0.5);
}
</style>
