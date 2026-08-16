// ===== 业务枚举（与后端契约一致） =====

// 审核状态：0 未审核 / 1 审核通过 / 2 审核不通过
export enum ChkState {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

// 组卷权限：'1' 公开 / '3' 私有
export enum PaperAuth {
  Public = '1',
  Private = '3',
}

// 试卷可见范围 purview：0 公开 / 3 个人 / -1 官方（管理员）
export enum PaperPurview {
  Public = 0,
  Private = 3,
  Official = -1,
}

// 排行榜接口
export interface IRankingList {
  avatar: string;
  username: string;
  get_likes_num: number;
  upload_ques_num: number;
  integral?: number;
  correct_ques_num?: number;
  checkin_days?: number;
}
//获取未审核的题目接口
export interface INoIChkQuestions {
  total: number;
  result: IQuestion[];
}
//获取已审核的题目接口
export interface IChkQuestions {
  total: number;
  result: IQuestion[];
}
//获取未审核的试卷接口
export interface INoChkPaper {
  total: number;
  result: IPaperCard[];
}
//获取已审核的试卷接口
export interface IChkPaper {
  total: number;
  result: IPaperCard[];
}
//删除试卷接口
export interface IDelPapers {
  paperId: number;
}
//删除题目接口
export interface IDelQuestion {
  id: number;
}

// 获取审核后的题目接口
export interface IGetQuestionsParams {
  type?: string; // all:全部
  currentPage?: number; // 当前页
  pageSize?: number; // 每页条数
  catalogID?: number; // 章节ID
  subjectID?: number; // 科目ID
  ids?: string[]; // 题目ID
}
export interface IGetQuestionsReturn {
  total: number;
  result: IQuestion[];
  subjectNameList: string[];
  catalogNameList: string[];
}
export interface IQuestion {
  id: number;
  subjectID: number; // 科目ID
  catalogID: number; // 章节ID
  question: string; // 题干
  questionDetail: string; // 题目详情
  answer: string; // 答案
  addDate: string; // 添加时间
  tags: string | string[]; // 标签
  questionType: string; // 题目类型 0: '单选题' 1: '多选题' 2: '判断题' 3: '填空题'4: '简答题'
  remarks?: string; // 备注
  number?: number; // 试题编号
  direction: string; // 题目方向
  difficulty: number; // 难度 0:'简单'1:'中等'2:'困难'
  isChoice?: number; // 是否精选 0:否 1:是
  publishState?: number; // 发布状态 0:未发布 1:已发布 2:已下架
  publishDate?: string; // 发布时间
  chkState?: number; // 审核状态 0:未审核 1:审核通过 2:审核不通过
  chkUser?: string; // 审核人
  chkRemarks?: string; // 审核备注
  chkDate?: string; // 审核时间
  creator: string; // 创建人(作者)
  likes_num: number; // 点赞数
  browses_num: number; // 浏览数
}
// 获取题目详情接口
export interface IGetQuestionDetailParams {
  id: number;
}
// 点赞接口
export interface ILikeQuestionParams {
  id: number;
  creator: string;
  username: string;
  userId: number;
}
// 取消点赞接口
export interface ICancelLikeQuestionParams {
  id: number;
  creator: string;
  username: string;
  userId: number;
}
// 用户登录接口
export interface ILoginParams {
  phone: string | number;
  password: string | number;
}
export interface ILoginReturn {
  code: number;
  message: string;
  data?: ILoginData;
  success: boolean;
}
export interface ILoginData {
  username: string;
  phone: string;
  sex: string;
  email: string;
  ctime: string;
  avatar: string;
  last_login_time: string;
}
// 管理员登录接口
export interface IAdminLoginParams {
  name: string | number;
  password: string | number;
}
// 用户注册接口
export interface IRegisterParams {
  phone: string;
  email: string;
  password: string;
  username: string;
  sex: string;
}
//验证码接口（请求参数）
export interface ICaptcha {
  width: number;
  height: number;
}
//验证码接口（响应中的业务数据）
export interface ICaptchaResult {
  data: string; // 验证码 SVG 图形
  text: string; // 验证码文本，用于前端比对
}
// 题目浏览接口
export interface IBrowseQuestion {
  id: number;
  username: string;
}
// 组卷接口
export interface IGetPaperParams {
  author: string;
  ids: string;
  paperTitle?: string;
  paperTags?: string;
  purview?: number;
  isPractice?: boolean; // 练习卷（允许少于 5 道）
}
// 试卷接口
export interface IGetPaperParamsList {
  type?: 'all';
  currentPage?: number;
  pageSize?: number;
  paper_tags?: string | string[];
  author?: string;
}

/**
 * 后端统一响应体。
 *
 * 注意层级：axios 的 `AxiosResponse.data` 才是这个 body，
 * 因此 service 内部取业务数据是 `res.data.data`，
 * 而返回整个 body 的 service，调用方用 `res.code` / `res.message` / `res.data`。
 */
export interface IApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

// 题目方向/科目
export interface ISubject {
  subjectID: number;
  content: string;
}

// 审核参数
export interface IChkParams {
  paperId?: string;
  id?: number;
  chkState: number;
}

// 用户信息
export interface IUserInfo {
  userId?: number;
  username: string;
  phone: string;
  sex: string;
  email: string;
  avatar: string;
  ctime: string;
  last_login_time: string;
  // 逗号分隔的点赞题目 ID 字符串（后端从 user_like_question 关联表实时查得）
  likeTopicsId: string;
  browseTopicsId: number[];
  daily_goal?: number;
  today_correct?: number;
}

// 管理员信息（管理员登录返回）
export interface IAdminInfo {
  name?: string;
  [key: string]: unknown;
}

// 分页参数
export interface IPagedParams {
  currentPage: number;
  pageSize: number;
}

// 试卷基础信息
export interface IPaperInfo {
  paperId: number | string;
  paperTitle?: string;
  paper_tags?: string | string[];
  purview?: number; // 0: 公开试卷 其他: 个人试卷
  author?: string;
  ctime?: string;
  [key: string]: unknown;
}

// 试卷卡片（后端实际返回的 snake_case 字段）
export interface IPaperCard {
  paper_id?: number | string;
  paper_title?: string;
  paper_tags?: string | string[];
  author?: string;
  ctime?: string;
  purview?: number;
  chkState?: number;
}

// 试卷列表项
export interface IPaperItem extends IPaperInfo {
  chkState?: number;
}

// 试卷列表按分组返回（key 为分组名）
export type IPaperGroup = Record<string, IPaperItem[]>;

// 试卷详情
export interface IPaperDetail {
  questions: IQuestion[];
  paperInfo: IPaperInfo;
}

// 用户列表项（管理端）
export interface IUserListItem {
  id: number;
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
  sex?: string;
  avatar?: string;
  ctime?: string;
  like_ques_num?: number;
  upload_ques_num?: number;
  approvedNums?: number;
  integral?: number;
  [key: string]: unknown;
}

// 用户上传的题目（分页）
export interface IUserUploadQues {
  data: IQuestion[];
  total: number;
}

// 管理端首页统计
export interface IAdminStatistics {
  days: string[];
  sevenDays: {
    newUsers: Array<{ date: string; value: number }>;
    uploads: Array<{ date: string; value: number }>;
    papers: Array<{ date: string; value: number }>;
    answers: Array<{ date: string; value: number }>;
  };
  totals: {
    users: number;
    questions: number;
    papers: number;
    answers: number;
    comments: number;
    pendingFeedback: number;
  };
  subjectDist: Array<{ name: string; value: number }>;
  typeDist: Array<{ name: string; value: number }>;
  recentUploads?: Array<{
    id: number;
    question?: string;
    creator?: string;
    addDate?: string;
  }>;
  recentPapers?: Array<{
    paper_id: number;
    paper_title?: string;
    author?: string;
    ctime?: string;
  }>;
}

// 评论（树形：回复嵌套在 children 下）
export interface IComment {
  id: number;
  user_id?: number;
  comment?: string;
  content?: string;
  username: string;
  avatar?: string;
  ctime?: string;
  create_time?: string;
  parent_id?: number;
  reply_username?: string;
  reply_to_content?: string;
  question_title?: string;
  status?: number;
  like_count?: number;
  is_liked?: number;
  is_pinned?: number;
  images?: string;
  children?: IComment[];
  [key: string]: unknown;
}

// 违禁词
export interface ISensitiveWord {
  id: number;
  word: string;
  level: number; // 1=直接拦截 2=待审核
  ctime?: string;
}

// 系统公告
export interface IAnnouncement {
  id: number;
  title: string;
  content?: string;
  ctime?: string;
}

// 标签统计
export interface ITagStat {
  tag: string;
  count: number;
}

// 关注/粉丝用户
export interface IFollowUser {
  userId: number;
  username?: string;
  avatar?: string;
  create_time?: string;
}

// 站内私信
export interface IPrivateMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  content: string;
  is_read: number;
  ctime?: string;
}

