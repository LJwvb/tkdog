<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/tkdog.png" alt="" />
        <span class="title">题库狗</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <!--
        model：模型值，它里面的属性值要跟后台一致，因为要提交给后台
        rules：校验规则
        ref：将来获取表单实例
       -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        class="login-form"
      >
        <!-- prop要跟model中的属性和rules中的属性，保持一致 -->
        <el-form-item prop="phone">
          <el-input
            prefix-icon="el-icon-user"
            placeholder="请输入手机号"
            v-model="ruleForm.phone"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            v-model="ruleForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item prop="code">
              <el-input
                prefix-icon="el-icon-key"
                placeholder="请输入验证码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <img style="width: 100%; height: 40px; margin-left: 10px" alt="" />
          </el-col>
        </el-row>
        <el-form-item prop="checked">
          <el-checkbox></el-checkbox>&nbsp;我已阅读并同意<el-link
            type="primary"
            target="__blank"
            href="https://in.m.jd.com/help/app/register_info.html"
            >用户协议</el-link
          >和<el-link type="primary">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleLogin"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register" style="width: 100%"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt="" />
    </div>
    <!-- 注册子组件 -->
    <register ref="registerRef" />
  </div>
</template>

<script lang="ts">
// 参考：https://blog.csdn.net/Lschange/article/details/112373162
import { defineComponent, ref, reactive, unref } from 'vue';
import { useRouter } from 'vue-router';
// import { login } from '@/api/user'
// import { saveToken } from '@/utils/token'
import Register from './register.vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'Login',
  components: {
    Register,
  },
  // 入口方法
  setup() {
    // 表单的ref
    const ruleFormRef = ref(null);
    // 子组件的ref
    const registerRef: any = ref(null);
    // 路由对象
    const router = useRouter();

    // 登录图形码地址
    // const loginCaptchaUrl = ref(
    //   process.env.VUE_APP_BASEURL + '/captcha?type=login',
    // );

    // 模型
    const ruleForm = reactive({
      phone: '18511111111', // 手机号
      password: '12345678', // 密码
      code: '', // 验证码
      checked: true, // 是否同意用户协议
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
      checked: [
        {
          validator: (rule: Function, value: string, callback: Function) => {
            value ? callback() : callback(new Error('必须勾选用户协议'));
          },
          trigger: 'change',
        },
      ],
    });

    // const changeLoginCaptchaUrl = () => {
    //   loginCaptchaUrl.value =
    //     process.env.VUE_APP_BASEURL + `/captcha?type=login&t=${Math.random()}`;
    // };

    // 登录
    const handleLogin = async () => {
      const form: any = unref(ruleFormRef);

      if (!form) return;
    };

    // try {
    // await form.validate()

    // const res: any = await login(ruleForm)

    // if (res.code === 200) {
    //   // 提示
    //   ElMessage.success({
    //     message: '登录成功~',
    //     type: 'success'
    //   })

    // 保存token
    // saveToken(res.data.token)

    // 跳转到登录页面
    //  router.push('/layout')
    // } else {
    //   弹出提示
    //   ElMessage.error(res.message)

    // 刷新验证码
    // changeLoginCaptchaUrl();
    //     }
    //   } catch (error) {
    //     console.log('error is ', error)
    //   }
    // }

    // 弹出注册子组件
    const register = () => {
      registerRef.value.dialogVisible = true;
    };

    return {
      // 登录验证码的url
      // loginCaptchaUrl,
      ruleForm,
      rules,
      // changeLoginCaptchaUrl,
      handleLogin,
      register,
      ruleFormRef,
      registerRef,
    };
  },
});
</script>

<style scoped>
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* background: linear-gradient(225deg, #1493fa, #01c6fa); */
  background: url(../../assets/bg.jpg) no-repeat;
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
  width: 22px;
  height: 17px;
  margin-right: 16px;
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

.login-form {
  margin-top: 29px;
}
</style>
