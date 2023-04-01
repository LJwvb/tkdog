<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改用户信息"
    width="50%"
    center
    :before-close="handleClose"
  >
    <div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="手机号">
          <el-input disabled :placeholder="phone" />
        </el-form-item>
        <el-form-item label="用户名" prop="username" placeholder="请输入用户名">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email" placeholder="请输入邮箱">
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="性别" prop="sex" placeholder="请选择性别">
          <el-select v-model="ruleForm.sex" placeholder="请选择性别">
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
            <el-option label="未知" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="个人介绍" prop="introduction">
          <el-input type="textarea" v-model="ruleForm.personalIntroduction" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button
          @click="
            () => {
              resetForm(ruleFormRef);
            }
          "
          >清空</el-button
        >
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, defineProps } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { editUserInfo } from '@/services';
import type { FormInstance, FormRules } from 'element-plus';
const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
const store = useStore();
const phone = store.state.userData.phone;
const props = defineProps({
  dialogVisible: Boolean,
  userInfo: {
    type: Object,
    default: () => {},
  },
});

const { dialogVisible } = toRefs(props);

const ruleForm = reactive({
  username: store.state.userData.username,
  email: store.state.userData.email,
  sex: store.state.userData.sex,
  personalIntroduction: store.state.userData.personalIntroduction,
});

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
  ],

  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  introduction: [
    { required: false, message: '请输入个人介绍', trigger: 'blur' },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = {
        ...ruleForm,
        phone: phone,
      };
      if (ruleForm.username !== store.state.userData.username) {
        ElMessageBox.confirm(
          '您修改了用户名，修改后您上传的题目署名不会变更，是否继续修改？',
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        )
          .then(() => {
            editUserInfo(params).then((res) => {
              console.log(res);
              if (res.code === 200) {
                ElMessage.success('修改成功');
                emit('update:dialogVisible', false);
                store.commit('setUserData', {
                  ...store.state.userData,
                  ...params,
                });
              }
            });
          })
          .catch(() => {});
      }

      console.log(params);
    } else {
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  ruleForm.username = '';
  ruleForm.email = '';
  ruleForm.sex = '';
  ruleForm.personalIntroduction = '';
};

const emit = defineEmits(['update:dialogVisible']);
const cancel = () => {
  emit('update:dialogVisible', false);
};
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定离开吗?所填内容将会丢失')
    .then(() => {
      done();
      emit('update:dialogVisible', false);
    })
    .catch(() => {
      // catch error
    });
};
</script>

<style scoped>
::v-deep .el-input__validateIcon {
  color: var(--el-color-success);
}
::v-deep .el-form-item__label {
  white-space: nowrap;
}
.tag {
  margin-right: 5px;
}
</style>
