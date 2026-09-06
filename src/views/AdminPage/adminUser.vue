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
                @sort-change="handleSortChange"
              >
                <el-table-column
                  prop="userId"
                  label="用户id"
                  width="80"
                  sortable="custom"
                />
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
                <el-table-column
                  prop="integral"
                  label="积分"
                  width="80"
                  sortable="custom"
                />
                <el-table-column
                  prop="ai_credit"
                  label="AI额度"
                  width="80"
                  sortable="custom"
                />
                <el-table-column
                  prop="credit_exchanged"
                  label="已兑积分"
                  width="90"
                  sortable="custom"
                />
                <el-table-column label="最后打卡" width="110">
                  <template #default="scope">
                    <div>
                      {{
                        scope.row.last_checkin_date
                          ? transitionTime(scope.row.last_checkin_date).slice(
                              0,
                              10,
                            )
                          : '-'
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="consecutive_days"
                  label="连续打卡"
                  width="90"
                  sortable="custom"
                />
                <el-table-column
                  prop="total_checkin"
                  label="累计打卡"
                  width="90"
                  sortable="custom"
                />
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
                        v-if="scope.row.role !== 0"
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
                      <el-button
                        type="primary"
                        size="small"
                        @click="editPassword(scope.row)"
                        >编辑</el-button
                      >
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
import { ref, onMounted, reactive } from 'vue';
import {
  getUserList,
  deleteUser,
  editAdminPassword,
  getDeletedUsers,
  restoreUser,
} from '@/services';
import { transitionSex, transitionTime } from '@/utils/index';
import { useInfiniteTable } from '@/composables/useInfiniteTable';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import type { IUserListItem } from '@/types';

const PAGE_SIZE = 20;
const userTableRef = ref();

const searchForm = reactive({
  username: '',
  userId: '',
  phone: '',
  email: '',
});
const activeTab = ref('normal');
const sortField = ref('');
const sortOrder = ref('');

/**
 * 「普通用户 / 管理员」tab 共享：滚动追加 + 不足一屏自动补屏。
 * fetcher 闭包内自动捕获当前 searchForm / sortField / sortOrder / activeTab，
 * 调用方只需 reset() 触发重置即可。
 */
const {
  list: userInfo,
  total,
  loading,
  reset,
} = useInfiniteTable<IUserListItem>(
  async (params) => {
    const res = await getUserList({
      ...params,
      pageSize: PAGE_SIZE,
      ...searchForm,
      orderBy: sortField.value,
      orderDir: sortOrder.value,
      role:
        activeTab.value === 'admin'
          ? 'admin'
          : activeTab.value === 'normal'
          ? 'user'
          : undefined,
    });
    // 用户列表兼容「name / username」两种返回字段，统一映射到 name 列
    (res?.result ?? []).forEach((item: IUserListItem) => {
      item.name = item.username || item.name;
    });
    return res;
  },
  { pageSize: PAGE_SIZE, tableRef: userTableRef },
);

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

const handleSortChange = ({
  prop,
  order,
}: {
  prop: string | null;
  order: 'ascending' | 'descending' | null;
}) => {
  sortField.value = order && prop ? prop : '';
  sortOrder.value = order || '';
  void reset();
};

const onSearch = () => {
  void reset();
};
const onReset = () => {
  searchForm.username = '';
  searchForm.userId = '';
  searchForm.phone = '';
  searchForm.email = '';
  void reset();
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
      void reset();
    });
  });
};
const editPassword = (val: { id?: number; userId?: number }) => {
  dialogVisibleEditPassword.value = true;
  // 管理员列表行只带 userId（= admin 表主键 id），需回退取值，否则修改密码时 id 为空导致失败
  isAdmin.value = val.id ?? val.userId ?? '';
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
        void reset();
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
    void reset();
  });
};
const handleTabChange = (name: string | number) => {
  if (name === 'deleted') {
    getDeletedUserList();
  } else {
    // 切回 normal / admin tab 时重置排序并触发刷新
    sortField.value = '';
    sortOrder.value = '';
    void reset();
  }
};
onMounted(() => {
  void reset();
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
