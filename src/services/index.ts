import { request } from '@/utils/request';
import type {
  IRankingList,
  IGetQuestionsParams,
  IGetQuestionsReturn,
  IGetQuestionDetailParams,
  IQuestion,
  ILikeQuestionParams,
  ICancelLikeQuestionParams,
  ILoginParams,
  ILoginData,
  IRegisterParams,
  IBrowseQuestion,
  IGetPaperParams,
  ICaptcha,
  ICaptchaResult,
  IGetPaperParamsList,
  IAdminLoginParams,
  INoIChkQuestions,
  IChkQuestions,
  INoChkPaper,
  IChkPaper,
  IDelQuestion,
  IDelPapers,
  ISubject,
  IChkParams,
  IUserInfo,
  IPaperDetail,
  IPaperCard,
  IPaperGroup,
  IUserListItem,
  IComment,
  IPagedParams,
  IUserUploadQues,
  IAdminInfo,
  ISubmitPaperParams,
  ISubmitPaperResult,
  IAiJudgeResult,
  IPaperRecord,
  IAnswerStats,
  IWrongQuestionsResult,
  INotification,
  IImportQuestion,
  IRandomPickParams,
  ISensitiveWord,
  IQuestionFeedback,
  IAdminStatistics,
  IAnnouncement,
  ITagStat,
  IFollowUser,
  IPublicProfile,
} from '@/types';

/*
 * 统一返回约定：request 已在拦截层解出后端响应体中的业务数据 `data`，
 * 因此所有 service 均返回业务体 T（数据类）或 Promise<void>（操作类）。
 * 业务失败（success=false / code 非 200）已在拦截层统一 reject + toast，
 * 调用方无需再判断 res.code / res.message。
 */

// 排行榜接口（type: all/week/month）
export function getRankList(
  type: 'all' | 'week' | 'month' = 'all',
): Promise<IRankingList[]> {
  return request<IRankingList[]>('GET', `/getRankingList?type=${type}`);
}

// 获取未审核的题目接口
export function getNoChkQuestions(
  params: IPagedParams,
): Promise<INoIChkQuestions> {
  return request<INoIChkQuestions>('POST', '/getNoChkQuestions', {
    data: params,
  });
}

// 获取所有已审核的题目接口
export function getAllChkQuestions(
  params: IPagedParams,
): Promise<IChkQuestions> {
  return request<IChkQuestions>('POST', '/getAllChkQuestions', {
    data: params,
  });
}

// 获取所有未审核的试卷接口
export function getNoChkPaper(params: IPagedParams): Promise<INoChkPaper> {
  return request<INoChkPaper>('POST', '/getNoChkPaper', {
    data: params,
  });
}

// 获取所有已审核的试卷接口
export function getAllChkPaper(params: IPagedParams): Promise<IChkPaper> {
  return request<IChkPaper>('POST', '/getAllChkPaper', {
    data: params,
  });
}

// 删除试卷接口
export function deletePapers(params: IDelPapers): Promise<void> {
  return request<void>('POST', '/deletePaper', { data: params });
}

// 已删除试卷列表（管理端恢复用）
export function getDeletedPapers(
  params: IPagedParams,
): Promise<{ result: IPaperCard[]; total: number }> {
  return request<{ result: IPaperCard[]; total: number }>(
    'POST',
    '/getDeletedPapers',
    { data: params },
  );
}

// 恢复试卷（管理端）
export function restorePaper(params: { paperId: number }): Promise<void> {
  return request<void>('POST', '/restorePaper', { data: params });
}

// 获取审核后的题目接口
export function getQuestionList(
  params: IGetQuestionsParams,
): Promise<IGetQuestionsReturn> {
  return request<IGetQuestionsReturn>('POST', '/getQuestions', {
    data: params,
  });
}

// 每日一题接口
export function getDailyQuestion(): Promise<IGetQuestionsReturn> {
  return request<IGetQuestionsReturn>('GET', '/getDailyQuestions');
}

// 获取题目详情接口
export function getQuestionDetail(
  params: IGetQuestionDetailParams,
): Promise<IQuestion> {
  return request<IQuestion>('POST', '/getQuestionDetail', {
    data: params,
  });
}

// 题目点赞接口
export function likeQuestion(params: ILikeQuestionParams): Promise<void> {
  return request<void>('POST', '/likeQuestions', { data: params });
}

// 题目取消点赞接口
export function unlikeQuestion(
  params: ICancelLikeQuestionParams,
): Promise<void> {
  return request<void>('POST', '/cancelLikeQuestions', { data: params });
}

