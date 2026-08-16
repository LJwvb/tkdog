<template>
  <div class="user-info-container">
    <el-card style="position: relative">
      <div class="main-info">
        <img :src="userInfo?.avatar" loading="lazy" class="avatar" />
        <div class="name-box">
          <div class="name">
            <h3>
              {{ userInfo?.username }}
            </h3>
            <div style="margin: 6px 0 0 5px">
              <el-icon v-if="userInfo?.sex === '0'" color="#fab6b6" :size="22"
                ><Female
              /></el-icon>
              <el-icon
                v-else-if="userInfo?.sex === '1'"
                color="#a0cfff"
                :size="22"
                ><Male
              /></el-icon>
              <span v-else>未知</span>
            </div>
          </div>

          <span class="intro">{{
            userInfo?.personalIntroduction
              ? userInfo?.personalIntroduction
              : '暂无个人简介'
          }}</span>
        </div>
      </div>
      <el-button
        type="primary"
        style="margin-top: 20px"
        class="edit-btn"
        @click="editUserInfo"
        >编辑个人信息</el-button
      >
      <el-button
        type="warning"
        class="checkin-btn"
        :disabled="checkinInfo?.todayChecked"
        @click="doCheckin"
      >
        {{ checkinInfo?.todayChecked ? '今日已打卡' : '每日打卡 +5积分' }}
      </el-button>
    </el-card>
    <el-card style="margin-top: 20px">
      <div class="question-info">
        <h4>信息</h4>
        <div class="integral">
          积分<el-tooltip
            class="box-item"
            effect="light"
            content="积分 = 上传×2 + 审核通过×5 + 答对×1 + 打卡×5"
            placement="left"
          >
            <el-icon><Warning /></el-icon> </el-tooltip
          >:{{ userInfo?.integral ?? 0 }}
        </div>
        <div class="level">
          等级：
          <el-tag :type="level.type" size="small" effect="plain">{{
            level.name
          }}</el-tag>
        </div>
        <div>题目获赞数：{{ userInfo?.like_ques_num }}</div>
        <div>题目上传数：{{ userInfo?.upload_ques_num }}</div>
        <div>题目被审核通过数：{{ userInfo?.approvedNums ?? 0 }}</div>
        <div>答题正确数：{{ userInfo?.correct_ques_num ?? 0 }}</div>
        <div>
          连续打卡：{{ checkinInfo?.consecutive ?? 0 }} 天（累计
          {{ checkinInfo?.total ?? 0 }} 天）
        </div>
        <div class="daily-goal">
          <span>每日目标：</span>
          <template v-if="editingGoal">
            <el-input-number
              v-model="goalInput"
              :min="0"
              :max="500"
              size="small"
              style="width: 100px"
            />
            <el-button size="small" type="primary" @click="saveGoal"
              >保存</el-button
            >
            <el-button size="small" @click="editingGoal = false"
              >取消</el-button
            >
          </template>
          <template v-else>
            {{ userInfo?.daily_goal || 0 }} 题
            <el-button size="small" link type="primary" @click="startEditGoal"
              >设置</el-button
            >
          </template>
          <div v-if="goalRate !== null" class="goal-progress">
            <el-progress
              :percentage="goalRate"
              :stroke-width="10"
              :format="() => `今日已答对 ${userInfo?.today_correct || 0} 题`"
            />
          </div>
        </div>
        <div v-if="medals.length" class="medals">
          勋章：
          <el-tag
            v-for="m in medals"
            :key="m"
            type="warning"
            effect="plain"
            class="medal-tag"
            >{{ m }}</el-tag
          >
        </div>
        <div v-if="userInfo?.email">邮箱：{{ userInfo?.email }}</div>
        <div>注册时间：{{ transitionTime(userInfo?.ctime) }}</div>
        <div>最后登录时间：{{ transitionTime(userInfo?.last_login_time) }}</div>
      </div>
    </el-card>
  </div>
  <EditUserInfo v-model:dialogVisible="dialogVisible" :userInfo="userInfo" />
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { transitionTime } from '@/utils/index';
import { getUserInfo, checkin, getCheckinInfo, setDailyGoal } from '@/services';
import EditUserInfo from '@/components/EditUserInfo/index.vue';
import { Female, Male, Warning } from '@element-plus/icons-vue';
const store = useStore();
const dialogVisible = ref(false);
interface IUserDetail {
  userId?: number;
  avatar?: string;
  username?: string;
  sex?: string;
  personalIntroduction?: string;
  like_ques_num?: number;
  upload_ques_num?: number;
  approvedNums?: number;
  integral?: number;
  correct_ques_num?: number;
  email?: string;
  ctime?: string;
  last_login_time?: string;
  daily_goal?: number;
  today_correct?: number;
}
interface ICheckinInfo {
  todayChecked: boolean;
  consecutive: number;
  total: number;
}
const userInfo = ref<IUserDetail>({});
const checkinInfo = ref<ICheckinInfo>({
  todayChecked: false,
  consecutive: 0,
  total: 0,
});
// 勋章：基于积分/答题/上传/打卡达标情况
const medals = computed(() => {
  const list: string[] = [];
  const integral = userInfo.value.integral ?? 0;
  const correct = userInfo.value.correct_ques_num ?? 0;
  const upload = userInfo.value.upload_ques_num ?? 0;
  const checkinDays = checkinInfo.value.total ?? 0;
  if (integral >= 100) list.push('积分达人');
  if (integral >= 500) list.push('积分高手');
  if (correct >= 10) list.push('答题能手');
  if (correct >= 50) list.push('答题大师');
  if (upload >= 5) list.push('出题贡献者');
  if (checkinDays >= 7) list.push('坚持打卡');
  return list;
});
// 用户等级：基于积分
const level = computed<{
  name: string;
  type: 'primary' | 'success' | 'warning' | 'info' | 'danger';
}>(() => {
  const integral = userInfo.value.integral ?? 0;
  if (integral >= 500) return { name: '钻石', type: 'success' };
  if (integral >= 200) return { name: '黄金', type: 'warning' };
  if (integral >= 100) return { name: '白银', type: 'info' };
  if (integral >= 50) return { name: '青铜', type: 'danger' };
  return { name: '新手', type: 'primary' };
});
// 每日答题目标
const editingGoal = ref(false);
const goalInput = ref(0);
const goalRate = computed<number | null>(() => {
  const goal = userInfo.value.daily_goal || 0;
  if (!goal) return null;
  const done = userInfo.value.today_correct || 0;
  return Math.min(100, Math.round((done / goal) * 100));
});
const startEditGoal = () => {
  goalInput.value = userInfo.value.daily_goal || 0;
  editingGoal.value = true;
};
const saveGoal = async () => {
  await setDailyGoal({ goal: goalInput.value });
  ElMessage.success('目标已保存');
  editingGoal.value = false;
  loadUserInfo();
};
const editUserInfo = () => {
  dialogVisible.value = true;
};

