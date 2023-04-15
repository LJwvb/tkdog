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
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        class="login-form"
      >
        <el-form-item prop="phone">
          <el-input
            prefix-icon="user"
            placeholder="请输入手机号"
            v-model="ruleForm.phone"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="lock"
            placeholder="请输入密码"
            v-model="ruleForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item prop="code">
              <el-input
                prefix-icon="key"
                placeholder="请输入验证码"
                v-model="ruleForm.code"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <div
              style="cursor: pointer"
              v-html="loginCaptcha"
              @click="changeLoginCaptcha"
            ></div>
          </el-col>
        </el-row>
        <el-form-item prop="checked">
          <el-checkbox v-model="ruleForm.checked" label="0"
            >我已阅读并同意</el-checkbox
          ><el-link
            type="primary"
            target="__blank"
            href="https://in.m.jd.com/help/app/register_info.html"
            >用户协议</el-link
          >和<el-link type="primary">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="toLogin"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toRegister" style="width: 100%"
            >注册</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="toAdmin" style="width: 100%"
            >管理员登录</el-button
          >
        </el-form-item> -->
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt="" />
    </div>
    <!-- 注册子组件 -->
    <register ref="registerRef"></register>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, unref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { login, getCaptcha } from '@/services';
import { ElMessage } from 'element-plus';
import type { ICaptcha } from '@/types';
import Register from '@/views/login/register.vue';
import md5 from 'md5';
const store = useStore();

// 表单的ref
const ruleFormRef = ref();
// 子组件的ref
const registerRef: any = ref(null);
// 路由对象
const router = useRouter();

const loginCaptcha = ref();
const CaptchaPassword = ref();

//传验证参
const params: ICaptcha = {
  width: 120,
  height: 30,
};
// 获取验证码列表
const Captcha = async () => {
  const res = await getCaptcha(params);
  loginCaptcha.value = res.data.data;
  CaptchaPassword.value = res.data.text;
};
Captcha();

const changeLoginCaptcha = async () => {
  const res = await getCaptcha(params);
  loginCaptcha.value = res.data.data;
  CaptchaPassword.value = res.data.text;
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
      validator: (rule: Function, value: string, callback: Function) => {
        // rule 规则，没什么价值
        // value 就是输入或是选择的值
        // callback 决定校验是成功还是失败，如果失败了 callback(new Error('提示信息'))，如果成功了则直接调用callback
        // 注意：无论成功与否，都要调用callback，否则下一个异步操作无法执行
        if (!value) {
          // 这个return 就是阻断代码执行
          return callback(new Error('手机号不能为空'));
        }

        const reg = /^1[3456789][0-9]{9}$/;
        if (!reg.test(value)) {
          return callback(new Error('手机号不合法'));
        }

        // 可定校验通过的
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
  // checked: [
  //   {
  //     validator: (rule: Function, value: string, callback: Function) => {
  //       value ? callback() : callback(new Error('必须勾选用户协议'));
  //     },
  //     trigger: 'change',
  //   },
  // ],
});
// const onClickLeft(){
//   router.go("-1");
// }
// 登录
const toLogin = async () => {
  const form: any = unref(ruleFormRef);

  if (!form) return;
  console.log(ruleForm);
  try {
    if (md5(ruleForm.code) === CaptchaPassword.value) {
      if (ruleForm.checked) {
        login(ruleForm).then(async (res) => {
          form.validate();

          if (res.code === 200) {
            store.commit('setUserData', { ...res.data, phone: ruleForm.phone });
            ElMessage.success({
              message: '登录成功~',
              type: 'success',
            });
            localStorage.setItem('uid', ruleForm.phone);
            router.push('/');
          } else {
            ElMessage.error(res.message);
            changeLoginCaptcha();
          }
        });
      } else {
        ElMessage.error('请勾选');
      }
    } else {
      ElMessage.error('验证码错误');
      changeLoginCaptcha();
    }
  } catch (error) {
    console.log('error is ', error);
    // 刷新验证码
    changeLoginCaptcha();
  }
};

// 弹出注册子组件
const toRegister = () => {
  registerRef.value.dialogVisible = true;
};

const toAdmin = () => {
  router.push({
    path: '/admin',
  });
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
</style>