// 私信会话
export interface IConversation {
  userId: number;
  username?: string;
  avatar?: string;
  last_content?: string;
  last_time?: string;
  unread?: number;
}

// 公开主页信息
export interface IPublicProfile {
  userId: number;
  username: string;
  avatar?: string;
  personalIntroduction?: string;
  integral?: number;
  correct_ques_num?: number;
  checkin_days?: number;
  upload_ques_num?: number;
  like_ques_num?: number;
  following?: number;
  followers?: number;
  is_following?: boolean;
  ctime?: string;
}

// 题目纠错反馈
export interface IQuestionFeedback {
  id: number;
  question_id: number;
  user_id: number;
  type: string;
  content: string;
  is_resolved: number;
  ctime?: string;
  username?: string;
  question?: string;
  resolve_remark?: string;
  resolve_time?: string;
  resolver?: string;
}

// ===== 在线做题 / 答题记录 / 错题本 / 消息通知 =====

// 提交试卷作答
export interface ISubmitPaperParams {
  paperId: number | string;
  answers: Array<{ questionId: number | string; userAnswer: string }>;
}

// 单题判分结果
export interface IAnswerDetail {
  questionId: number;
  questionType: number | string;
  question: string;
  questionDetail: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean | null;
}

// 交卷结果
export interface ISubmitPaperResult {
  recordId: number;
  score: number;
  questionNum: number;
  correctNum: number;
  wrongNum: number;
  subjectiveNum: number;
  detail: IAnswerDetail[];
}