// 收藏题目
export function favoriteQuestion(params: {
  questionId: number;
}): Promise<void> {
  return request<void>('POST', '/favoriteQuestion', { data: params });
}

// 取消收藏题目
export function cancelFavoriteQuestion(params: {
  questionId: number;
}): Promise<void> {
  return request<void>('POST', '/cancelFavoriteQuestion', { data: params });
}

// 获取我的收藏列表
export function getMyFavorites(): Promise<IQuestion[]> {
  return request<IQuestion[]>('POST', '/getMyFavorites', { data: {} });
}

// 关注用户
export function followUser(params: { followedId: number }): Promise<void> {
  return request<void>('POST', '/followUser', { data: params });
}

// 取消关注
export function unfollowUser(params: { followedId: number }): Promise<void> {
  return request<void>('POST', '/unfollowUser', { data: params });
}

// 关注列表
export function getFollowing(): Promise<IFollowUser[]> {
  return request<IFollowUser[]>('POST', '/getFollowing', { data: {} });
}

// 粉丝列表
export function getFollowers(): Promise<IFollowUser[]> {
  return request<IFollowUser[]>('POST', '/getFollowers', { data: {} });
}

// 关注/粉丝数量
export function getFollowCounts(): Promise<{
  following: number;
  followers: number;
}> {
  return request<{ following: number; followers: number }>(
    'POST',
    '/getFollowCounts',
    { data: {} },
  );
}

// 上传图片（multipart），返回图片 URL；channel 为上传渠道（comment/avatar/...）
// 前端先做类型/大小校验，快速反馈，后端仍会二次校验兜底
export async function uploadImage(
  file: File,
  channel = 'common',
): Promise<string> {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_EXT = [ 'jpg', 'jpeg', 'png', 'gif', 'webp' ];
  const ALLOWED_MIME = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    throw new Error('仅支持 jpg/png/gif/webp 格式的图片');
  }
  // 浏览器能识别 MIME 时，再按 MIME 校验一道
  if (file.type && !ALLOWED_MIME.includes(file.type)) {
    throw new Error('仅支持 jpg/png/gif/webp 格式的图片');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('图片大小不能超过 5MB');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('channel', channel);
  const res = await fetch('/api/uploadImage', {
    method: 'POST',
    body: form,
    credentials: 'include',
  });
  const body = await res.json();
  if (body.success === false || (body.code !== 200 && body.code !== 0)) {
    throw new Error(body.message || '上传失败');
  }
  return body.data.url as string;
}

// 用户登录接口（返回登录后的用户信息）
export function login(params: ILoginParams): Promise<ILoginData> {
  return request<ILoginData>('POST', '/login', { data: params });
}

// 重置密码（忘记密码）
export function resetPassword(params: {
  phone: string;
  password: string;
}): Promise<void> {
  return request<void>('POST', '/resetPassword', { data: params });
}

// 退出登录接口（清除后端 session）
export function logout(): Promise<void> {
  return request<void>('POST', '/logout');
}

// 用户注册接口
export function register(params: IRegisterParams): Promise<void> {
  return request<void>('POST', '/register', { data: params });
}

// 管理员登录接口
export function adminLogin(params: IAdminLoginParams): Promise<IAdminInfo> {
  return request<IAdminInfo>('POST', '/adminLogin', { data: params });
}

// 删除题目接口
export function deleteQuestions(params: IDelQuestion): Promise<void> {
  return request<void>('POST', '/deleteQuestions', { data: params });
}

// 已删除题目列表（管理端恢复用）
export function getDeletedQuestions(
  params: IPagedParams,
): Promise<{ result: IQuestion[]; total: number }> {
  return request<{ result: IQuestion[]; total: number }>(
    'POST',
    '/getDeletedQuestions',
    { data: params },
  );
}

// 恢复题目（管理端）
export function restoreQuestion(params: { id: number }): Promise<void> {
  return request<void>('POST', '/restoreQuestion', { data: params });
}

// 审核题目接口
export function chkQuestions(params: IChkParams): Promise<void> {
  return request<void>('POST', '/chkQuestions', { data: params });
}

// 审核试卷接口
export function chkPaper(params: IChkParams): Promise<void> {
  return request<void>('POST', '/chkPaper', { data: params });
}

// 验证码接口
export function getCaptcha(params: ICaptcha): Promise<ICaptchaResult> {
  return request<ICaptchaResult>('POST', '/captcha', { data: params });
}

