// 排行榜接口
export interface IRankingList {
  avatar: string;
  username: string;
  get_likes_num: number;
  upload_ques_num: number;
}
// 获取审核后的题目接口
export interface IGetQuestionsParams {
  type?: 'all';
}
export interface IGetQuestionsReturn {
  total: number;
  result: IQuestion[];
}
export interface IQuestion {
  id: number;
  subjectID: number; // 科目ID
  catalogID: number; // 章节ID
  question: string; // 题干
  questionDetail: string; // 题目详情
  answer: string; // 答案
  addDate: string; // 添加时间
  tags: any; // 标签
  questionType: number; // 题目类型 0: '单选题' 1: '多选题' 2: '判断题' 3: '填空题'4: '简答题'
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
}
// 取消点赞接口
export interface ICancelLikeQuestionParams {
  id: number;
  creator: string;
  username: string;
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

// 用户注册接口
export interface IRegisterParams {
  phone: string;
  email: string;
  password: string;
  username: string;
  sex: string;
}
//验证码接口
export interface ICaptcha {
  width: number;
  height: number;
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
}
//试卷接口
export interface IGetPaperParamsList {
  type?: 'all';
  currentPage: number;
  pageSize: number;
  paper_tags: any;
}
