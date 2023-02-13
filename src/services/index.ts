import { request } from '@/utils/request';
import type {
  IRankingList,
  IGetQuestionsParams,
  IGetQuestionsReturn,
  IGetQuestionDetailParams,
  IQuestion,
  ILikeQuestionParams,
  ICancelLikeQuestionParams,
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