// 题目浏览接口
export function browseQuestion(params: IBrowseQuestion): Promise<void> {
  return request<void>('POST', '/addBrowsesNum', { data: params });
}

// 组卷接口
export function getPaperQuestion(
  params: IGetPaperParams,
): Promise<{ paperId: number }> {
  return request<{ paperId: number }>('POST', '/getPaperQuestions', {
    data: params,
  });
}

// 获取试卷列表接口
export function getPaper(params: IGetPaperParamsList): Promise<IPaperGroup> {
  return request<IPaperGroup>('POST', '/getPaperQuestionsList', {
    data: params,
  });
}

// 修改试卷公开/私密权限
export function updatePaperPurview(params: {
  paperId: number | string;
  purview: number;
}): Promise<void> {
  return request<void>('POST', '/updatePaperPurview', { data: params });
}

// 编辑自己的试卷题目（增删题目；公开试卷需重新审核）
export function updatePaperQuestions(params: {
  paperId: number | string;
  ids: string;
}): Promise<void> {
  return request<void>('POST', '/updatePaperQuestions', { data: params });
}

// 获取试卷详情接口（forTest 为 true 时后端不返回答案）
export function getPaperDetail(params: {
  paperId: number | string;
  forTest?: boolean;
}): Promise<IPaperDetail> {
  return request<IPaperDetail>('POST', '/getPaperQuestionsDetail', {
    data: params,
  });
}

// 相似题目接口
export function getSimilarQuestion(params: {
  id: number;
}): Promise<IQuestion[]> {
  return request<IQuestion[]>('POST', '/getSimilarQuestions', { data: params });
}

// 上传题目接口
export function uploadQuestion(params: Record<string, unknown>): Promise<void> {
  return request<void>('POST', '/uploadQuestions', { data: params });
}

// 编辑题目接口（管理员）
export function updateQuestion(params: {
  id: number;
  question: string;
  answer: string;
  difficulty?: number | string;
  tags?: string;
}): Promise<void> {
  return request<void>('POST', '/updateQuestion', { data: params });
}

// 批量导入题目接口
export function importQuestions(params: {
  questions: IImportQuestion[];
}): Promise<{ imported: number }> {
  return request<{ imported: number }>('POST', '/importQuestions', {
    data: params,
  });
}

// 智能组卷随机抽题接口
export function randomPickQuestions(
  params: IRandomPickParams,
): Promise<IQuestion[]> {
  return request<IQuestion[]>('POST', '/randomPickQuestions', { data: params });
}

// 搜索题目接口
export function searchQuestion(
  params: Record<string, unknown>,
): Promise<IGetQuestionsReturn> {
  return request<IGetQuestionsReturn>('POST', '/searchQuestions', {
    data: params,
  });
}

// 科目列表接口
export function getSubjectList(): Promise<ISubject[]> {
  return request<ISubject[]>('GET', '/getSubjectList');
}

// 编辑用户信息接口
export function editUserInfo(params: Record<string, unknown>): Promise<void> {
  return request<void>('POST', '/editUserInfo', { data: params });
}

// 获取用户信息接口（后端以 session 为准，忽略前端身份参数）
export function getUserInfo(params?: {
  username?: string;
  phone?: string | number;
}): Promise<IUserInfo> {
  return request<IUserInfo>('POST', '/getUserInfo', { data: params || {} });
}

// 设置每日答题目标
export function setDailyGoal(params: { goal: number }): Promise<void> {
  return request<void>('POST', '/setDailyGoal', { data: params });
}

// 查看他人公开主页
export function getPublicProfile(params: {
  userId: number;
}): Promise<IPublicProfile> {
  return request<IPublicProfile>('POST', '/getPublicProfile', { data: params });
}

// 获取用户上传的题目接口
export function getUserUploadQues(
  params: Record<string, unknown>,
): Promise<IUserUploadQues> {
  return request<IUserUploadQues>('POST', '/getUserUploadQues', {
    data: params,
  });
}

// 获取用户列表（分页）
export function getUserList(
  params: Partial<IPagedParams>,
): Promise<{ result: IUserListItem[]; total: number }> {
  return request<{ result: IUserListItem[]; total: number }>(
    'POST',
    '/getUserList',
    { data: params },
  );
}

// 管理端首页统计
export function getAdminStatistics(): Promise<IAdminStatistics> {
  return request<IAdminStatistics>('POST', '/getAdminStatistics', { data: {} });
}

