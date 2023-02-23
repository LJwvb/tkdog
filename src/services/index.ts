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
} from '@/types';

// 排行榜接口
export function getRankList() {
  return request('GET', '/getRankingList').then((res: any) => {
    return res.data.data as IRankingList;
  });
}
// 获取审核后的题目接口
export function getQuestionList(params: IGetQuestionsParams) {
  return request('POST', '/getQuestions', { data: params }).then((res: any) => {
    return res.data.data as IGetQuestionsReturn;
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
// 题目浏览接口
export function browseQuestion(params: IBrowseQuestion) {
  return request('POST', '/addBrowsesNum', { data: params });
}
// 组卷接口
export function getPaperQuestion(params: IGetPaperParams) {
  return request('POST', '/getPaperQuestions', { data: params }).then(
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
