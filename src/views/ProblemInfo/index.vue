<template>
  <div v-loading="loading" class="info-container">
    <div class="page-header">
      <el-button class="back-btn" @click="returnToBefore">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回题目列表</span>
      </el-button>
    </div>
    <!-- 题目详情 -->
    <!-- 题目不存在/已被删除：不渲染详情卡片，避免展示残留内容 -->
    <el-card v-if="notFound" class="container">
      <el-empty description="该题目不存在或已被删除">
        <el-button type="primary" @click="returnToBefore">
          返回题目列表
        </el-button>
      </el-empty>
    </el-card>
    <el-card v-else class="container">
      <!-- 管理端预览已删除题目：醒目标识，避免误以为题目仍在正常使用 -->
      <el-alert
        v-if="isDeletedQuestion"
        class="deleted-alert"
        type="error"
        show-icon
        :closable="false"
        title="该题目已被删除"
        description="当前为管理端预览视图。可在管理端「题目管理 → 已删除」中恢复该题，或执行彻底删除。"
      />
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
            class="question-detail md-body"
            v-html="questionDetailHtml"
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
            <el-icon class="answer-icon"><Document /></el-icon>
            <span class="answer-title">答案与解析</span>
            <el-icon class="answer-arrow">
              <ArrowUpBold v-if="answerOpen" />
              <ArrowDownBold v-else />
            </el-icon>
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <div v-show="answerOpen" class="answer md-body" v-html="answerHtml" />
          <!-- eslint-enable vue/no-v-html -->
        </div>
        <!-- AI 解题思路 -->
        <div class="ai-section">
          <div class="ai-header" @click="toggleAiAnalysis">
            <el-icon class="ai-icon"><MagicStick /></el-icon>
            <span class="ai-title">AI 解题思路</span>
            <span class="ai-badge">AI</span>
            <el-icon class="ai-arrow">
              <ArrowUpBold v-if="aiOpen" />
              <ArrowDownBold v-else />
            </el-icon>
          </div>
          <div v-show="aiOpen" class="ai-body">
            <div v-if="!isLoggedInForAi" class="ai-login-tip">
              登录后可使用 AI 解题思路，快来试试吧~
            </div>
            <div v-else-if="aiLoading" class="ai-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>AI 正在分析题目，请稍候…</span>
            </div>
            <template v-else-if="aiData && aiData.available">
              <div class="ai-summary">{{ aiData.summary }}</div>
              <div v-if="aiData.points?.length" class="ai-block">
                <div class="ai-block-title">核心知识点</div>
                <ul class="ai-list">
                  <li v-for="(pt, i) in aiData.points" :key="i">{{ pt }}</li>
                </ul>
              </div>
              <div v-if="aiData.thinking?.length" class="ai-block">
                <div class="ai-block-title">解题思路</div>
                <ol class="ai-list ai-steps">
                  <li v-for="(st, i) in aiData.thinking" :key="i">{{ st }}</li>
                </ol>
              </div>
              <div v-if="aiData.pitfall" class="ai-block">
                <div class="ai-block-title">易错提醒</div>
                <p class="ai-text">{{ aiData.pitfall }}</p>
              </div>
              <div v-if="aiData.template" class="ai-block">
                <div class="ai-block-title">答题模板</div>
                <p class="ai-text">{{ aiData.template }}</p>
              </div>
            </template>
            <div v-else class="ai-error">
              <p>{{ aiData?.message || 'AI 解析暂不可用' }}</p>
              <el-button
                size="small"
                type="primary"
                text
                @click="loadAiAnalysis"
                >重新尝试</el-button
              >
            </div>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="comment-section">
          <h4>讨论</h4>
          <div v-if="isReadonly" class="readonly-tip">
            {{
              isDeletedQuestion
                ? '该题目已被删除，仅支持查看，暂不支持评论'
                : '该题目未通过审核，仅支持查看，暂不支持评论'
            }}
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
                      :preview-src-list="commentImages"
                      :initial-index="idx"
                      preview-teleported
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
          v-if="store.state.adminData?.id"
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
        <el-radio value="error">题目错误</el-radio>
        <el-radio value="wrong_answer">答案错误</el-radio>
        <el-radio value="typo">错别字</el-radio>
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
          <el-radio value="0">简单</el-radio>
          <el-radio value="1">中等</el-radio>
          <el-radio value="2">困难</el-radio>
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
import {
  ref,
  computed,
  reactive,
  onMounted,
  watchEffect,
  watch,
  nextTick,
} from 'vue';
import { ElMessage } from 'element-plus';
import {
  Star,
  StarFilled,
  Avatar,
  ArrowUpBold,
  ArrowDownBold,
  Collection,
  Picture,
  CircleCloseFilled,
  Loading,
  ArrowLeft,
  MagicStick,
  Document,
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
  aiAnalyze,
} from '@/services';
import {
  parseHashQuery,
  questionType,
  difficulty,
  transitionTime,
  firstQueryValue,
  formatAnswerWithValues,
  renderMarkdown,
} from '@/utils';
import type { IComment, IQuestion } from '@/types';
import router from '@/router';
import CommentItem from '@/components/CommentItem/index.vue';
const store = useStore();
const {
  type: whereInterType,
  isClickSearch,
  commentId,
  from: fromPage,
} = parseHashQuery();
// id 必须响应式：相似题目/浏览器前进后退切换题目时，组件复用而路由 query 变化
const id = computed(
  () => firstQueryValue(router.currentRoute.value.query.id) || '',
);