// 管理端未审核数量统计（导航栏红点）
export function getAdminPendingCounts(): Promise<{
  pendingQuestions: number;
  pendingPapers: number;
  pendingComments: number;
  unresolvedFeedback: number;
}> {
  return request('POST', '/getAdminPendingCounts', { data: {} });
}

// 删除用户
export function deleteUser(params: { userId: number | string }): Promise<void> {
  return request<void>('POST', '/deleteUser', { data: params });
}

// 已删除用户列表（管理端恢复用）
export function getDeletedUsers(): Promise<IUserListItem[]> {
  return request<IUserListItem[]>('POST', '/getDeletedUsers', { data: {} });
}

// 恢复用户（管理端）
export function restoreUser(params: {
  userId: number | string;
}): Promise<void> {
  return request<void>('POST', '/restoreUser', { data: params });
}

// 修改管理员密码
export function editAdminPassword(
  params: Record<string, unknown>,
): Promise<void> {
  return request<void>('POST', '/editAdminPassword', { data: params });
}

// 评论接口
export function addComment(params: Record<string, unknown>): Promise<void> {
  return request<void>('POST', '/addComment', { data: params });
}

// 获取评论接口（顶层评论分页，result 为当前页评论树，total 为顶层评论总数）
export function getCommentList(
  params: Record<string, unknown>,
): Promise<{ result: IComment[]; total: number }> {
  return request<{ result: IComment[]; total: number }>(
    'GET',
    '/getCommentList',
    { params },
  );
}

// 点赞评论
export function likeComment(params: { commentId: number }): Promise<void> {
  return request<void>('POST', '/likeComment', { data: params });
}

// 取消点赞评论
export function unlikeComment(params: { commentId: number }): Promise<void> {
  return request<void>('POST', '/unlikeComment', { data: params });
}

// 置顶/取消置顶评论（管理员）
export function pinComment(params: {
  id: number;
  pinned: boolean;
}): Promise<void> {
  return request<void>('POST', '/pinComment', { data: params });
}

// 删除评论接口
export function deleteComment(params: { id: number }): Promise<void> {
  return request<void>('POST', '/deleteComment', { data: params });
}

// 已删除评论列表（管理端恢复用，平铺）
export function getDeletedComments(): Promise<IComment[]> {
  return request<IComment[]>('POST', '/getDeletedComments', { data: {} });
}

// 恢复评论（管理端）
export function restoreComment(params: { id: number }): Promise<void> {
  return request<void>('POST', '/restoreComment', { data: params });
}

// 提交试卷作答并判分
export function submitPaper(
  params: ISubmitPaperParams,
): Promise<ISubmitPaperResult> {
  return request<ISubmitPaperResult>('POST', '/submitPaper', { data: params });
}

// AI 批改简答题（大模型响应慢，单独放宽超时；recordId 用于落库并重算成绩）
export function aiJudgeAnswer(params: {
  questionId: number;
  userAnswer: string;
  recordId?: number;
}): Promise<IAiJudgeResult> {
  return request<IAiJudgeResult>('POST', '/aiJudgeAnswer', {
    data: params,
    timeout: 90_000,
  });
}

// 我的答题记录
export function getMyPaperRecords(): Promise<IPaperRecord[]> {
  return request<IPaperRecord[]>('POST', '/getMyPaperRecords');
}

// 答题统计
export function getAnswerStats(): Promise<IAnswerStats> {
  return request<IAnswerStats>('POST', '/getAnswerStats');
}

// 错题本
export function getWrongQuestions(
  params: IPagedParams & { subjectID?: number | string },
): Promise<IWrongQuestionsResult> {
  return request<IWrongQuestionsResult>('POST', '/getWrongQuestions', {
    data: params,
  });
}

// 一键清空错题
export function clearWrongQuestions(): Promise<void> {
  return request<void>('POST', '/clearWrongQuestions', { data: {} });
}

// 消息通知列表
export function getNotifications(): Promise<INotification[]> {
  return request<INotification[]>('POST', '/getNotifications');
}

// 未读消息数量
export function getUnreadCount(): Promise<{ count: number }> {
  return request<{ count: number }>('POST', '/getUnreadCount');
}

// 标记单条通知已读
export function markNotificationRead(params: { id: number }): Promise<void> {
  return request<void>('POST', '/markNotificationRead', { data: params });
}

// 全部通知已读
export function markAllNotificationsRead(): Promise<void> {
  return request<void>('POST', '/markAllNotificationsRead');
}

// 每日打卡
export function checkin(): Promise<{ already: boolean; consecutive: number }> {
  return request<{ already: boolean; consecutive: number }>('POST', '/checkin');
}

