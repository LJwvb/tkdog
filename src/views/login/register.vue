<template>
  <div>
    <el-dialog title="用户注册" v-model="dialogVisible" width="600px" center>
      <el-form :model="ruleForm" ref="ruleFormRef" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="昵称" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="0"> 男 </el-radio>
            <el-radio label="1"> 女 </el-radio>
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
            <div style="cursor: pointer" v-html="registerCaptcha" @click="changeRegisterCaptcha"></div>
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

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { register, getCaptcha } from '@/services';
import type { ICaptcha } from '@/types';

export default defineComponent({
  setup() {
    // 表单的ref
    const ruleFormRef: any = ref(null);
    // 对话框显示隐藏
    const dialogVisible = ref(false);

    const registerCaptcha = ref();
    const CaptchaAnswer = ref();
    //传验证参
    const params: ICaptcha = {
      width: 150,
      height: 30,
    };
    // 获取验证码列表
    const Captcha = async () => {
      const res = await getCaptcha(params);
      registerCaptcha.value = res.data.data;
      CaptchaAnswer.value = res.data.text;
    };
    Captcha();

    const changeRegisterCaptcha =async () => {
      const res = await getCaptcha(params);
      registerCaptcha.value =res.data.data;
    };
    // 模型
    const ruleForm = reactive({
      // 模型
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
          validator: (rule: any, value: string, callback: Function) => {
            // rule：规则，value:输入的值 callback回调函数
            if (!value) return callback(new Error('邮箱不能为空'));
            // 在下一行禁用eslint，类似上一种方法，只是写的位置不同罢了
            // eslint-disable-next-line
            const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
            if (!reg.test(value)) return callback(new Error('邮箱不合法'));
            callback();
          },
          trigger: 'blur',
        },
      ],
      phone: [
        {
          required: true,
          /**
           * rule：规则
           * value: 输入的值
           * callback：回调，决定是否校验通过
           */
          validator: (rule: any, value: string, callback: Function) => {
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
      ruleFormRef.value.validate(async (valid: boolean) => {
        if (!valid) return;

        const res: any = await register(ruleForm);
        if (res.data.code === 200) {
          // 成功
          ElMessage.success({
            message: '注册成功~',
            type: 'success',
          });

          // 关闭当前窗口
          dialogVisible.value = false;
        } else {
          // 失败
          ElMessage.error(res.data.message);

          // 刷新验证码
          // changeRegisterCaptcha();
        }
      });
    };

    watch(dialogVisible, (newValue) => {
      if (!newValue) {
        // 调用表单的清空方法（把校验也清空）
        ruleFormRef.value.resetFields();
      }
    });

    return {
      dialogVisible,
      ruleForm,
      rules,
      ruleFormRef,
      changeRegisterCaptcha,
      handleRegister,
      registerCaptcha,
    };
  },
});
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
