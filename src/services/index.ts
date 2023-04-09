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
  ILoginReturn,
  IRegisterParams,
  IBrowseQuestion,
  IGetPaperParams,
  ICaptcha,
  IGetPaperParamsList,
  IAdminLoginParams,
  INoIChkQuestions,
  IChkQuestions,
  IDelQuestion,
  IDelPapers,
} from '@/types';

// 排行榜接口
export function getRankList() {
  return request('GET', '/getRankingList').then((res: any) => {
    return res.data.data as IRankingList;
  });
}
// 获取未审核的题目接口
export function getNoChkQuestions() {
  return request('GET', '/getNoChkQuestions').then((res: any) => {
    return res.data.data as INoIChkQuestions;
  });
}
// 获取所有已审核的题目接口
export function getAllChkQuestions() {
  return request('GET', '/getAllChkQuestions').then((res: any) => {
    return res.data.data as IChkQuestions;
  });
}
// 获取所有未审核的试卷接口
export function getNoChkPaper() {
  return request('GET', '/getNoChkPaper').then((res: any) => {
    return res.data.data;
  });
}
// 获取所有已审核的试卷接口
export function getAllChkPaper() {
  return request('GET', '/getAllChkPaper').then((res: any) => {
    return res.data.data;
  });
}
//删除试卷接口
export function deletePapers(params: IDelPapers) {
  return request('POST', '/deletePaper', { data: params }).then((res: any) => {
    return res.data;
  });
}
// 获取审核后的题目接口
export function getQuestionList(params: IGetQuestionsParams) {
  return request('POST', '/getQuestions', { data: params }).then((res: any) => {
    return res.data.data;
  });
}
// 每日一题接口
export function getDailyQuestion() {
  return request('GET', '/getDailyQuestions').then((res: any) => {
    return res.data.data as IGetQuestionsReturn;
  });
}
// 获取题目详情接口
export function getQuestionDetail(params: IGetQuestionDetailParams) {
  return request('POST', '/getQuestionDetail', { data: params }).then(
    (res: any) => {
      return res.data.data as IQuestion;
    },
  );
}
// 题目点赞接口
export function likeQuestion(params: ILikeQuestionParams) {
  return request('POST', '/likeQuestions', { data: params });
}
// 题目取消点赞接口
export function unlikeQuestion(params: ICancelLikeQuestionParams) {
  return request('POST', '/cancelLikeQuestions', { data: params });
}
// 用户登录接口
export function login(params: ILoginParams) {
  return request('POST', '/login', { data: params }).then((res: any) => {
    return res.data as ILoginReturn;
  });
}
// 用户注册接口
export function register(params: IRegisterParams) {
  return request('POST', '/register', { data: params });
}
//管理员登录接口
export function adminLogin(params: IAdminLoginParams) {
  return request('POST', '/adminLogin', { data: params }).then((res: any) => {
    return res.data;
  });
}
//删除题目接口
export function deleteQuestions(params: IDelQuestion) {
  return request('POST', '/deleteQuestions', { data: params }).then(
    (res: any) => {
      return res.data;
    },
  );
}
//审核题目接口
export function chkQuestions(params: any) {
  return request('POST', '/chkQuestions', { data: params }).then((res: any) => {
    return res.data;
  });
}
//审核试卷接口
export function chkPaper(params: any) {
  return request('POST', '/chkPaper', { data: params }).then((res: any) => {
    return res.data;
  });
}
//验证码接口
export function getCaptcha(params: ICaptcha) {
  return request('POST', '/captcha', { data: params }).then((res: any) => {
    return res.data;
  });
}
// 题目浏览接口
export function browseQuestion(params: IBrowseQuestion) {
  return request('POST', '/addBrowsesNum', { data: params });
}
// 组卷接口
export function getPaperQuestion(params: any) {
  return request('POST', '/getPaperQuestions', { data: params }).then(
    (res: any) => {
      return res.data;
    },
  );
}
// 获取试卷接口
export function getPaper(params: any) {
  return request('POST', '/getPaperQuestionsList', { data: params }).then(
    (res: any) => {
      return res.data;
    },
  );
}
// 获取试卷详情接口
export function getPaperDetail(params: any) {
  return request('POST', '/getPaperQuestionsDetail', { data: params }).then(
    (res: any) => {
      return res.data;
    },
  );
}
// 相似题目接口
export function getSimilarQuestion(params: { id: number }) {
  return request('POST', '/getSimilarQuestions', { data: params }).then(
    (res: any) => {
      return res.data.data;
    },
  );
}
// 上传题目接口
export function uploadQuestion(params: any) {
  return request('POST', '/uploadQuestions', { data: params }).then(
    (res: any) => {
      return res.data;
    },
  );
}

// 搜索题目接口
export function searchQuestion(params: any) {
  return request('POST', '/searchQuestions', { data: params }).then(
    (res: any) => {
      return res.data;
    },
  );
}
// 科目列表接口
export function getSubjectList() {
  return request('GET', '/getSubjectList').then((res: any) => {
    return res.data;
  });
}
// 编辑用户信息接口
export function editUserInfo(params: any) {
  return request('POST', '/editUserInfo', { data: params }).then((res: any) => {
    return res.data;
  });
}
// 获取用户信息接口
export function getUserInfo(params: any) {
  return request('POST', '/getUserInfo', { data: params }).then((res: any) => {
    return res.data;
  });
}
// 获取用户上传的题目接口
export function getUserUploadQues(params: any) {
  return request('POST', '/getUserUploadQues', { data: params }).then(
    (res: any) => {
      return res.data;
    },
  );
}
// 获取用户列表
export function getUserList(params: any) {
  return request('POST', '/getUserList', { data: params }).then((res: any) => {
    return res.data;
  });
}
// 删除用户
export function deleteUser(params: any) {
  return request('POST', '/deleteUser', { data: params }).then((res: any) => {
    return res.data;
  });
}
// 修改管理员密码
export function editAdminPassword(params: any) {
  return request('POST', '/editAdminPassword', { data: params }).then(
    (res: any) => {
      return res.data;
    },
  );
}
