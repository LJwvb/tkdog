<template>
  <el-button class="return" @click="returnToBefore">
    <el-icon><ArrowLeftBold /></el-icon>
    返回
  </el-button>
  <div v-loading="loading" class="info-container">
    <!-- 题目详情 -->
    <el-card class="container">
      <div class="grid-content">
        <div class="title-box">
          <div :class="difficultyClass(questionDetail.difficulty)">
            {{ degreeDifficulty }}
          </div>
          <div class="question-type">{{ type }}</div>
        </div>
        <div class="btn-box">
          <div v-if="!isReadonly" class="like">
            <div v-if="!isClickLike" class="text">点赞</div>
            <el-button text link @click="like">
              <div v-if="!isClickLike">
                <el-icon size="25"><Star /> </el-icon>
              </div>
              <div v-else>
                <el-icon size="28" color="#f7ba2a"> <StarFilled /> </el-icon>
              </div>
            </el-button>
          </div>
          <div v-if="!isReadonly" class="like">
            <div class="text">{{ isFavorite ? '已收藏' : '收藏' }}</div>
            <el-button text link @click="toggleFavorite">
              <el-icon size="25" :color="isFavorite ? '#f7ba2a' : ''">
                <Collection />
              </el-icon>
            </el-button>
          </div>
          <el-button
            type="primary"
            class="btn"
            :disabled="isReadonly || isChecked"
            @click="selectedTopic"
            >{{
              isReadonly ? '仅查看' : isChecked ? '已选题' : '选题'
            }}</el-button
          >
        </div>
        <el-tag v-for="tag in tags" :key="tag" class="tag-item">
          {{ tag }}
        </el-tag>
        <div>
          <h4>题目</h4>
          <div class="question">
            {{ questionDetail.question }}
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="isDetailType"
            class="question-detail"
            v-html="questionDetail.questionDetail"
          />
          <!-- eslint-enable vue/no-v-html -->
          <div v-else-if="isChoiceType" class="single-choice">
            <div v-for="(option, index) in questionOptions" :key="index">
              <div class="option">
                <div class="option-code">{{ option.code }}:</div>
                <div class="option-value">{{ option.value }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="answer-section">
          <div class="answer-header" @click="toggleAnswer">
            <span class="answer-title">答案与解析</span>
            <el-icon>
              <ArrowUpBold v-if="answerOpen" />
              <ArrowDownBold v-else />
            </el-icon>
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-show="answerOpen"
            class="answer"
            v-html="
              formatAnswerWithValues(
                questionDetail.questionType,
                questionDetail.answer,
                questionDetail.questionDetail,
              )
            "
          />
          <!-- eslint-enable vue/no-v-html -->
        </div>
        <!-- 评论区 -->
        <div class="comment-section">
          <h4>讨论</h4>
          <div v-if="isReadonly" class="readonly-tip">
            该题目未通过审核，仅支持查看，暂不支持评论
          </div>
          <template v-else>
            <div class="comment-input">
              <div
                class="comment-editor"
                @paste="onPasteCommentImages"
                @drop.prevent="onDropCommentImages"
                @dragover.prevent
              >
                <el-input
                  ref="commentTextareaRef"
                  v-model="commentContent"
                  type="textarea"
                  :rows="3"
                  maxlength="200"
                  show-word-limit
                  placeholder="说说你对这道题的看法...（支持直接粘贴或拖拽图片）"
                />
                <div
                  v-if="commentImages.length || commentPending > 0"
                  class="comment-images"
                >
                  <div
                    v-for="(img, idx) in commentImages"
                    :key="img"
                    class="comment-image-item"
                  >
                    <el-image
                      :src="img"
                      fit="cover"
                      class="comment-image"
                    />
                    <el-icon
                      class="comment-image-remove"
                      @click="removeCommentImage(idx)"
                    >
                      <CircleCloseFilled />
                    </el-icon>
                  </div>
                  <div
                    v-if="commentPending > 0"
                    class="comment-image-item comment-image-pending"
                  >
                    <el-icon class="is-loading">
                      <Loading />
                    </el-icon>
                  </div>
                </div>
                <div class="comment-toolbar">
                  <div class="comment-toolbar-left">
                    <el-tooltip content="添加图片">
                      <el-button text circle @click="pickCommentImage">
                        <el-icon size="18"><Picture /></el-icon>
                      </el-button>
                    </el-tooltip>
                    <el-popover
                      trigger="click"
                      :width="300"
                      placement="top-start"
                    >
                      <template #reference>
                        <el-button
                          text
                          circle
                          class="emoji-btn"
                          aria-label="插入表情"
                        >
                          😊
                        </el-button>
                      </template>
                      <div class="emoji-panel">
                        <button
                          v-for="e in EMOJIS"
                          :key="e"
                          type="button"
                          class="emoji-item"
                          @click="insertEmoji(e)"
                        >
                          {{ e }}
                        </button>
                      </div>
                    </el-popover>
                  </div>
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="commentPending > 0"
                    @click="submitComment"
                    >发表评论</el-button
                  >
                  <input
                    ref="commentFileRef"
                    type="file"
                    accept="image/*"
                    multiple
                    style="display: none"
                    @change="onPickCommentImage"
                  />
                </div>
              </div>
            </div>
            <div v-if="commentTree.length" class="comment-list">
              <CommentItem
                v-for="root in commentTree"
                :key="root.id"
                :comment="root"
                :question-id="Number(id)"
                :highlight-id="highlightCommentId"
                @refresh="getComments"
                @clear-highlight="clearHighlight"
                @expand="openReplyDetail"
                @locate="handleLocate"
              />
            </div>
            <el-empty v-else :image-size="80" description="暂无评论" />
            <el-pagination
              v-if="commentTotal > commentPageSize"
              v-model:current-page="commentPage"
              background
              layout="prev, pager, next"
              :total="commentTotal"
              :page-size="commentPageSize"
              :hide-on-single-page="true"
              @current-change="handleCommentPageChange"
            />
          </template>
        </div>
      </div>
    </el-card>
  </div>
  <div class="slide-container">
    <el-card style="margin-bottom: 20px">
      <div class="question-info">
        <h4>題目信息</h4>
        <div>浏览数：{{ questionDetail.browses_num }}</div>
        <div>发布时间：{{ addDate }}</div>
        <div class="creator">
          <div>上传者：</div>
          <div class="creator-info">
            <el-icon>
              <Avatar />
            </el-icon>
            <div style="margin-left: 5px">{{ questionDetail.creator }}</div>
          </div>
          <div class="allline"></div>
        </div>
        <div v-if="questionDetail.updateTime">
          最近修改：{{ questionDetail.updateUser || '未知' }} 于
          {{ updateTimeText }}
        </div>
        <div>
          题目获赞数：
          <span style="color: #f7ba2a">{{
            questionDetail.likes_num ?? 0
          }}</span>
        </div>
        <div>
          题目收藏数：
          <span style="color: #67c23a">{{
            questionDetail.favorite_num ?? 0
          }}</span>
        </div>
        <div>
          题目浏览数：
          <span style="color: #409eff">
            {{ questionDetail.browses_num ?? 0 }}</span
          >
        </div>
        <el-button
          v-if="store.state.userData.isAdmin"
          type="primary"
          plain
          @click="openEdit"
        >
          编辑题目
        </el-button>
        <el-button type="warning" plain @click="feedbackVisible = true">
          纠错反馈
        </el-button>
      </div>
    </el-card>
    <el-card>
      <h4>为你推荐</h4>
      <div v-if="similarQuestions?.length" class="similar-questions">
        <el-card
          v-for="item in similarQuestions"
          :key="item.id"
          class="similar-question"
        >
          <div class="similar-question-info">
            <div :class="difficultyClass(item.difficulty)">
              {{ difficulty(Number(item.difficulty)) }}
            </div>
            <div class="question-type">
              {{ questionType(Number(item.questionType)) }}
            </div>
          </div>
          <div class="similar-question-text">
            {{ item.question }}
          </div>
          <el-button type="primary" @click="goSimilarQuestion(item.id)"
            >查看</el-button
          >
        </el-card>
      </div>
      <div v-else>
        <el-empty description="暂无相似题目" />
      </div>
    </el-card>
  </div>

  <!-- 纠错反馈弹窗 -->
  <el-dialog v-model="feedbackVisible" title="纠错反馈" width="480px">
    <div class="feedback-tip">
      发现题目答案错误、题干不清或有错别字？欢迎反馈，我们会尽快处理。
    </div>
    <div class="feedback-type">
      <el-radio-group v-model="feedbackType">
        <el-radio label="error">题目错误</el-radio>
        <el-radio label="wrong_answer">答案错误</el-radio>
        <el-radio label="typo">错别字</el-radio>
      </el-radio-group>
    </div>
    <el-input
      v-model="feedbackContent"
      type="textarea"
      :rows="4"
      maxlength="300"
      show-word-limit
      placeholder="请描述问题..."
    />
    <template #footer>
      <el-button @click="feedbackVisible = false">取消</el-button>
      <el-button
        type="primary"
        :disabled="!feedbackContent.trim()"
        @click="submitFeedbackHandler"
      >
        提交
      </el-button>
    </template>
  </el-dialog>

  <!-- 编辑题目弹窗（管理员） -->
  <el-dialog v-model="editVisible" title="编辑题目" width="640px">
    <el-form label-width="80px">
      <el-form-item label="题干">
        <el-input v-model="editForm.question" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="难度">
        <el-radio-group v-model="editForm.difficulty">
          <el-radio label="0">简单</el-radio>
          <el-radio label="1">中等</el-radio>
          <el-radio label="2">困难</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="editForm.tags" placeholder="多个标签用逗号分隔" />
      </el-form-item>
      <el-form-item label="答案">
        <el-input v-model="editForm.answer" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>

  <!-- 回复详情弹窗（抖音式楼中楼，每条回复可在当前位置内联回复） -->
  <el-dialog
    v-model="replyDetailVisible"
    title="回复详情"
    width="640px"
    align-center
  >
    <div class="reply-detail">
      <div v-if="replyDetailComment" class="reply-detail-thread">
        <CommentItem
          :comment="replyDetailComment"
          :question-id="Number(id)"
          :highlight-id="highlightCommentId"
          expand-all
          @refresh="refreshReplyDetail"
          @clear-highlight="clearHighlight"
          @expand="openReplyDetail"
          @locate="handleLocate"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watchEffect, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import queryString from 'query-string';
import {
  ArrowLeftBold,
  Star,
  StarFilled,
  Avatar,
  ArrowUpBold,
  ArrowDownBold,
  Collection,
  Picture,
  CircleCloseFilled,
  Loading,
} from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import {
  getQuestionDetail,
  likeQuestion,
  unlikeQuestion,
  getSimilarQuestion,
  browseQuestion,
  addComment,
  getCommentList,
  submitFeedback,
  updateQuestion,
  favoriteQuestion,
  cancelFavoriteQuestion,
  getMyFavorites,
  uploadImage,
} from '@/services';
import {
  questionType,
  difficulty,
  transitionTime,
  firstQueryValue,
  formatAnswerWithValues,
} from '@/utils';
import type { IComment, IQuestion } from '@/types';
import router from '@/router';
import CommentItem from '@/components/CommentItem/index.vue';
const store = useStore();
const {
  id,
  type: whereInterType,
  isClickSearch,
  commentId,
} = queryString.parse(window?.location?.href?.split('?')[1] || '');

// 答案与解析：默认收起，点击标题展开/收起
const answerOpen = ref(false);
const toggleAnswer = () => {
  answerOpen.value = !answerOpen.value;
};

// 需要高亮定位的评论ID（从消息通知跳转带入）
const highlightCommentId = ref<number | null>(
  commentId ? Number(firstQueryValue(commentId)) : null,
);
// 取消高亮（回复后调用）
const clearHighlight = () => {
  highlightCommentId.value = null;
};
// 点击回复的「回复 @xxx」引用块：高亮被回复的父评论（滚动由 CommentItem 内完成）
const handleLocate = (id: number) => {
  highlightCommentId.value = id;
};

// 获取store中的用户信息
const userData = store.state.userData;
// 获取用户喜欢的题目id
const likeTopicsId = Array.isArray(userData?.likeTopicsId)
  ? userData?.likeTopicsId
  : userData?.likeTopicsId?.split(',') || [];
// 获取题目详情
const questionDetail = ref({} as IQuestion);
// 相似题目
const similarQuestions = ref<IQuestion[]>([]);
// 是否点击了喜欢
const isClickLike = ref(false);
const isChecked = ref(false);
const loading = ref(true);
// 是否已收藏
const isFavorite = ref(false);
const toggleFavorite = () => {
  const qid = Number(id);
  const fn = isFavorite.value
    ? cancelFavoriteQuestion({ questionId: qid })
    : favoriteQuestion({ questionId: qid });
  fn.then(() => {
    isFavorite.value = !isFavorite.value;
    // 同步更新详情页收藏数
    const fav = Number(questionDetail.value.favorite_num) || 0;
    questionDetail.value.favorite_num = isFavorite.value
      ? fav + 1
      : Math.max(fav - 1, 0);
    ElMessage.success(isFavorite.value ? '收藏成功' : '已取消收藏');
  });
};
// 未审核 / 审核不通过的题目只读：不允许点赞、选题、评论等操作
const isReadonly = computed(() => Number(questionDetail.value.chkState) !== 1);
const tags = computed(() => {
  const rawTags = questionDetail.value.tags;
  if (Array.isArray(rawTags)) {
    return rawTags.filter((item: string) => item !== '');
  }
  return rawTags?.split(',').filter((item: string) => item !== '');
});
const type = computed(() => {
  return questionType(Number(questionDetail.value.questionType));
});
const degreeDifficulty = computed(() => {
  return difficulty(Number(questionDetail.value.difficulty));
});
// 难度标签配色：简单绿、中等橙、困难红（与答题页保持一致）
const difficultyClass = (difficulty: number | string) => {
  const d = Number(difficulty);
  if (d === 2) return 'degreeDifficulty hard';
  if (d === 1) return 'degreeDifficulty medium';
  return 'degreeDifficulty easy';
};
// 题型展示分类：主观/富文本（3、4）与客观选项（0 单选、1 多选、2 判断）
const qt = computed(() => String(questionDetail.value.questionType));
const isDetailType = computed(() => ['3', '4'].includes(qt.value));
const isChoiceType = computed(() => ['0', '1', '2'].includes(qt.value));
// 客观题选项（安全解析，避免 questionDetail 为空/非法 JSON 时报错）
const questionOptions = computed(() => {
  if (!isChoiceType.value) return [];
  try {
    const parsed = JSON.parse(questionDetail.value.questionDetail || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

const addDate = computed(() => {
  return transitionTime(questionDetail.value.addDate);
});
const updateTimeText = computed(() => {
  return questionDetail.value.updateTime
    ? transitionTime(questionDetail.value.updateTime)
    : '';
});
// 记录浏览：仅审核通过的题目且本次会话未浏览过才 +1，并同步更新详情页展示
const recordBrowse = (qid: number) => {
  const detail = questionDetail.value;
  if (!detail || Number(detail.chkState) !== 1) return;
  const browsed = store.state.browseTopicsId;
  if (browsed.includes(qid)) return;
  store.commit('setBrowseTopicsId', [...browsed, qid]);
  browseQuestion({ id: qid, username: store.state.userData.username });
  detail.browses_num = (Number(detail.browses_num) || 0) + 1;
};

// 获取题目详情
const getDailyQuestion = async (value?: number) => {
  // 判断喜欢的题目中是否包含当前题目id
  if (likeTopicsId?.includes(value || id)) {
    isClickLike.value = true;
  } else {
    isClickLike.value = false;
  }
  getQuestionDetail({ id: value ?? Number(id) })
    .then((res) => {
      questionDetail.value = res;
      // 浏览记录统一在详情加载完成后处理，避免与详情接口并发导致浏览数少算
      recordBrowse(value ?? Number(id));
    })
    .finally(() => {
      loading.value = false;
    });
};
// 获取相似题目
const getSimilarQuestions = async (value?: number) => {
  const res = await getSimilarQuestion({
    id: value || Number(id),
  });
  similarQuestions.value = res;
};
// 点赞
const like = () => {
  if (isClickLike.value) {
    unlikeQuestion({
      id: questionDetail.value.id,
      creator: questionDetail.value.creator,
      username: store.state.userData.username,
      userId: store.state.userData.userId as number,
    }).then(() => {
      ElMessage({
        message: '取消点赞',
        type: 'warning',
      });
      isClickLike.value = false;
      // 同步更新详情页获赞数
      questionDetail.value.likes_num = Math.max(
        (Number(questionDetail.value.likes_num) || 0) - 1,
        0,
      );
      // 删除喜欢的题目id
      likeTopicsId.splice(
        likeTopicsId.indexOf(String(questionDetail.value.id)),
        1,
      );
      store.commit('setUserData', {
        ...userData,
        likeTopicsId,
      });
    });
  } else {
    likeQuestion({
      id: questionDetail.value.id,
      creator: questionDetail.value.creator,
      username: store.state.userData.username,
      userId: store.state.userData.userId as number,
    }).then(() => {
      ElMessage({
        message: '点赞成功',
        type: 'success',
      });
      isClickLike.value = true;
      // 同步更新详情页获赞数
      questionDetail.value.likes_num =
        (Number(questionDetail.value.likes_num) || 0) + 1;
      // 添加喜欢的题目id
      likeTopicsId.push(String(questionDetail.value.id));
      store.commit('setUserData', {
        ...userData,
        likeTopicsId,
      });
    });
  }
};
const selectedTopic = () => {
  // 获取之前选中的题目
  const selectedTopic = store.state.selectedTopic;
  // 获取之前选中的题目id
  const selectedTopicIds = selectedTopic.map((item: IQuestion) => item.id);
  if (selectedTopicIds.includes(questionDetail.value.id)) {
    ElMessage.error('已选中该题，若想取消请在试题篮已选题目中取消');
    return;
  } else {
    const data = {
      id: questionDetail.value.id,
      questionType: questionDetail.value.questionType,
      difficulty: questionDetail.value.difficulty,
      question: questionDetail.value.question,
      data: new Date().toLocaleString(),
    };
    store.commit('addSelectedTopic', [...selectedTopic, data]);
    ElMessage.success('选题成功，请在试题篮已选题目中查看');
  }
};
const goSimilarQuestion = (id: number) => {
  router.push({ path: '/problemInfo', query: { id: id } });
  getDailyQuestion(id);
  getSimilarQuestions(id);
  // 切换题目后刷新评论，清空评论输入与高亮定位
  getComments(id);
  commentContent.value = '';
  highlightCommentId.value = null;
  const stateSelectedTopic = store.state.selectedTopic;
  // 获取之前选中的题目id
  const selectedTopicIds = stateSelectedTopic.map((item: IQuestion) => item.id);
  if (selectedTopicIds.includes(Number(id))) {
    isChecked.value = true;
  } else {
    isChecked.value = false;
  }
};
const returnToBefore = () => {
  if (store.state.userData?.isAdmin) {
    router.push({
      path: '/adminQuestion',
      query: {
        index: whereInterType,
      },
    });
    return;
  } else {
    if (whereInterType === 'all') {
      router.push({
        path: '/questionPage',
        query: {
          isClickSearch,
          subjectID: questionDetail.value.subjectID,
        },
      });
      return;
    }
    if (whereInterType === 'paper') {
      router.push({
        path: '/addPaper',
        query: {
          step: 1,
        },
      });
      return;
    }
    if (whereInterType === 'userLikes') {
      router.push({
        path: 'user/UserLikes',
      });
      return;
    }
    if (whereInterType === 'userHistory') {
      router.push({
        path: 'user/UserHistory',
      });
      return;
    }
    if (whereInterType === 'userQuestions') {
      router.push({
        path: 'user/UserQuestions',
      });
      return;
    }
    if (whereInterType === 'userWrong') {
      router.push({
        path: 'user/UserWrong',
      });
      return;
    }
    if (whereInterType === 'userFeedback') {
      router.push({
        path: 'user/UserFeedback',
      });
      return;
    }
    if (whereInterType === 'daily') {
      router.push({
        path: '/questionPage',
      });
      return;
    }
    router.push({
      path: '/',
      query: {
        subjectID: questionDetail.value.subjectID,
        catalogID: questionDetail.value.catalogID,
      },
    });
  }
};
// 评论（后端已返回树形结构，回复嵌套在 children 下；顶层评论分页）
const commentTree = ref<IComment[]>([]);
const commentContent = ref('');
const commentImages = ref<string[]>([]);
const commentPending = ref(0);
const commentFileRef = ref<HTMLInputElement>();
const commentTextareaRef = ref();
const commentPage = ref(1);
const commentTotal = ref(0);
const commentPageSize = 10;

const pickCommentImage = () => {
  commentFileRef.value?.click();
};

// 单条评论最多 9 张图（后端同样校验，前端提前提示）
const MAX_COMMENT_IMAGES = 9;
const isImageFile = (f: File) => {
  if (f.type && f.type.startsWith('image/')) return true;
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  return [ 'jpg', 'jpeg', 'png', 'gif', 'webp' ].includes(ext);
};
const addCommentImages = async (files: File[]) => {
  const imgs = files.filter(isImageFile);
  if (!imgs.length) return;
  const remain = MAX_COMMENT_IMAGES - commentImages.value.length;
  if (remain <= 0) {
    ElMessage.warning('每条评论最多上传 9 张图片');
    return;
  }
  if (imgs.length > remain) {
    ElMessage.warning(`最多还能上传 ${remain} 张图片`);
  }
  for (const file of imgs.slice(0, remain)) {
    commentPending.value += 1;
    try {
      const url = await uploadImage(file, 'comment');
      commentImages.value = [...commentImages.value, url];
    } catch (err) {
      ElMessage.error((err as Error)?.message || '图片上传失败');
    } finally {
      commentPending.value -= 1;
    }
  }
};
const onPickCommentImage = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];
  await addCommentImages(files);
  input.value = '';
};
// 直接粘贴截图/图片（知乎/微博/飞书等主流评论框均支持）
const onPasteCommentImages = (e: ClipboardEvent) => {
  const files = Array.from(e.clipboardData?.files || []);
  if (files.length) {
    e.preventDefault();
    addCommentImages(files);
  }
};
// 拖拽图片到输入框上传
const onDropCommentImages = (e: DragEvent) => {
  const files = Array.from(e.dataTransfer?.files || []);
  if (files.length) {
    addCommentImages(files);
  }
};
const removeCommentImage = (idx: number) => {
  const next = [...commentImages.value];
  next.splice(idx, 1);
  commentImages.value = next;
};

// 常用表情（点击插入到光标处）
const EMOJIS = [
  '😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😜',
  '🤔', '😅', '😭', '😤', '😴', '🥳', '🤯', '👀',
  '👍', '👎', '👏', '🙏', '❤️', '💔', '🔥', '🎉',
  '✨', '💯', '🐶', '🌹', '☕', '🍉',
];
const insertEmoji = (emoji: string) => {
  const textarea = commentTextareaRef.value?.$el?.querySelector?.(
    'textarea',
  ) as HTMLTextAreaElement | null;
  if (textarea && typeof textarea.selectionStart === 'number') {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = commentContent.value;
    commentContent.value = text.slice(0, start) + emoji + text.slice(end);
    nextTick(() => {
      textarea.focus();
      const pos = start + emoji.length;
      textarea.setSelectionRange(pos, pos);
    });
  } else {
    commentContent.value += emoji;
  }
};

const getComments = async (qid?: number) => {
  // 用户端只展示审核通过的评论（待审核评论管理员审核后才可见）
  const res = await getCommentList({
    questionId: qid ?? Number(id),
    onlyApproved: true,
    currentPage: commentPage.value,
    pageSize: commentPageSize,
    userId: store.state.userData?.userId,
  });
  commentTree.value = res?.result ?? [];
  commentTotal.value = res?.total ?? 0;
  // 从消息通知跳转过来时，滚动定位到对应评论
  if (highlightCommentId.value) {
    await nextTick();
    const el = document.getElementById(`comment-${highlightCommentId.value}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};
const handleCommentPageChange = (page: number) => {
  commentPage.value = page;
  getComments();
};
const submitComment = async () => {
  if (!commentContent.value.trim() && commentImages.value.length === 0) {
    ElMessage.warning('评论内容不能为空');
    return;
  }
  await addComment({
    content: commentContent.value,
    questionId: Number(id),
    images: commentImages.value,
  });
  ElMessage.success('评论成功');
  commentContent.value = '';
  commentImages.value = [];
  getComments();
};
// 回复详情弹窗（抖音式楼中楼）
const replyDetailVisible = ref(false);
const replyDetailComment = ref<IComment | null>(null);
const openReplyDetail = (item: IComment) => {
  replyDetailComment.value = item;
  replyDetailVisible.value = true;
};
// 刷新评论树，并同步详情弹窗里的评论内容
const refreshReplyDetail = async () => {
  await getComments();
  if (replyDetailComment.value) {
    const refreshed = findCommentById(
      commentTree.value,
      replyDetailComment.value.id,
    );
    if (refreshed) replyDetailComment.value = refreshed;
  }
};
// 在评论树中按 id 查找评论（用于详情弹窗刷新）
const findCommentById = (
  nodes: IComment[],
  targetId: number,
): IComment | null => {
  for (const n of nodes) {
    if (n.id === targetId) return n;
    if (n.children?.length) {
      const found = findCommentById(n.children, targetId);
      if (found) return found;
    }
  }
  return null;
};
// 纠错反馈
const feedbackVisible = ref(false);
const feedbackContent = ref('');
const feedbackType = ref('error');
const submitFeedbackHandler = async () => {
  if (!feedbackContent.value.trim()) {
    ElMessage.warning('请填写反馈内容');
    return;
  }
  await submitFeedback({
    questionId: Number(id),
    type: feedbackType.value,
    content: feedbackContent.value,
  });
  ElMessage.success('反馈已提交，感谢你的帮助');
  feedbackContent.value = '';
  feedbackType.value = 'error';
  feedbackVisible.value = false;
};
// 编辑题目（管理员）
const editVisible = ref(false);
const editForm = reactive({
  id: 0,
  question: '',
  answer: '',
  difficulty: '',
  tags: '',
});
const openEdit = () => {
  editForm.id = questionDetail.value.id;
  editForm.question = questionDetail.value.question;
  editForm.answer = questionDetail.value.answer;
  editForm.difficulty = String(questionDetail.value.difficulty ?? '');
  editForm.tags = Array.isArray(questionDetail.value.tags)
    ? questionDetail.value.tags.join(',')
    : questionDetail.value.tags || '';
  editVisible.value = true;
};
const saveEdit = async () => {
  if (!editForm.question.trim() || !editForm.answer.trim()) {
    ElMessage.warning('题干和答案不能为空');
    return;
  }
  await updateQuestion({
    id: editForm.id,
    question: editForm.question,
    answer: editForm.answer,
    difficulty: editForm.difficulty,
    tags: editForm.tags,
  });
  ElMessage.success('修改成功');
  editVisible.value = false;
  // 重新加载题目详情
  getDailyQuestion(editForm.id);
};
// 加载当前题目的收藏状态
const loadFavoriteStatus = async () => {
  if (!store.state.userData?.phone) return; // 未登录跳过收藏状态
  try {
    const favs = await getMyFavorites();
    isFavorite.value = (favs || []).some((q) => Number(q.id) === Number(id));
  } catch {
    // 未登录等情况忽略
  }
};
onMounted(() => {
  getDailyQuestion();
  getSimilarQuestions();
  getComments();
  loadFavoriteStatus();
});
watchEffect(() => {
  // 获取之前选中的题目
  const stateSelectedTopic = store.state.selectedTopic;
  // 获取之前选中的题目id
  const selectedTopicIds = stateSelectedTopic.map((item: IQuestion) => item.id);
  if (selectedTopicIds.includes(Number(id))) {
    isChecked.value = true;
  } else {
    isChecked.value = false;
  }
});
</script>

<style scoped>
.return {
  transform: translateX(-25%);
}
.grid-content {
  position: relative;
}
.info-container {
  width: 70%;
  position: relative;
}
.container {
}
.slide-container {
  width: 30%;
  margin-left: 20px;
}
.slide-container h4 {
  margin: 0;
}
.single-choice {
  margin-top: 20px;
  margin-bottom: 20px;
}
.option {
  display: flex;
  align-items: center;
}
.option-code {
  margin-right: 10px;
  font-size: 25px;
}
.option-value {
  font-size: 16px;
  color: #000000;
}
.btn-box {
  position: absolute;
  right: 0px;
  top: -10px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.like {
  display: flex;
  align-items: center;
  flex-direction: row;
  cursor: pointer;
  margin-bottom: 16px;
}
.text {
  font-size: 14px;
  color: #000000;
  margin-right: 5px;
}

.title-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.question-type {
  padding: 0px 12px;
  font-size: 12px;
  background-color: #f5f5f5;
  color: #000000;
  height: 25px;
  line-height: 25px;
  border-radius: 5px;
  width: 100px;
  text-align: center;
  margin-left: 20px;
}
.degreeDifficulty {
  padding: 0px 12px;
  font-size: 16px;
  color: #fff;
  height: 25px;
  text-align: center;
  border-radius: 5px;
  line-height: 25px;
}

.degreeDifficulty.easy {
  background-color: #67c23a;
}

.degreeDifficulty.medium {
  background-color: #e6a23c;
}

.degreeDifficulty.hard {
  background-color: #f56c6c;
}
.tag-item {
  margin-right: 5px;
  margin-bottom: 10px;
}
.question {
  margin-top: 20px;
  font-size: 35px;
  font-weight: 600;
}
.question-detail {
  margin-top: 20px;
  font-size: 20px;
  line-height: 30px;
}
.answer-section {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 4px;
}
.answer-header {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #409eff;
  user-select: none;
}
.answer-header:hover {
  color: #66b1ff;
}
.answer-title {
  font-weight: 600;
  font-size: 15px;
  color: inherit;
}
.answer {
  margin-top: 12px;
  padding: 14px 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  line-height: 1.8;
  color: #303133;
}
.answer::before {
  display: none;
  content: '';
  display: block;
  background: url(data:image/png;base64,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);
  height: 32px;
  width: 100%;
  background-size: 40px;
  background-repeat: no-repeat;
  background-color: #384548;
  margin-bottom: 10px;
  background-position: 4px 12px;
  border-radius: 5px;
}
.question-info {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.creator {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.creator-info {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.similar-questions {
  margin-top: 20px;
}
.similar-question {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.similar-question-info {
  display: flex;
  flex-direction: row;
}
.similar-question-text {
  font-size: 25px;
  color: #384548;
  padding: 10px 0;
}
:deep(.el-collapse) {
  border: none;
}
:deep(.el-collapse-item__header) {
  border: none;
}
:deep(.el-collapse-item__wrap) {
  border: none;
}
:deep(.el-collapse-item__content) {
  padding: 0;
}
.comment-section {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.readonly-tip {
  padding: 16px;
  background-color: #f5f7fa;
  color: #909399;
  border-radius: 4px;
  font-size: 14px;
}
.comment-input {
  margin-bottom: 20px;
}
.comment-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.comment-image-item {
  position: relative;
  width: 80px;
  height: 80px;
}
.comment-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
}
.comment-image-remove {
  position: absolute;
  top: -7px;
  right: -7px;
  font-size: 18px;
  color: #f56c6c;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}
.comment-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.comment-toolbar-left {
  display: flex;
  align-items: center;
  gap: 4px;
}
.emoji-btn {
  font-size: 18px;
}
.emoji-panel {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}
.emoji-item {
  background: none;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.emoji-item:hover {
  background: #f5f7fa;
}
.comment-image-pending {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  color: #909399;
  font-size: 22px;
}
.reply-tip {
  margin-bottom: 10px;
  color: #409eff;
  font-size: 13px;
}
.reply-mark {
  color: #909399;
}
.feedback-tip {
  margin-bottom: 12px;
  color: #909399;
  font-size: 13px;
}
.feedback-type {
  margin-bottom: 12px;
}
.comment-list {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}
.reply-detail {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 12px 8px 4px;
}
.reply-detail-thread {
  margin-bottom: 8px;
}
</style>
