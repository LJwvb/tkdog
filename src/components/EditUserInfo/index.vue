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
        <el-form-item label="头像">
          <div class="avatar-uploader">
            <el-avatar :size="80" :src="avatarPreview" class="avatar-preview" />
            <div class="avatar-actions">
              <el-button size="small" type="primary" plain @click="pickAvatar">
                更换头像
              </el-button>
              <div class="avatar-tip">支持 jpg/png/gif/webp，≤5MB</div>
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onPickAvatar"
            />
          </div>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input disabled :placeholder="phone" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input :placeholder="username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email" placeholder="请输入邮箱">
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="性别" prop="sex" placeholder="请选择性别">
          <el-select v-model="ruleForm.sex" placeholder="请选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
            <el-option label="未知" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="个人介绍" prop="introduction">
          <el-input v-model="ruleForm.personalIntroduction" type="textarea" />
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
import { reactive, ref, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { editUserInfo, uploadImage } from '@/services';
import type { FormInstance, FormRules } from 'element-plus';
const formSize = ref<'' | 'default' | 'small' | 'large'>('default');
const ruleFormRef = ref<FormInstance>();
const store = useStore();
const phone = store.state.userData.phone;
const username = store.state.userData.username;
// 头像预览（初始为当前头像，可更换）
const avatarPreview = ref(store.state.userData.avatar || '');
const avatarInput = ref<HTMLInputElement>();
const pickAvatar = () => {
  avatarInput.value?.click();
};
const onPickAvatar = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const url = await uploadImage(file, 'avatar');
    avatarPreview.value = url;
  } catch (err) {
    ElMessage.error((err as Error)?.message || '头像上传失败');
  } finally {
    input.value = '';
  }
};
const props = defineProps({
  dialogVisible: Boolean,
  userInfo: {
    type: Object,
    default: () => {},
  },
});

const { dialogVisible } = toRefs(props);

const ruleForm = reactive({
  email: store.state.userData.email,
  sex: store.state.userData.sex,
  personalIntroduction: store.state.userData.personalIntroduction,
});

const rules = reactive<FormRules>({
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
  await formEl.validate((valid) => {
    if (valid) {
      const params = {
        ...ruleForm,
        phone: phone,
        avatar: avatarPreview.value,
      };

      editUserInfo(params).then(() => {
        ElMessage.success('修改成功');
        emit('update:dialogVisible', false);
        store.commit('setUserData', {
          ...store.state.userData,
          ...params,
        });
      });
    } else {
      return;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
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
:deep(.el-input__validateIcon) {
  color: var(--el-color-success);
}
:deep(.el-form-item__label) {
  white-space: nowrap;
}
.tag {
  margin-right: 5px;
}
.avatar-uploader {
  display: flex;
  align-items: center;
  gap: 16px;
}
.avatar-preview {
  flex-shrink: 0;
}
.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.avatar-tip {
  font-size: 12px;
  color: #909399;
}
</style>