// AI 解题思路：收起/展开 + 首次展开自动加载
const aiOpen = ref(false);
const aiLoading = ref(false);
const aiTried = ref(false);
const aiData = ref<{
  available: boolean;
  message?: string;
  summary?: string;
  points?: string[];
  thinking?: string[];
  pitfall?: string;
  template?: string;
} | null>(null);
// AI 解题思路仅对普通用户开放：后端 /aiAnalyze 走 auth（JWT）中间件，
// 管理员用 ADMIN_SESS cookie 登录、不持有 JWT，调用会 401 并被拦截器踢回登录页，
// 因此这里有意不把管理端算作已登录（与「答案与解析」不同，那边后端是放行管理员的）。
const isLoggedInForAi = computed(() => Boolean(store.state.userData?.userId));
const toggleAiAnalysis = () => {
  if (!isLoggedInForAi.value) {
    ElMessage.warning('登录后可查看 AI 解题思路');
    return;
  }
  aiOpen.value = !aiOpen.value;
  if (aiOpen.value && !aiTried.value) {
    void loadAiAnalysis();
  }
};
const loadAiAnalysis = async () => {
  aiLoading.value = true;
  try {
    const res = await aiAnalyze({ questionId: Number(id.value) });
    aiData.value = res as any;
    aiTried.value = true;
  } catch {
    aiData.value = { available: false, message: '网络异常，请稍后重试' };
    aiTried.value = true;
  } finally {
    aiLoading.value = false;
  }
};