const loadCheckin = async () => {
  const res = await getCheckinInfo();
  if (res) {
    checkinInfo.value = res as unknown as ICheckinInfo;
  }
};
// 加载当前登录用户信息（以 session 为准），并同步 store，避免 store 与后端 session 不一致
const loadUserInfo = async () => {
  const data = await getUserInfo();
  userInfo.value = data;
  // 仅在 userId 不一致时同步 store，避免 watch 触发无限循环
  if (data?.userId && store.state.userData.userId !== data.userId) {
    store.commit('setUserData', {
      ...store.state.userData,
      userId: data.userId,
      username: data.username,
      avatar: data.avatar,
    });
  }
};

const doCheckin = async () => {
  const res = await checkin();
  if (res) {
    ElMessage.success(res.already ? '今日已打卡' : '打卡成功');
    await loadCheckin();
    // 刷新用户信息（积分变化）
    loadUserInfo();
  }
};

onMounted(() => {
  loadUserInfo();
  loadCheckin();
});
// 如果用户信息发生变化，重新获取用户信息
watch(
  () => store.state.userData,
  () => {
    loadUserInfo();
  },
);
</script>
<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}

.main-info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.intro {
  margin-top: 30px;
}

.name-box {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.name {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.edit-btn {
  position: absolute;
  top: 0;
  right: 20px;
}

.checkin-btn {
  margin-top: 16px;
}

.question-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.question-info > div {
  margin-top: 20px;
  font-size: 18px;
}

.integral {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.medals {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.medal-tag {
  margin-top: 0;
}

.daily-goal {
  display: flex;
  align-items: center;
  gap: 6px;
}

.goal-progress {
  margin-top: 6px;
  max-width: 320px;
}
</style>
