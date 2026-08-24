<template>
  <div ref="rootRef" class="comment-node">
    <div
      :id="`comment-${comment.id}`"
      :class="[
        'comment-item',
        isChild ? 'child-comment' : '',
        currentDepth >= MAX_DEPTH ? 'deep-reply' : '',
        comment.id === highlightId ? 'highlighted' : '',
      ]"
    >
      <el-avatar :size="isChild ? 28 : 32" :src="comment.avatar" />
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-user" @click="goProfile">{{
            comment.username
          }}</span>
          <span class="comment-time">{{
            transitionTime(comment.create_time)
          }}</span>
        </div>
        <div class="comment-content">
          <div
            v-if="comment.reply_to_content"
            class="reply-quote"
            title="点击定位到被回复的评论"
            @click="locateParent"
          >
            回复 @{{ comment.reply_username }}：{{ comment.reply_to_content }}
          </div>
          <div class="comment-text">{{ comment.content }}</div>
          <div v-if="imageList.length" class="comment-images">
            <el-image
              v-for="img in imageList"
              :key="img"
              :src="img"
              :preview-src-list="imageList"
              fit="cover"
              class="comment-image"
            />
          </div>
        </div>
        <div class="comment-actions">
          <el-button
            link
            size="small"
            :type="liked ? 'warning' : 'primary'"
            @click="toggleLike"
          >
            {{ liked ? '已赞' : '赞' }}
            <span v-if="likeCount">{{ likeCount }}</span>
          </el-button>
          <el-button link type="primary" size="small" @click="toggleReply">
            回复
          </el-button>
        </div>
      </div>
    </div>

    <!-- 当前位置的内联回复输入框 -->
    <div v-if="showReplyInput" class="reply-input">
      <el-input
        v-model="replyInput"
        type="textarea"
        :rows="2"
        maxlength="200"
        show-word-limit
        :placeholder="`回复 @${comment.username}...`"
      />
      <div v-if="replyImages.length" class="reply-images">
        <el-image
          v-for="img in replyImages"
          :key="img"
          :src="img"
          fit="cover"
          class="reply-image"
        />
      </div>
      <div class="reply-input-actions">
        <el-button
          type="primary"
          size="small"
          :disabled="!replyInput.trim() && replyImages.length === 0"
          @click="submitReply"
          >回复</el-button
        >
        <el-button size="small" @click="pickImage">图片</el-button>
        <el-button size="small" @click="cancelReply">取消</el-button>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onPickImage"
        />
      </div>
    </div>

    <!-- 子回复：默认折叠显示前 N 条；限制缩进层级，过深不再向右缩 -->
    <div
      v-if="visibleChildren.length"
      class="children-container"
      :style="{ marginLeft: currentDepth < MAX_DEPTH ? '40px' : '0' }"
    >
      <CommentItem
        v-for="child in visibleChildren"
        :key="child.id"
        :comment="child"
        :question-id="questionId"
        :highlight-id="highlightId"
        :expand-all="expandAll"
        :depth="currentDepth + 1"
        is-child
        @expand="(item) => emit('expand', item)"
        @refresh="emit('refresh')"
        @clear-highlight="emit('clearHighlight')"
        @locate="(id) => emit('locate', id)"
      />
    </div>
    <el-button
      v-if="!expandAll && hiddenCount > 0"
      link
      type="primary"
      size="small"
      class="expand-btn"
      @click="emit('expand', comment)"
    >
      展开全部 {{ totalReplies }} 条回复
    </el-button>
  </div>
</template>

<script lang="ts">
// 显式声明组件名，保证递归自引用在 HMR 下稳定
export default { name: 'CommentItem' };
</script>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { transitionTime } from '@/utils';
import {
  addComment,
  likeComment,
  unlikeComment,
  uploadImage,
} from '@/services';
import type { IComment } from '@/types';
import router from '@/router';

const props = defineProps<{
  comment: IComment;
  questionId: number;
  highlightId?: number | null;
  isChild?: boolean;
  expandAll?: boolean;
  depth?: number;
}>();

// 当前层级（0 为顶层评论）
const currentDepth = computed(() => props.depth ?? 0);
// 最多缩进的层级（超过后子回复不再向右缩进）
const MAX_DEPTH = 2;

const emit = defineEmits<{
  (e: 'expand', item: IComment): void;
  (e: 'refresh'): void;
  (e: 'clearHighlight'): void;
  (e: 'locate', id: number): void;
}>();

// 默认展示的直接子回复数量
const MAX_VISIBLE = 2;

const visibleChildren = computed(() => {
  const children = props.comment.children ?? [];
  if (props.expandAll) return children;
  return children.slice(0, MAX_VISIBLE);
});

