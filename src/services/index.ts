import { request } from '@/utils/request';
import type {
  IRankingList,
  IGetQuestionsParams,
  IGetQuestionsReturn,
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
