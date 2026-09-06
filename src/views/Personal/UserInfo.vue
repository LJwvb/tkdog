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
    <el-card style="margin-top: 16px">
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
        <div class="ai-credit-row">
          <span>AI 额度：<b>{{ userInfo?.ai_credit ?? 0 }}</b> 次</span>
          <el-button size="small" type="primary" plain @click="showExchange = true">积分兑换</el-button>
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

  <!-- 积分兑换 AI 额度弹窗 -->
  <el-dialog v-model="showExchange" title="积分兑换 AI 额度" width="400px">
    <div class="exchange-info">
      <p>当前积分：<b>{{ userInfo?.integral ?? 0 }}</b></p>
      <p>当前 AI 额度：<b>{{ userInfo?.ai_credit ?? 0 }}</b> 次</p>
      <p class="exchange-rate">兑换比例：10 积分 = 1 次 AI 额度</p>
      <div class="exchange-count">
        <span>兑换数量：</span>
        <el-input-number v-model="exchangeCount" :min="1" :max="100" size="small" />
        <span class="exchange-cost">= {{ exchangeCount * 10 }} 积分</span>
      </div>
    </div>
    <template #footer>
      <el-button @click="showExchange = false">取消</el-button>
      <el-button type="primary" :loading="exchanging" @click="doExchange">确认兑换</el-button>
    </template>
  </el-dialog>

  <EditUserInfo v-model:dialogVisible="dialogVisible" :userInfo="userInfo" />
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { transitionTime } from '@/utils/index';
import { getUserInfo, checkin, getCheckinInfo, setDailyGoal, exchangeAiCredit } from '@/services';
import EditUserInfo from '@/components/EditUserInfo/index.vue';
import { Female, Male, Warning } from '@element-plus/icons-vue';
const store = useStore();
const dialogVisible = ref(false);
const showExchange = ref(false);
const exchangeCount = ref(1);
const exchanging = ref(false);

const doExchange = async () => {
  exchanging.value = true;
  try {
    const res = await exchangeAiCredit({ count: exchangeCount.value });
    ElMessage.success(`兑换成功，获得 ${res.gained} 次 AI 额度`);
    // 刷新用户信息
    const info = await getUserInfo();
    if (info) userInfo.value = info;
    showExchange.value = false;
    exchangeCount.value = 1;
  } catch {
    ElMessage.error('兑换失败，请检查积分是否足够');
  } finally {
    exchanging.value = false;
  }
};
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
  ai_credit?: number;
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
  // el-tag 的 type 不含空字符串，新手档用 primary（蓝色）
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
  // 关键字段不一致时才同步 store（phone 等也纳入比较），避免 watch 触发无限循环
  const ud = store.state.userData;
  if (
    data?.userId &&
    (ud.userId !== data.userId ||
      ud.phone !== data.phone ||
      ud.username !== data.username ||
      ud.avatar !== data.avatar)
  ) {
    store.commit('setUserData', {
      ...ud,
      userId: data.userId,
      username: data.username,
      avatar: data.avatar,
      phone: data.phone,
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
}
.main-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.intro {
  margin-top: 12px;
  font-size: 14px;
  color: #909399;
}
.name-box {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  flex: 1;
}
.name {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.name h3 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.edit-btn {
  position: absolute;
  top: 20px;
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
.question-info > h4 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}
.question-info > div {
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}
.integral {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 4px;
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
  flex-wrap: wrap;
}
.goal-progress {
  margin-top: 8px;
  max-width: 320px;
  width: 100%;
}
.ai-credit-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.ai-credit-row b {
  color: #409eff;
  font-size: 16px;
}
.exchange-info p {
  margin: 8px 0;
}
.exchange-rate {
  color: #909399;
  font-size: 13px;
}
.exchange-count {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.exchange-cost {
  color: #f56c6c;
  font-size: 13px;
}
</style>
