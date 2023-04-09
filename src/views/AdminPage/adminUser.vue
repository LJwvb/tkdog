<template>
  <div class="admin-user">
    <el-table :data="userInfo" style="width: 100%">
      <el-table-column prop="userId" label="用户id" width="80" />
      <el-table-column prop="name" label="用户名昵称" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          <div
            :style="
              scope.row.sex !== '0' && scope.row.sex !== '1'
                ? 'color:#ccc'
                : scope.row.sex === '0'
                ? 'color: #fab6b6'
                : 'color: #a0cfff'
            "
          >
            {{ transitionSex(Number(scope.row.sex)) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="权限">
        <template #default="scope">
          <div :style="scope.row.role === 0 ? 'color: red' : 'color: green'">
            {{ scope.row.role === 0 ? '管理员' : '普通用户' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="注册时间">
        <template #default="scope">
          <div>{{ transitionTime(scope.row.ctime) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="last_login_time" label="最后登录时间">
        <template #default="scope">
          <div>{{ transitionTime(scope.row.last_login_time) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="integral" label="积分" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <div class="operation">
            <el-button
              type="primary"
              size="small"
              v-if="scope.row.role === 0"
              @click="editPassword(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              v-if="scope.row.role === undefined"
              @click="deleteUserFun(scope.row.userId)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisibleEditPassword"
      title="修改密码"
      width="400px"
      center
    >
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" status-icon>
        <el-form-item prop="password" placeholder="请输入密码">
          <el-input
            v-model="ruleForm.password"
            placeholder="请输入长度在 6 到 20 个字符的密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { getUserList, deleteUser, editAdminPassword } from '@/services';
import { transitionSex, transitionTime } from '@/utils/index';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

const userInfo = ref();
const dialogVisibleEditPassword = ref(false);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  password: '',
});
const isAdmin = ref('');
const rules = reactive<FormRules>({
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur',
    },
  ],
});

const getUser = async () => {
  const res = await getUserList({});
  res.data.forEach((item: any) => {
    item.name = item?.username || item?.name;
    item.integral =
      item?.like_ques_num * 5 +
        item?.upload_ques_num * 1 +
        item?.approvedNums * 2 || 0;
  });

  userInfo.value = res.data;
};
const deleteUserFun = (id: number) => {
  deleteUser({ userId: id }).then((res) => {
    ElMessage.success('删除成功');
    getUser();
  });
};
const editPassword = (val: any) => {
  dialogVisibleEditPassword.value = true;
  isAdmin.value = val.id;
};
const cancel = () => {
  dialogVisibleEditPassword.value = false;
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = {
        password: ruleForm.password,
        id: isAdmin.value,
      };
      editAdminPassword(params).then((res) => {
        if (res.code !== 200) {
          ElMessage.error(res.message);
          return;
        }
        ElMessage({
          type: 'success',
          message: `修改成功`,
        });

        dialogVisibleEditPassword.value = false;
        resetForm(formEl);
        getUser();
      });
    } else {
      return false;
    }
  });
};
onMounted(() => {
  getUser();
});
</script>

<style scoped>
.admin-user {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
.operation {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