// 打卡信息
export function getCheckinInfo(): Promise<{
  todayChecked: boolean;
  consecutive: number;
  total: number;
}> {
  return request<{
    todayChecked: boolean;
    consecutive: number;
    total: number;
  }>('POST', '/getCheckinInfo');
}

// 提交题目纠错反馈
export function submitFeedback(params: {
  questionId: number;
  type?: string;
  content: string;
}): Promise<void> {
  return request<void>('POST', '/submitFeedback', { data: params });
}

// 违禁词列表（管理员，分页，支持 keyword 模糊搜索）
export function getSensitiveWords(
  params: IPagedParams & { keyword?: string },
): Promise<{ result: ISensitiveWord[]; total: number }> {
  return request<{ result: ISensitiveWord[]; total: number }>(
    'POST',
    '/getSensitiveWords',
    { data: params },
  );
}

// 添加违禁词（管理员）
export function addSensitiveWord(params: {
  word: string;
  level: number;
}): Promise<void> {
  return request<void>('POST', '/addSensitiveWord', { data: params });
}

// 删除违禁词（管理员）
export function deleteSensitiveWord(params: { id: number }): Promise<void> {
  return request<void>('POST', '/deleteSensitiveWord', { data: params });
}

// 已删除违禁词列表（管理员）
export function getDeletedSensitiveWords(
  params: IPagedParams,
): Promise<{ result: ISensitiveWord[]; total: number }> {
  return request<{ result: ISensitiveWord[]; total: number }>(
    'POST',
    '/getDeletedSensitiveWords',
    { data: params },
  );
}

// 恢复违禁词（管理员）
export function restoreSensitiveWord(params: { id: number }): Promise<void> {
  return request<void>('POST', '/restoreSensitiveWord', { data: params });
}

// 公告列表（公开）
export function getAnnouncements(): Promise<IAnnouncement[]> {
  return request<IAnnouncement[]>('GET', '/getAnnouncements');
}

// 发布公告（管理员）
export function addAnnouncement(params: {
  title: string;
  content?: string;
}): Promise<void> {
  return request<void>('POST', '/addAnnouncement', { data: params });
}

// 删除公告（管理员）
export function deleteAnnouncement(params: { id: number }): Promise<void> {
  return request<void>('POST', '/deleteAnnouncement', { data: params });
}

// 已删除公告列表（管理员）
export function getDeletedAnnouncements(): Promise<IAnnouncement[]> {
  return request<IAnnouncement[]>('POST', '/getDeletedAnnouncements', {
    data: {},
  });
}

// 恢复公告（管理员）
export function restoreAnnouncement(params: { id: number }): Promise<void> {
  return request<void>('POST', '/restoreAnnouncement', { data: params });
}

// 标签统计（管理员）
export function getTagStats(): Promise<ITagStat[]> {
  return request<ITagStat[]>('POST', '/getTagStats', { data: {} });
}

// 重命名标签（管理员）
export function renameTag(params: {
  oldTag: string;
  newTag: string;
}): Promise<void> {
  return request<void>('POST', '/renameTag', { data: params });
}

// 删除标签（管理员）
export function deleteTag(params: { tag: string }): Promise<void> {
  return request<void>('POST', '/deleteTag', { data: params });
}

// 审核通过评论（管理员）
export function approveComment(params: { id: number }): Promise<void> {
  return request<void>('POST', '/approveComment', { data: params });
}

// 纠错反馈列表（管理员）
export function getFeedbackList(params: IPagedParams): Promise<{
  result: IQuestionFeedback[];
  total: number;
}> {
  return request<{ result: IQuestionFeedback[]; total: number }>(
    'POST',
    '/getFeedbackList',
    { data: params },
  );
}

// 标记纠错反馈已处理（管理员）
export function resolveFeedback(params: {
  id: number;
  remark?: string;
}): Promise<void> {
  return request<void>('POST', '/resolveFeedback', { data: params });
}

// 用户查看自己的纠错反馈
export function getMyFeedback(params: IPagedParams): Promise<{
  result: IQuestionFeedback[];
  total: number;
}> {
  return request<{ result: IQuestionFeedback[]; total: number }>(
    'POST',
    '/getMyFeedback',
    { data: params },
  );
}

// 未处理反馈数量（管理员角标）
export function getUnresolvedFeedbackCount(): Promise<{ count: number }> {
  return request<{ count: number }>('POST', '/getUnresolvedFeedbackCount');
}
