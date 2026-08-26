<template>
  <div class="comments-list">
    <h1>用户评论列表</h1>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="评论列表" name="normal">
        <div v-loading="loading">
          <el-collapse v-if="groups.length" v-model="activeGroups">
            <el-collapse-item
              v-for="group in pagedGroups"
              :key="group.question_id"
              :name="group.question_id"
            >
              <template #title>
                <div class="group-title">
                  <span class="group-question">{{ group.question_title }}</span>
                  <el-tag
                    v-if="pendingCount(group) > 0"
                    size="small"
                    type="warning"
                    >{{ pendingCount(group) }} 条待审核</el-tag
                  >
                  <el-tag size="small" type="info"
                    >{{ group.comments.length }} 条</el-tag
                  >
                </div>
              </template>
              <el-table
                :data="group.comments"
                style="width: 100%"
                :row-class-name="rowClassName"
              >
                <el-table-column prop="id" label="ID" width="70" />
                <el-table-column prop="username" label="用户" width="140">
                  <template #default="scope">
                    <div class="user-cell">
                      <el-avatar :size="24" :src="scope.row.avatar" />
                      <span style="margin-left: 6px">{{
                        scope.row.username
                      }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="评论内容" min-width="280">
                  <template #default="scope">
                    <div
                      v-if="scope.row.reply_to_content"
                      class="reply-quote"
                      title="点击定位到被回复的评论"
                      @click="locateParent(scope.row)"
                    >
                      回复 @{{ scope.row.reply_username }}：{{
                        scope.row.reply_to_content
                      }}
                    </div>
                    <div class="comment-text">{{ scope.row.content }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="类型" width="90" align="center">
                  <template #default="scope">
                    <el-tag v-if="scope.row.parent_id" size="small" type="info"
                      >回复</el-tag
                    >
                    <el-tag v-else size="small" type="primary">评论</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                  <template #default="scope">
                    <el-tag
                      v-if="scope.row.status === 0"
                      size="small"
                      type="warning"
                      >待审核</el-tag
                    >
                    <el-tag v-else size="small" type="success">已通过</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="评论时间" width="170">
                  <template #default="scope">
                    {{ transitionTime(scope.row.create_time) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="230">
                  <template #default="scope">
                    <el-button
                      v-if="scope.row.status === 0"
                      size="small"
                      type="success"
                      @click="handleApprove(scope.row)"
                      >通过</el-button
                    >
                    <el-button
                      v-if="!scope.row.parent_id"
                      size="small"
                      :type="scope.row.is_pinned ? 'warning' : 'info'"
                      @click="handlePin(scope.row)"
                      >{{
                        scope.row.is_pinned ? '取消置顶' : '置顶'
                      }}</el-button
                    >
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <el-empty
            v-if="!loading && groups.length === 0"
            :image-size="200"
            description="暂无评论数据"
          />
          <el-pagination
            v-if="groups.length > groupPageSize"
            v-model:current-page="groupPage"
            background
            layout="slot, prev, pager, next"
            :total="groups.length"
            :page-size="groupPageSize"
            prev-text="上一页"
            next-text="下一页"
            style="margin-top: 12px; justify-content: flex-end"
            @current-change="handleGroupPageChange"
          >
            <template #default> 共 {{ groups.length }} 组 </template>
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已删除评论" name="deleted">
        <el-table
          v-loading="deletedLoading"
          :data="deletedComments"
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="70" />
          <el-table-column prop="username" label="用户" width="140">
            <template #default="scope">
              <div class="user-cell">
                <el-avatar :size="24" :src="scope.row.avatar" />
                <span style="margin-left: 6px">{{ scope.row.username }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="评论内容" min-width="280">
            <template #default="scope">
              <div class="comment-text">{{ scope.row.content }}</div>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="90" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.parent_id" size="small" type="info"
                >回复</el-tag
              >
              <el-tag v-else size="small" type="primary">评论</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="评论时间" width="170">
            <template #default="scope">
              {{ transitionTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <el-button
                size="small"
                type="success"
                @click="handleRestore(scope.row)"
                >恢复</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-empty
          v-if="!deletedLoading && deletedComments.length === 0"
          :image-size="200"
          description="没有已删除的评论"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getCommentList,
  deleteComment,
  approveComment,
  pinComment,
  getDeletedComments,
  restoreComment,
} from '@/services';
import { transitionTime } from '@/utils';
import type { IComment } from '@/types';

interface CommentGroup {
  question_id: number;
  question_title: string;
  comments: IComment[];
}

const groups = ref<CommentGroup[]>([]);
const loading = ref(true);
// 折叠面板当前展开的题目ID（默认全部展开）
const activeGroups = ref<number[]>([]);
// 点击「回复 @xxx」后需要高亮定位到的父评论行
const highlightRowId = ref<number | null>(null);
// 分组分页（按题目分组分页）
const groupPage = ref(1);
const groupPageSize = 10;
// 已删除评论（恢复用）
const activeTab = ref('normal');
const deletedComments = ref<IComment[]>([]);
const deletedLoading = ref(false);
const pagedGroups = computed(() => {
  const start = (groupPage.value - 1) * groupPageSize;
  return groups.value.slice(start, start + groupPageSize);
});

const rowClassName = ({ row }: { row: IComment }) => {
  return row.id === highlightRowId.value ? 'highlight-row' : '';
};

// 点击回复的引用块：高亮并滚动到被回复的父评论行
const locateParent = (row: { parent_id?: number }) => {
  if (!row.parent_id) return;
  highlightRowId.value = row.parent_id;
  nextTick(() => {
    const el = document.querySelector('.highlight-row');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
};

// 取评论所属题目ID（用于分组）
const getQid = (row: IComment): number => {
  return (row as { question_id?: number }).question_id ?? 0;
};

// 把一个评论节点及其所有后代平铺进数组
const flattenOne = (node: IComment, out: IComment[]) => {
  out.push(node);
  node.children?.forEach((child) => flattenOne(child, out));
};

// 某分组下待审核的评论数
const pendingCount = (group: CommentGroup): number => {
  return group.comments.filter((c) => c.status === 0).length;
};

const getComments = async () => {
  loading.value = true;
  // 管理端展示全部评论：按题目分组，每个题目一个折叠面板
  const res = await getCommentList({ currentPage: 1, pageSize: 9999 });
  const roots = res?.result ?? [];
  const map = new Map<number, CommentGroup>();
  roots.forEach((root) => {
    const qid = getQid(root);
    if (!map.has(qid)) {
      map.set(qid, {
        question_id: qid,
        question_title: root.question_title || '（题目已删除）',
        comments: [],
      });
    }
    flattenOne(root, map.get(qid)!.comments);
  });
  groups.value = Array.from(map.values());
  activeGroups.value = groups.value.map((g) => g.question_id);
  highlightRowId.value = null;
  loading.value = false;
};

const handleGroupPageChange = (page: number) => {
  groupPage.value = page;
  document.documentElement.scrollTop = 0;
};

const handleApprove = (row: { id?: number }) => {
  if (!row.id) return;
  approveComment({ id: row.id }).then(() => {
    ElMessage.success('已通过');
    getComments();
  });
};

const handlePin = (row: { id?: number; is_pinned?: number }) => {
  if (!row.id) return;
  const pinned = row.is_pinned === 1;
  pinComment({ id: row.id, pinned: !pinned }).then(() => {
    ElMessage.success(pinned ? '已取消置顶' : '已置顶');
    getComments();
  });
};

const handleDelete = (row: { id?: number }) => {
  if (!row.id) return;
  ElMessageBox.confirm('确定删除该评论吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteComment({ id: row.id as number }).then(() => {
      ElMessage.success('删除成功');
      getComments();
    });
  });
};

const getDeletedCommentList = async () => {
  deletedLoading.value = true;
  deletedComments.value = (await getDeletedComments()) ?? [];
  deletedLoading.value = false;
};

const handleRestore = (row: { id?: number }) => {
  if (!row.id) return;
  restoreComment({ id: row.id }).then(() => {
    ElMessage.success('已恢复');
    getDeletedCommentList();
    getComments();
  });
};

const handleTabChange = (name: string | number) => {
  if (name === 'deleted') {
    getDeletedCommentList();
  }
};

onMounted(() => {
  getComments();
});
</script>

<style scoped>
.comments-list {
  width: 100%;
  padding: 20px;
}

.user-cell {
  display: flex;
  align-items: center;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-question {
  font-weight: 600;
  color: #384548;
  max-width: 520px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reply-quote {
  margin-bottom: 4px;
  padding: 4px 8px;
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
  word-break: break-word;
}

:deep(.el-collapse-item__header) {
  font-size: 15px;
  padding: 4px 0;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 4px;
}

:deep(.highlight-row td) {
  background-color: #fff7e6 !important;
  transition: background-color 0.3s;
}
</style>
