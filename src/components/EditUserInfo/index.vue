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
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="ruleForm.phone"
            maxlength="11"
            placeholder="请输入手机号"
          />
          <div class="field-tip">
            手机号是登录账号，修改后下次请用新手机号登录
          </div>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="ruleForm.username"
            maxlength="20"
            placeholder="请输入用户名"
          />
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
        <el-button type="primary" :loading="subLoading" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, watch, nextTick } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { editUserInfo, uploadImage } from '@/services';
import type { FormInstance, FormRules } from 'element-plus';
const formSize = ref<'' | 'default' | 'small' | 'large'>('default');
const ruleFormRef = ref<FormInstance>();
const store = useStore();
// 提交中标记：防止重复点击，同时给按钮 loading 反馈
const subLoading = ref(false);
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
  phone: store.state.userData.phone,
  username: store.state.userData.username,
  email: store.state.userData.email,
  sex: store.state.userData.sex,
  personalIntroduction: store.state.userData.personalIntroduction,
});

// 弹窗打开时同步最新用户数据并清掉上次的校验残留：
// ruleForm / avatarPreview 是组件挂载时的一次性快照，弹窗复用不会自动刷新，
// 否则改完一次再打开会看到旧值，且上次的红色报错一直挂着。
watch(dialogVisible, (visible) => {
  if (!visible) return;
  const ud = store.state.userData;
  ruleForm.phone = ud.phone;
  ruleForm.username = ud.username;
  ruleForm.email = ud.email;
  ruleForm.sex = ud.sex;
  ruleForm.personalIntroduction = ud.personalIntroduction;
  avatarPreview.value = ud.avatar || '';
  nextTick(() => ruleFormRef.value?.clearValidate());
});

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度 2-20 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号（11 位，1 开头）',
      // change 也触发：避免用户输入完直接点「确定」时不校验
      trigger: ['blur', 'change'],
    },
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
  // 校验不通过时 Element Plus 会在字段下方内联提示，这里不再额外 toast，避免重复打扰
  const valid = await formEl.validate().catch(() => false);
  if (!valid) return;

  const params = {
    ...ruleForm,
    avatar: avatarPreview.value,
  };

  subLoading.value = true;
  try {
    await editUserInfo(params);
    ElMessage.success('修改成功');
    emit('update:dialogVisible', false);
    store.commit('setUserData', {
      ...store.state.userData,
      ...params,
    });
  } catch (err: any) {
    // 网络/业务错误已由 request 拦截层统一 toast，这里只处理「服务端校验失败」的场景：
    // 把后端返回的具体原因回填到对应字段，而不是只弹一句笼统的提示。
    const msg: string = err?.message || '';
    if (msg.includes('手机号')) {
      formEl.validateField?.('phone');
    } else if (msg.includes('用户名')) {
      formEl.validateField?.('username');
    }
  } finally {
    subLoading.value = false;
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 不用 resetFields()：它会回退到组件初次挂载时的快照（可能是旧值）。
  // 这里手动恢复为 store 里的当前真实数据，并清掉校验提示。
  const ud = store.state.userData;
  ruleForm.phone = ud.phone;
  ruleForm.username = ud.username;
  ruleForm.email = ud.email || '';
  ruleForm.sex = ud.sex;
  ruleForm.personalIntroduction = ud.personalIntroduction || '';
  avatarPreview.value = ud.avatar || '';
  formEl.clearValidate();
};

const emit = defineEmits<{ 'update:dialogVisible': [value: boolean] }>();
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
.field-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
  margin-top: 2px;
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
