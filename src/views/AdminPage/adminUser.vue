<template>
  <div class="admin-user">
    <el-card class="search" shadow="never">
      <el-form inline>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="按用户名搜索"
            clearable
            style="width: 150px"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item label="ID">
          <el-input
            v-model="searchForm.userId"
            placeholder="按用户ID搜索"
            clearable
            style="width: 130px"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model="searchForm.phone"
            placeholder="按电话搜索"
            clearable
            style="width: 150px"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="searchForm.email"
            placeholder="按邮箱搜索"
            clearable
            style="width: 180px"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-container>
      <el-main style="padding: 10px 0 0 0">
        <el-card>
          <template #header>
            <div class="header">
              <span>用户管理</span>
            </div>
          </template>

          <el-tabs v-model="activeTab" @tab-change="handleTabChange">
            <el-tab-pane label="普通用户" name="normal">
              <el-table
                ref="userTableRef"
                v-loading="loading"
                :data="userInfo"
                stripe
                style="width: 100%"
                height="calc(100vh - 464px)"
                empty-text=""
                @scroll="handleTableScroll"
                @sort-change="handleSortChange"
              >
                <el-table-column prop="userId" label="用户id" width="80" sortable="custom" />
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
                      :style="
                        scope.row.role === 0 ? 'color: red' : 'color: green'
                      "
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
                <el-table-column prop="integral" label="积分" width="80" sortable="custom" />
                <el-table-column prop="ai_credit" label="AI额度" width="80" sortable="custom" />
                <el-table-column prop="credit_exchanged" label="已兑积分" width="90" sortable="custom" />
                <el-table-column label="最后打卡" width="110">
                  <template #default="scope">
                    <div>{{ scope.row.last_checkin_date ? transitionTime(scope.row.last_checkin_date).slice(0, 10) : '-' }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="consecutive_days" label="连续打卡" width="90" sortable="custom" />
                <el-table-column prop="total_checkin" label="累计打卡" width="90" sortable="custom" />
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
                <template #empty>
                  <el-empty :image-size="160" description="暂无用户" />
                </template>
              </el-table>
              <div v-if="total > 0" class="list-total">
                共 {{ total }} 条，已加载 {{ userInfo.length }} 条
              </div>
            </el-tab-pane>
            <el-tab-pane label="管理员" name="admin">
              <el-table
                v-loading="loading"
                :data="userInfo"
                stripe
                style="width: 100%"
                height="calc(100vh - 464px)"
                empty-text=""
              >
                <el-table-column prop="userId" label="用户id" width="80" />
                <el-table-column prop="name" label="用户名昵称" />
                <el-table-column prop="phone" label="电话" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column label="权限" width="100">
                  <template #default="scope">
                    <div style="color: red">管理员</div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template #default="scope">
                    <div class="operation">
                      <el-button type="primary" size="small" @click="editPassword(scope.row)">编辑</el-button>
                    </div>
                  </template>
                </el-table-column>
                <template #empty>
                  <el-empty :image-size="160" description="暂无管理员" />
                </template>
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
                height="calc(100vh - 317px)"
                empty-text=""
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
                <template #empty>
                  <el-empty :image-size="160" description="没有已删除的用户" />
                </template>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
    </el-container>
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
import { ref, onMounted, reactive, nextTick } from 'vue';
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
const searchForm = reactive({
  username: '',
  userId: '',
  phone: '',
  email: '',
});
const userTableRef = ref();
const loadingMore = ref(false);
const noMore = ref(false);
const activeTab = ref('normal');
const sortField = ref('');
const sortOrder = ref('');
const deletedUsers = ref<IUserListItem[]>([]);
// 首次加载 / 刷新列表时的整表蒙层（滚动追加走 loadingMore，不叠整表蒙层）
const loading = ref(false);
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

const handleSortChange = ({ prop, order }) => {
  sortField.value = order ? prop : '';
  sortOrder.value = order || '';
  currentPage.value = 1;
  userInfo.value = [];
  noMore.value = false;
  getUser(false);
};

const getUser = async (append = false) => {
  if (loadingMore.value) return;
  loadingMore.value = true;
  // 只有非追加（首次 / 切 tab / 删除后刷新）才显示整表蒙层，滚动追加不闪蒙层
  if (!append) loading.value = true;
  try {
    const res = await getUserList({
      currentPage: currentPage.value,
      pageSize,
      ...searchForm,
      orderBy: sortField.value,
      orderDir: sortOrder.value,
      role: activeTab.value === 'admin' ? 'admin' : activeTab.value === 'normal' ? 'user' : undefined,
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
  } finally {
    // 失败也必须复位：否则蒙层卡死，且 loadingMore 常驻会导致滚动加载永久失效
    loadingMore.value = false;
    loading.value = false;
  }
  // 数据不满一屏（无滚动空间）时自动继续加载下一页，直到撑满或到底
  nextTick(() => {
    const body = getTableScrollBody(userTableRef.value);
    if (
      body &&
      !noMore.value &&
      !loadingMore.value &&
      body.scrollHeight <= body.clientHeight + 50
    ) {
      currentPage.value++;
      getUser(true);
    }
  });
};
const onSearch = () => {
  currentPage.value = 1;
  userInfo.value = [];
  getUser();
};
const onReset = () => {
  searchForm.username = '';
  searchForm.userId = '';
  searchForm.phone = '';
  searchForm.email = '';
  currentPage.value = 1;
  userInfo.value = [];
  getUser();
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
  } else {
    currentPage.value = 1;
    userInfo.value = [];
    noMore.value = false;
    sortField.value = '';
    sortOrder.value = '';
    getUser();
  }
};
onMounted(() => {
  getUser();
});
</script>

<style scoped>
.admin-user {
  width: 100%;
}
.search :deep(.el-form-item) {
  margin-bottom: 0;
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
