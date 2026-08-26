<template>
  <div>
    <el-dialog v-model="dialogVisible" title="用户注册" width="600px" center>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="昵称" prop="username">
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入用户名"
            @focus="focusInput"
            @blur="blurInput"
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
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRegister">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { ElMessage, ElNotification, type FormInstance } from 'element-plus';
import { register, getCaptcha } from '@/services';
import md5 from 'md5';
import type { ICaptcha } from '@/types';

// 表单的ref
const ruleFormRef = ref<FormInstance>();
// 对话框显示隐藏
const dialogVisible = ref(false);

const registerCaptcha = ref<string>('');
const CaptchaAnswer = ref<string>('');

// 传验证参
const params: ICaptcha = {
  width: 150,
  height: 30,
};

// 获取验证码列表
const Captcha = async () => {
  const res = await getCaptcha(params);
  registerCaptcha.value = res.data;
  CaptchaAnswer.value = res.text;
};

const focusInput = () => {
  ElNotification({
    title: '提示',
    message: '用户名不可修改，请谨慎输入',
    type: 'warning',
    duration: 0,
  });
};
const blurInput = () => {
  ElNotification.closeAll();
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
      max: 16,
      message: '密码长度必须是6-16位之间',
      trigger: 'blur',
    },
  ],
  code: [{ required: true, message: '图形码不能为空', trigger: 'blur' }],
};

// 注册
const handleRegister = async () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    if (md5(ruleForm.code) !== CaptchaAnswer.value) {
      ElMessage.error('验证码错误');
      return;
    }

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

<style scoped>
.avatar-uploader {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