// 答案与解析：默认收起，点击标题展开/收起
const answerOpen = ref(false);
const toggleAnswer = () => {
  // 登录判定：普通用户看 userId；管理员用 ADMIN_SESS 登录（不持有 userId），
  // 后端已对管理员放行答案，前端这里必须同样放行，否则管理端会误报"请先登录"。
  const isLoggedIn = Boolean(
    store.state.userData?.userId || store.state.adminData?.id,
  );
  if (!isLoggedIn) {
    ElMessage.warning('登录后可查看答案，请先登录');
    return;
  }
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
// 获取用户喜欢的题目id（统一转成字符串数组，避免 number/string 混用导致 includes 失效）
const rawLikeTopics = userData?.likeTopicsId;
const likeTopicsId: string[] = (
  Array.isArray(rawLikeTopics)
    ? rawLikeTopics
    : typeof rawLikeTopics === 'string'
    ? rawLikeTopics.split(',')
    : []
).map(String);
// 获取题目详情
const questionDetail = ref({} as IQuestion);
/** 题目不存在/已删除（详情接口失败）时展示空状态，避免残留上一题内容 */
const notFound = ref(false);
// 相似题目
const similarQuestions = ref<IQuestion[]>([]);
// 是否点击了喜欢
const isClickLike = ref(false);
const isChecked = ref(false);
const loading = ref(true);
// 是否已收藏
const isFavorite = ref(false);
const toggleFavorite = () => {
  const qid = Number(id.value);
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
// 未审核 / 审核不通过 / 已软删除的题目只读：不允许点赞、选题、评论等操作
const isDeletedQuestion = computed(
  () => Number(questionDetail.value.is_deleted) === 1,
);
const isReadonly = computed(
  () => Number(questionDetail.value.chkState) !== 1 || isDeletedQuestion.value,
);
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

// ===== Markdown 渲染（支持代码块高亮）=====
// 题干详情与答案都按 Markdown 渲染；渲染是异步的（代码高亮按需加载），
// 因此用 ref 缓存结果、watch 源数据变化时重算。
const questionDetailHtml = ref('');
const answerHtml = ref('');

// 答案的原始文本：先做「正确选项：A」→「A. 选项内容」补全，再交给 Markdown 渲染
const answerRawText = computed(() =>
  formatAnswerWithValues(
    questionDetail.value.questionType,
    questionDetail.value.answer,
    questionDetail.value.questionDetail,
  ),
);

watch(
  () => [questionDetail.value.questionDetail, isDetailType.value],
  async () => {
    if (!isDetailType.value) {
      questionDetailHtml.value = '';
      return;
    }
    questionDetailHtml.value = await renderMarkdown(
      questionDetail.value.questionDetail,
    );
  },
  { immediate: true },
);

watch(
  answerRawText,
  async (text) => {
    answerHtml.value = await renderMarkdown(text);
  },
  { immediate: true },
);
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
// 记录浏览：仅「审核通过且未删除」的题目、且本次会话未浏览过才 +1，并同步更新详情页展示
// （管理端预览已删除题目时不应计入浏览数）
const recordBrowse = (qid: number) => {
  const detail = questionDetail.value;
  if (!detail || Number(detail.chkState) !== 1) return;
  if (Number(detail.is_deleted) === 1) return;
  const browsed = store.state.browseTopicsId;
  if (browsed.includes(qid)) return;
  store.commit('setBrowseTopicsId', [...browsed, qid]);
  browseQuestion({ id: qid, username: store.state.userData.username });
  detail.browses_num = (Number(detail.browses_num) || 0) + 1;
};

// 获取题目详情
const getDailyQuestion = async (value?: number) => {
  const targetId = value ?? Number(id.value);
  // 切题时先清空详情，避免接口失败（题目已被删除/不存在）时残留上一题内容造成误解
  questionDetail.value = {} as IQuestion;
  questionDetailHtml.value = '';
  notFound.value = false;
  // 判断喜欢的题目中是否包含当前题目id（统一按字符串比较）
  if (likeTopicsId.includes(String(targetId))) {
    isClickLike.value = true;
  } else {
    isClickLike.value = false;
  }
  getQuestionDetail({ id: targetId })
    .then((res) => {
      // 竞态防护：切题后旧请求返回时直接丢弃，避免覆盖新题数据
      if (Number(id.value) !== targetId) return;
      // 题目不存在（已被删除）时标记空状态，避免展示空白页
      if (!res || !res.id) {
        notFound.value = true;
        return;
      }
      questionDetail.value = res;
      // 浏览记录统一在详情加载完成后处理，避免与详情接口并发导致浏览数少算
      recordBrowse(targetId);
    })
    .catch(() => {
      // 接口失败（题目已删除等）同样标记空状态，不留上一题残留
      if (Number(id.value) !== targetId) return;
      notFound.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
};
// 获取相似题目
const getSimilarQuestions = async (value?: number) => {
  const targetId = value || Number(id.value);
  const res = await getSimilarQuestion({
    id: targetId,
  });
  // 竞态防护：切题后旧响应丢弃
  if (Number(id.value) !== targetId) return;
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
      // 删除喜欢的题目id（indexOf 为 -1 时 splice 会误删最后一个元素，必须先判断）
      const likeIdx = likeTopicsId.indexOf(String(questionDetail.value.id));
      if (likeIdx !== -1) {
        likeTopicsId.splice(likeIdx, 1);
      }
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
      // 添加喜欢的题目id（防重复）
      const likeId = String(questionDetail.value.id);
      if (!likeTopicsId.includes(likeId)) {
        likeTopicsId.push(likeId);
      }
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
const goSimilarQuestion = (qid: number) => {
  router.push({ path: '/problemInfo', query: { id: qid } });
};
// 切题统一处理：路由 query.id 变化（相似题目跳转 / 浏览器前进后退）时刷新
// 详情、相似题、评论，并重置 AI 解析与翻页状态，避免残留上一题内容
// （竞态防护：各加载函数在赋值前比对目标 id 与当前 id，旧请求响应直接丢弃）
watch(id, (newId, oldId) => {
  if (!newId || String(newId) === String(oldId)) return;
  // 重置详情与空状态，避免上一题内容残留
  questionDetail.value = {} as IQuestion;
  questionDetailHtml.value = '';
  notFound.value = false;
  // 重置 AI 解析状态
  aiOpen.value = false;
  aiTried.value = false;
  aiData.value = null;
  aiLoading.value = false;
  // 刷新评论：从第 1 页开始，避免沿用上一个题目的页码
  commentPage.value = 1;
  commentContent.value = '';
  highlightCommentId.value = null;
  getDailyQuestion(Number(newId));
  getSimilarQuestions(Number(newId));
  getComments(Number(newId));
});
const returnToBefore = () => {
  if (store.state.adminData?.id) {
    // 从评论管理进入时回到评论管理，其余默认回题目管理
    if (fromPage === 'adminComment') {
      router.push({ path: '/adminComment' });
      return;
    }
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
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
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
  '😀',
  '😁',
  '😂',
  '🤣',
  '😊',
  '😍',
  '😘',
  '😜',
  '🤔',
  '😅',
  '😭',
  '😤',
  '😴',
  '🥳',
  '🤯',
  '👀',
  '👍',
  '👎',
  '👏',
  '🙏',
  '❤️',
  '💔',
  '🔥',
  '🎉',
  '✨',
  '💯',
  '🐶',
  '🌹',
  '☕',
  '🍉',
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
  const targetQid = qid ?? Number(id.value);
  // 用户端只展示审核通过的评论（待审核评论管理员审核后才可见）
  const res = await getCommentList({
    questionId: targetQid,
    onlyApproved: true,
    currentPage: commentPage.value,
    pageSize: commentPageSize,
    userId: store.state.userData?.userId,
  });
  // 竞态防护：切题后旧评论响应丢弃
  if (Number(id.value) !== targetQid) return;
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
  const res: any = await addComment({
    content: commentContent.value,
    questionId: Number(id.value),
    images: commentImages.value,
  });
  ElMessage.success(res?.message || '评论成功');
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
    questionId: Number(id.value),
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
  if (!store.state.userData?.userId || store.state.adminData?.id) return; // 未登录或管理端跳过收藏状态（管理端无 userId session，收藏接口会 401）
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
  if (selectedTopicIds.includes(Number(id.value))) {
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
  border: 1px solid rgba(0, 166, 255, 0.18);
  border-radius: 14px;
  background: linear-gradient(
      135deg,
      rgba(0, 166, 255, 0.06) 0%,
      rgba(0, 200, 220, 0.02) 45%,
      rgba(255, 255, 255, 0) 100%
    ),
    #fff;
  box-shadow: 0 4px 18px rgba(31, 45, 61, 0.06);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}
.answer-section:hover {
  box-shadow: 0 8px 26px rgba(0, 120, 255, 0.12);
}
.answer-header {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
}
.answer-header:hover .answer-title {
  color: var(--el-color-primary);
}
.answer-icon {
  color: var(--el-color-primary);
  font-size: 18px;
  margin-right: 8px;
}
.answer-title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  transition: color 0.25s ease;
}
.answer-arrow {
  margin-left: auto;
  color: #909399;
}
.answer {
  margin: 4px 18px 18px;
  padding: 12px 16px;
  background-color: rgba(0, 166, 255, 0.04);
  border-radius: 10px;
  border-top: 1px dashed rgba(0, 166, 255, 0.15);
  line-height: 1.8;
  color: #303133;
}
.answer::before {
  display: none;
  content: '';
  display: block;
  background: url(data:image/webp;base64,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);
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
  padding: 4px 0;
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
  margin-top: 10px;
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
.deleted-alert {
  margin-bottom: 18px;
}
.comment-input {
  margin-bottom: 20px;
  margin-top: 10px;
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

/* 页面顶部返回按钮（与 paperDetail 统一） */
.page-header {
  margin-bottom: 16px;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
}

/* 返回按钮 - sticky 内联，左右对齐 */
.page-header {
  position: sticky;
  top: 60px;
  z-index: 30;
  margin-bottom: 16px;
  padding: 4px 0;
}
.page-header .back-btn {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  color: #606266;
  transition: all 0.2s;
}
.page-header .back-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}
/* ===== AI 解题思路面板 ===== */
.ai-section {
  margin-top: 20px;
  border: 1px solid rgba(0, 166, 255, 0.18);
  border-radius: 14px;
  background: linear-gradient(
      135deg,
      rgba(0, 166, 255, 0.06) 0%,
      rgba(0, 200, 220, 0.02) 45%,
      rgba(255, 255, 255, 0) 100%
    ),
    #fff;
  box-shadow: 0 4px 18px rgba(31, 45, 61, 0.06);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}
.ai-section:hover {
  box-shadow: 0 8px 26px rgba(0, 120, 255, 0.12);
}
.ai-header {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
}
.ai-header:hover .ai-title {
  color: var(--el-color-primary);
}
.ai-icon {
  color: var(--el-color-primary);
  font-size: 18px;
  margin-right: 8px;
}
.ai-title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  transition: color 0.25s ease;
}
.ai-badge {
  margin-left: 10px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #fff;
  border-radius: 999px;
  background: linear-gradient(120deg, #00c6ff, #0072ff);
  box-shadow: 0 2px 8px rgba(0, 140, 255, 0.4);
}
.ai-arrow {
  margin-left: auto;
  color: #909399;
}
.ai-body {
  padding: 4px 18px 18px;
  border-top: 1px dashed rgba(0, 166, 255, 0.15);
}
.ai-login-tip,
.ai-error {
  padding: 18px 0 8px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
.ai-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 26px 0 18px;
  color: var(--el-color-primary);
  font-size: 14px;
}
.ai-summary {
  margin-top: 14px;
  padding: 12px 16px;
  border-radius: 10px;
  background: linear-gradient(
    120deg,
    rgba(0, 166, 255, 0.1),
    rgba(0, 200, 220, 0.04)
  );
  border-left: 3px solid var(--el-color-primary);
  color: #1f2937;
  font-size: 14px;
  line-height: 1.7;
}
.ai-block {
  margin-top: 16px;
}
.ai-block-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}
.ai-block-title::before {
  content: '';
  width: 4px;
  height: 14px;
  margin-right: 8px;
  border-radius: 2px;
  background: linear-gradient(180deg, #00c6ff, #0072ff);
}
.ai-list {
  margin: 0;
  padding-left: 18px;
  color: #3d4d5f;
  font-size: 14px;
  line-height: 1.9;
}
.ai-steps li {
  margin-bottom: 2px;
}
.ai-text {
  margin: 0;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(0, 166, 255, 0.05);
  color: #3d4d5f;
  font-size: 14px;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .ai-header {
    padding: 12px 14px;
  }
  .ai-body {
    padding: 4px 14px 14px;
  }
}
</style>
