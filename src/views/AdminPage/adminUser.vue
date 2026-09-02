<template>
  <div class="admin-user">
    <el-card>
      <template #header>
        <div class="header">
          <span>用户管理</span>
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="用户列表" name="normal">
          <el-table
            ref="userTableRef"
            v-loading="loading"
            :data="userInfo"
            stripe
            style="width: 100%"
            height="650"
            @scroll="handleTableScroll"
          >
          <el-table-column prop="userId" label="用户id" width="80" />
          <el-table-column prop="name" label="用户名昵称" />
          <el-table-column prop="phone" label="电话" />
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
              <div
                :style="scope.row.role === 0 ? 'color: red' : 'color: green'"
              >
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
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <div class="operation">
                <el-button
                  v-if="scope.row.role === 0"
                  type="primary"
                  size="small"
                  @click="editPassword(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  v-if="scope.row.role === undefined"
                  type="danger"
                  size="small"
                  @click="deleteUserFun(scope.row.userId)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total > 0" class="list-total">
          共 {{ total }} 条，已加载 {{ userInfo.length }} 条
        </div>
      </el-tab-pane>
      <el-tab-pane label="已删除用户" name="deleted">
        <el-table
          v-loading="deletedLoading"
          :data="deletedUsers"
          style="width: 100%"
          height="650"
        >
          <el-table-column prop="userId" label="用户id" width="80" />
          <el-table-column prop="name" label="用户名昵称" />
          <el-table-column prop="phone" label="电话" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column label="注册时间">
            <template #default="scope">
              <div>{{ transitionTime(scope.row.ctime) }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button
                type="success"
                size="small"
                @click="restoreUserFun(scope.row.userId)"
                >恢复</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-empty
          v-if="!deletedLoading && deletedUsers.length === 0"
          :image-size="160"
          description="没有已删除的用户"
        />
      </el-tab-pane>
      </el-tabs>
    </el-card>
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
import {
  getUserList,
  deleteUser,
  editAdminPassword,
  getDeletedUsers,
  restoreUser,
} from '@/services';
import {
  transitionSex,
  transitionTime,
  getTableScrollBody,
} from '@/utils/index';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import type { IUserListItem } from '@/types';

const userInfo = ref<IUserListItem[]>([]);
const currentPage = ref(1);
const total = ref(0);
const pageSize = 20;
const userTableRef = ref();
const loadingMore = ref(false);
const noMore = ref(false);
const activeTab = ref('normal');
const deletedUsers = ref<IUserListItem[]>([]);
const deletedLoading = ref(false);
const dialogVisibleEditPassword = ref(false);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  password: '',
});
const isAdmin = ref<string | number>('');
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

const getUser = async (append = false) => {
  if (loadingMore.value) return;
  loadingMore.value = true;
  const res = await getUserList({
    currentPage: currentPage.value,
    pageSize,
  });
  (res?.result ?? []).forEach((item: IUserListItem) => {
    item.name = item?.username || item?.name;
    // 积分由后端按统一公式实时计算返回，前端不再自行拼装，避免与用户端不一致
  });
  if (append) {
    userInfo.value = [...userInfo.value, ...(res?.result ?? [])];
  } else {
    userInfo.value = res?.result ?? [];
  }
  total.value = res?.total ?? 0;
  noMore.value = userInfo.value.length >= total.value;
  loadingMore.value = false;
};
const handleTableScroll = () => {
  const body = getTableScrollBody(userTableRef.value);
  if (!body) return;
  const { scrollTop, clientHeight, scrollHeight } = body;
  if (
    scrollTop + clientHeight >= scrollHeight - 50 &&
    !loadingMore.value &&
    !noMore.value
  ) {
    currentPage.value++;
    getUser(true);
  }
};
const deleteUserFun = (id: number) => {
  ElMessageBox.confirm(
    '确定删除该用户吗？其上传的题目、评论等数据将一并清理',
    '提示',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(() => {
    deleteUser({ userId: id }).then(() => {
      ElMessage.success('删除成功');
      getUser();
    });
  });
};
const editPassword = (val: { id?: number }) => {
  dialogVisibleEditPassword.value = true;
  isAdmin.value = val.id ?? '';
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
  await formEl.validate((valid) => {
    if (valid) {
      const params = {
        password: ruleForm.password,
        id: isAdmin.value,
      };
      editAdminPassword(params).then(() => {
        ElMessage({
          type: 'success',
          message: `修改成功`,
        });

        dialogVisibleEditPassword.value = false;
        resetForm(formEl);
        getUser();
      });
    } else {
      return;
    }
  });
};
const getDeletedUserList = async () => {
  deletedLoading.value = true;
  const list = (await getDeletedUsers()) ?? [];
  list.forEach((item: IUserListItem) => {
    item.name = item?.username || item?.name;
  });
  deletedUsers.value = list;
  deletedLoading.value = false;
};
const restoreUserFun = (userId: number | string) => {
  restoreUser({ userId }).then(() => {
    ElMessage.success('已恢复');
    getDeletedUserList();
    getUser();
  });
};
const handleTabChange = (name: string | number) => {
  if (name === 'deleted') {
    getDeletedUserList();
  }
};
onMounted(() => {
  getUser();
});
</script>

<style scoped>
.admin-user {
  width: 100%;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.operation {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.list-total {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
}
</style>
