<template>
  <div v-loading="loading" class="profile-container">
    <el-card v-if="profile" class="profile-card">
      <div class="profile-head">
        <el-avatar :size="72" :src="profile.avatar" />
        <div class="profile-info">
          <div class="profile-name">{{ profile.username }}</div>
          <div class="profile-intro">
            {{ profile.personalIntroduction || '这个人很懒，什么都没写' }}
          </div>
        </div>
        <el-button
          v-if="profile.userId !== myId"
          :type="profile.is_following ? 'info' : 'primary'"
          @click="toggleFollow"
        >
          {{ profile.is_following ? '已关注' : '关注' }}
        </el-button>
      </div>
      <div class="profile-stats">
        <div class="stat-item">
          <div class="stat-value">{{ profile.integral ?? 0 }}</div>
          <div class="stat-label">积分</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ profile.upload_ques_num ?? 0 }}</div>
          <div class="stat-label">上传题目</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ profile.correct_ques_num ?? 0 }}</div>
          <div class="stat-label">答题正确</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ profile.following ?? 0 }}</div>
          <div class="stat-label">关注</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ profile.followers ?? 0 }}</div>
          <div class="stat-label">粉丝</div>
        </div>
      </div>
    </el-card>
    <el-card v-else-if="!loading">
      <el-empty description="用户不存在或已注销" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getPublicProfile, followUser, unfollowUser } from '@/services';
import queryString from 'query-string';
import {parseHashQuery, firstQueryValue } from '@/utils';
import type { IPublicProfile } from '@/types';

const store = useStore();
const route = useRoute();
const myId = store.state.userData.userId as number;
const { id } = parseHashQuery();
const targetId = Number(firstQueryValue(id));
const profile = ref<IPublicProfile | null>(null);
const loading = ref(true);

const load = async () => {
  loading.value = true;
  try {
    profile.value = targetId
      ? await getPublicProfile({ userId: targetId })
      : null;
  } finally {
    loading.value = false;
  }
};

const toggleFollow = async () => {
  if (!profile.value) return;
  if (profile.value.is_following) {
    await unfollowUser({ followedId: profile.value.userId });
    ElMessage.success('已取消关注');
  } else {
    await followUser({ followedId: profile.value.userId });
    ElMessage.success('已关注');
  }
  load();
};

onMounted(load);
</script>

<style scoped>
.profile-container {
  width: 100%;
  min-height: 400px;
}
.profile-card {
  max-width: 640px;
}
.profile-head {
  display: flex;
  align-items: center;
  gap: 16px;
}
.profile-info {
  flex: 1;
  min-width: 0;
}
.profile-name {
  font-size: 22px;
  font-weight: 700;
}
.profile-intro {
  margin-top: 6px;
  color: #909399;
}
.profile-stats {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
.stat-item {
  text-align: center;
}
.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #409eff;
}
.stat-label {
  margin-top: 4px;
  font-size: 13px;
  color: #909399;
}
</style>
