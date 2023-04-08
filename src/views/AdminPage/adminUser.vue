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
              :disabled="scope.row.role === 0"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              :disabled="scope.row.role === 0"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getUserList } from '@/services';
import { transitionSex, transitionTime } from '@/utils/index';

const userInfo = ref();
const getUser = async () => {
  const res = await getUserList({});
  res.data.forEach((item: any) => {
    item.name = item?.username || item?.name;
    item.integral =
      item?.like_ques_num * 5 +
      item?.upload_ques_num * 1 +
      item?.approvedNums * 2;
  });

  userInfo.value = res.data;
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