// 答题记录（一次整卷作答）
export interface IPaperRecord {
  id: number;
  user_id: number;
  paper_id: number;
  score: number;
  question_num: number;
  correct_num: number;
  wrong_num: number;
  subjective_num: number;
  ctime?: string;
  paper_title?: string;
  paper_tags?: string | string[];
}

// 主观题待复核项（管理端）
export interface ISubjectiveReview {
  id: number;
  record_id: number;
  user_id: number;
  paper_id: number;
  question_id: number;
  user_answer?: string;
  is_correct: number | null;
  ctime?: string;
  username?: string;
  question?: string;
  correct_answer?: string;
  paper_title?: string;
}

// 答题统计
export interface IAnswerStats {
  attempt_num: number;
  question_num: number;
  correct_num: number;
  wrong_num: number;
  subjective_num: number;
  total_score: number;
  avg_score: number;
  correct_rate: number;
  subjectStats?: Array<{
    subjectID: number;
    subjectName: string;
    correct_num: number;
    wrong_num: number;
    total: number;
    rate: number;
  }>;
  recentScores?: Array<{ score: number; ctime?: string }>;
}

// 错题
export interface IWrongQuestion extends IQuestion {
  last_wrong_answer?: string;
  wrong_time?: string;
}

// 错题本（分页 + 科目分布）
export interface IWrongQuestionsResult {
  total: number;
  data: IWrongQuestion[];
  subjectStats?: Array<{
    subjectID: number;
    subjectName: string;
    count: number;
  }>;
}

// 消息通知
export interface INotification {
  id: number;
  user_id: number;
  type: string;
  title?: string;
  content?: string;
  is_read: number;
  ctime?: string;
  question_id?: number;
  comment_id?: number;
}

// 批量导入的单条题目
export interface IImportQuestion {
  question: string;
  questionType: number; // 0单选 1多选 2判断 3简答
  difficulty?: number;
  subjectID?: number;
  tags?: string;
  options?: Array<{ code: string; value: string }>;
  answer: string;
  questionDetail?: string;
}

// 智能组卷抽题参数
export interface IRandomPickParams {
  subjectID?: number | string;
  difficulty?: number | string;
  counts: {
    single: number;
    multiple: number;
    judge: number;
    essay: number;
  };
}
