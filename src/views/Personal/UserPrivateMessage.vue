<template>
  <div class="message-container">
    <el-card class="conversation-card">
      <template #header>
        <div class="conversation-header">
          <span>私信</span>
          <el-button size="small" type="primary" @click="newChatVisible = true">
            发起私信
          </el-button>
        </div>
      </template>
      <div class="conversation-list">
        <div
          v-for="c in conversations"
          :key="c.userId"
          class="conversation-item"
          :class="{ active: c.userId === currentUserId }"
          @click="openConversation(c)"
        >
          <el-avatar :size="36" :src="c.avatar" />
          <div class="conversation-info">
            <div class="conversation-name">{{ c.username }}</div>
            <div class="conversation-last">{{ c.last_content }}</div>
          </div>
          <el-badge
            v-if="(c.unread ?? 0) > 0"
            :value="c.unread ?? 0"
            :max="99"
          />
        </div>
      </div>
      <el-empty
        v-if="!conversations.length"
        :image-size="120"
        description="暂无私信"
      />
    </el-card>

    <el-card class="chat-card">
      <template #header>
        <span>{{ currentUser?.username || '请选择会话' }}</span>
      </template>
      <div ref="chatListRef" class="chat-list">
        <div
          v-for="m in messages"
          :key="m.id"
          class="chat-item"
          :class="m.from_user_id === myId ? 'mine' : ''"
        >
          <div class="chat-content">{{ m.content }}</div>
          <div class="chat-time">{{ transitionTime(m.ctime) }}</div>
        </div>
        <el-empty
          v-if="!messages.length && currentUser"
          :image-size="80"
          description="开始聊天吧"
        />
      </div>
      <div class="chat-input">
        <el-input
          v-model="inputContent"
          placeholder="输入消息，回车发送"
          @keyup.enter="doSend"
        />
        <el-button type="primary" :disabled="!currentUser" @click="doSend">
          发送
        </el-button>
      </div>
    </el-card>

    <el-dialog v-model="newChatVisible" title="发起私信" width="420px">
      <el-form label-width="70px">
        <el-form-item label="用户名" required>
          <el-input v-model="searchName" placeholder="输入对方用户名" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input
            v-model="newContent"
            type="textarea"
            :rows="3"
            placeholder="请输入消息内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="newChatVisible = false">取消</el-button>
        <el-button type="primary" @click="doNewChat">发送</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesRead,
  getUserInfo,
} from '@/services';
import { transitionTime } from '@/utils';
import type { IConversation, IPrivateMessage } from '@/types';

const store = useStore();
const myId = store.state.userData.userId as number;
const conversations = ref<IConversation[]>([]);
const messages = ref<IPrivateMessage[]>([]);
const currentUser = ref<IConversation | null>(null);
const currentUserId = ref<number | null>(null);
const inputContent = ref('');
const chatListRef = ref<HTMLElement>();
const newChatVisible = ref(false);
const searchName = ref('');
const newContent = ref('');

const loadConversations = async () => {
  conversations.value = (await getConversations()) ?? [];
};

const scrollToBottom = async () => {
  await nextTick();
  chatListRef.value?.scrollTo({ top: chatListRef.value.scrollHeight });
};

const openConversation = async (c: IConversation) => {
  currentUser.value = c;
  currentUserId.value = c.userId;
  messages.value = (await getMessages({ withUserId: c.userId })) ?? [];
  if (c.unread && c.unread > 0) {
    await markMessagesRead({ withUserId: c.userId });
    c.unread = 0;
  }
  scrollToBottom();
};

const doSend = async () => {
  const text = inputContent.value.trim();
  if (!text || !currentUserId.value) return;
  await sendMessage({ toUserId: currentUserId.value, content: text });
  inputContent.value = '';
  messages.value =
    (await getMessages({ withUserId: currentUserId.value })) ?? [];
  loadConversations();
  scrollToBottom();
};

const doNewChat = async () => {
  const name = searchName.value.trim();
  const text = newContent.value.trim();
  if (!name || !text) {
    ElMessage.warning('请填写用户名和内容');
    return;
  }
  try {
    const target = await getUserInfo({ username: name });
    if (!target?.userId) {
      ElMessage.warning('用户不存在');
      return;
    }
    if (target.userId === myId) {
      ElMessage.warning('不能给自己发私信');
      return;
    }
    await sendMessage({ toUserId: target.userId, content: text });
    ElMessage.success('发送成功');
    newChatVisible.value = false;
    searchName.value = '';
    newContent.value = '';
    loadConversations();
  } catch {
    // 错误已由拦截器提示
  }
};

onMounted(() => {
  loadConversations();
});
</script>

<style scoped>
.message-container {
  display: flex;
  gap: 16px;
  width: 100%;
}
.conversation-card {
  width: 280px;
  flex-shrink: 0;
}
.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.conversation-list {
  max-height: 500px;
  overflow-y: auto;
}
.conversation-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  cursor: pointer;
  border-radius: 6px;
}
.conversation-item:hover,
.conversation-item.active {
  background-color: #f5f7fa;
}
.conversation-info {
  flex: 1;
  min-width: 0;
}
.conversation-name {
  font-weight: 600;
}
.conversation-last {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.chat-list {
  height: 420px;
  overflow-y: auto;
  padding: 8px;
}
.chat-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.chat-item.mine {
  align-items: flex-end;
}
.chat-item.mine .chat-content {
  background-color: #409eff;
  color: #fff;
}
.chat-content {
  display: inline-block;
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f0f2f5;
  word-break: break-word;
}
.chat-time {
  margin-top: 4px;
  font-size: 12px;
  color: #c0c4cc;
}
.chat-input {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
</style>
