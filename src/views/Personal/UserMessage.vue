<template>
  <div
    v-loading="loading"
    class="user-message"
    element-loading-text="加载中..."
  >
    <el-card>
      <template #header>
        <div class="msg-header">
          <span>消息通知</span>
          <div class="msg-tools">
            <el-radio-group v-model="filter" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="unread">未读</el-radio-button>
              <el-radio-button label="read">已读</el-radio-button>
            </el-radio-group>
            <el-button
              v-if="notifications.some((n) => n.is_read === 0)"
              link
              type="primary"
              @click="markAll"
              >全部已读</el-button
            >
          </div>
        </div>
      </template>

      <div v-if="filteredNotifications.length > 0" class="msg-list">
        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          :class="['msg-item', item.is_read === 0 ? 'unread' : '']"
          @click="handleClick(item)"
        >
          <div class="msg-main">
            <div class="msg-title">
              <span v-if="item.is_read === 0" class="dot" />
              {{ item.title || '系统通知' }}
              <span
                v-if="item.type === 'comment' && item.question_id"
                class="go-link"
              >
                查看题目
              </span>
            </div>
            <div class="msg-content">{{ item.content }}</div>
          </div>
          <div class="msg-time">{{ transitionTime(item.ctime) }}</div>
        </div>
      </div>
      <el-empty v-else :image-size="200" description="暂无通知" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services';
import { transitionTime } from '@/utils';
import { useStore } from 'vuex';
import type { INotification } from '@/types';

const router = useRouter();
const store = useStore();
const loading = ref(true);
const notifications = ref<INotification[]>([]);
const filter = ref<'all' | 'unread' | 'read'>('all');
const filteredNotifications = computed(() => {
  if (filter.value === 'unread') {
    return notifications.value.filter((n) => n.is_read === 0);
  }
  if (filter.value === 'read') {
    return notifications.value.filter((n) => n.is_read !== 0);
  }
  return notifications.value;
});

const load = async () => {
  loading.value = true;
  const res = await getNotifications();
  notifications.value = res ?? [];
  loading.value = false;
};

const handleClick = async (item: INotification) => {
  // 标记已读，并同步导航栏未读角标
  if (item.is_read === 0) {
    await markNotificationRead({ id: item.id });
    item.is_read = 1;
    store.commit('setUnreadCount', Math.max(0, store.state.unreadCount - 1));
  }
  // 评论通知：跳转到对应题目并定位到该条评论
  if (item.type === 'comment' && item.question_id) {
    router.push({
      path: '/problemInfo',
      query: {
        id: item.question_id,
        commentId: item.comment_id,
      },
    });
  }
};

const markAll = async () => {
  await markAllNotificationsRead();
  notifications.value.forEach((n) => {
    n.is_read = 1;
  });
  store.commit('setUnreadCount', 0);
  ElMessage.success('全部已读');
};

onMounted(() => {
  load();
});
</script>

<style scoped>
.user-message {
  width: 100%;
  margin-left: 20px;
}
.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.msg-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}
.msg-list {
  display: flex;
  flex-direction: column;
}
.msg-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 8px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.msg-item:hover {
  background-color: #fafafa;
}
.msg-item.unread {
  background-color: #f5f9ff;
}
.msg-main {
  flex: 1;
  margin-right: 20px;
}
.msg-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f56c6c;
  margin-right: 6px;
  flex-shrink: 0;
}
.go-link {
  margin-left: 8px;
  font-size: 12px;
  font-weight: normal;
  color: #409eff;
}
.msg-content {
  margin-top: 6px;
  font-size: 14px;
  color: #606266;
  line-height: 22px;
}
.msg-time {
  font-size: 12px;
  color: #c0c4cc;
  white-space: nowrap;
}
</style>
