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
          <el-input prefix-icon="user" placeholder="请输入账号" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="lock" placeholder="请输入密码" v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="toLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, unref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { adminLogin } from '@/services';
import { ElMessage } from 'element-plus';
const store = useStore();

// 表单的ref
const ruleFormRef = ref();

// 路由对象
const router = useRouter();

const ruleForm = reactive({
  name: '', // 账号
  password: '', // 密码
});

// 校验规则
const rules = ref({
  name: [
    {
      validator: (rule: Function, value: string, callback: Function) => {
        // rule 规则，没什么价值
        // value 就是输入或是选择的值
        // callback 决定校验是成功还是失败，如果失败了 callback(new Error('提示信息'))，如果成功了则直接调用callback
        // 注意：无论成功与否，都要调用callback，否则下一个异步操作无法执行
        if (!value) {
          // 这个return 就是阻断代码执行
          return callback(new Error('账号不能为空'));
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
    adminLogin(ruleForm).then(async (res) => {
      console.log(res);
      form.validate();

      if (res.code === 200) {
        store.commit('setUserData', {
          ...res.data,
          phone: 'admin',
        });
        ElMessage.success({
          message: '登录成功~',
          type: 'success',
        });
        localStorage.setItem('uid', ruleForm.name);
        router.push('/adminPage');
      } else {
        ElMessage.error(res.message);
      }
    });
  } catch (error) {
    console.log('error is ', error);
  }
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

.loginBox {
  padding: 35px 35px 15px 35px;
  width: 350px;
  background: #f5f5f5;
}

.login-form {
  margin-top: 29px;
}
</style>