// 统计该评论下所有后代回复数量（含嵌套），用于「展开全部 N 条回复」的准确计数
const countDescendants = (node: IComment): number => {
  let count = 0;
  for (const child of node.children ?? []) {
    count += 1 + countDescendants(child);
  }
  return count;
};

const totalReplies = computed(() => countDescendants(props.comment));

// 直接子回复被折叠的数量（超过 MAX_VISIBLE 的部分）
const hiddenCount = computed(() => {
  const total = props.comment.children?.length ?? 0;
  return Math.max(0, total - MAX_VISIBLE);
});

// 根节点引用，用于点击「回复 @xxx」时定位到被回复的评论
const rootRef = ref<HTMLElement | null>(null);

// 点击引用块：滚动到被回复的父评论并高亮
const locateParent = () => {
  const parentId = props.comment.parent_id;
  if (!parentId) return;
  // 子回复的 .comment-node 上两级即父评论的 .comment-node（中间隔着 .children-container）
  const container = rootRef.value?.parentElement;
  const parentNode = container?.parentElement;
  const target = parentNode?.querySelector<HTMLElement>('.comment-item');
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  emit('locate', parentId);
};

// 内联回复输入框
const showReplyInput = ref(false);
const replyInput = ref('');
const replyImages = ref<string[]>([]);
const fileInputRef = ref<HTMLInputElement>();

const toggleReply = () => {
  showReplyInput.value = !showReplyInput.value;
  if (showReplyInput.value) {
    replyInput.value = '';
    replyImages.value = [];
  }
};

const pickImage = () => {
  fileInputRef.value?.click();
};

const onPickImage = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const url = await uploadImage(file, 'comment');
    replyImages.value = [...replyImages.value, url];
  } catch (err) {
    ElMessage.error((err as Error)?.message || '图片上传失败');
  } finally {
    input.value = '';
  }
};

// 点击用户名进入其主页
const goProfile = () => {
  if (props.comment.user_id) {
    router.push({
      path: '/userProfile',
      query: { id: props.comment.user_id },
    });
  }
};

// 点赞状态（本地维护，不直接修改 prop）
const liked = ref(props.comment.is_liked === 1);
const likeCount = ref(props.comment.like_count ?? 0);
// 评论图片
const imageList = computed(() => {
  try {
    const parsed = JSON.parse(props.comment.images || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

// 点赞/取消点赞评论
const toggleLike = async () => {
  if (liked.value) {
    await unlikeComment({ commentId: props.comment.id });
  } else {
    await likeComment({ commentId: props.comment.id });
  }
  liked.value = !liked.value;
  likeCount.value += liked.value ? 1 : -1;
};

const submitReply = async () => {
  if (!replyInput.value.trim() && replyImages.value.length === 0) return;
  await addComment({
    content: replyInput.value,
    questionId: props.questionId,
    parentId: props.comment.id,
    replyUsername: props.comment.username,
    images: replyImages.value,
  });
  ElMessage.success('回复成功');
  replyInput.value = '';
  replyImages.value = [];
  showReplyInput.value = false;
  emit('refresh');
  emit('clearHighlight');
};

const cancelReply = () => {
  showReplyInput.value = false;
  replyInput.value = '';
  replyImages.value = [];
};
</script>

<style scoped>
.comment-node {
  width: 100%;
  min-width: 300px;
}

.comment-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.child-comment {
  padding-left: 8px;
  background-color: #fafafa;
  border-radius: 4px;
}

.deep-reply {
  border-left: 2px solid #d9ecff;
  padding-left: 10px;
  padding-right: 15px;
  background-color: #f7fbff;
}

.comment-item.highlighted {
  background-color: #fff7e6;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  transition: background-color 0.3s;
}

.reply-input {
  margin: 8px 0 8px 44px;
}

.reply-input-actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}
.reply-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.reply-image {
  width: 70px;
  height: 70px;
  border-radius: 6px;
}

.children-container {
  /* 缩进由 :style 根据层级动态控制（限制最大缩进） */
}

.expand-btn {
  margin-left: 40px;
  margin-top: 4px;
}

.comment-body {
  margin-left: 12px;
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-user {
  font-weight: 600;
  color: #384548;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.reply-mark {
  color: #409eff;
  font-weight: 600;
}

.reply-quote {
  margin-bottom: 6px;
  padding: 6px 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #909399;
  font-size: 13px;
  line-height: 20px;
  word-break: break-word;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.reply-quote:hover {
  background-color: #eef4ff;
  color: #409eff;
}

.comment-text {
  font-size: 15px;
  line-height: 22px;
  color: #333;
  word-break: break-word;
}

.comment-content {
  margin-top: 6px;
}
.comment-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}
.comment-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.comment-image {
  width: 90px;
  height: 90px;
  border-radius: 6px;
}
</style>
