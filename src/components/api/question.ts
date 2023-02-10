import { params } from './params';
import { ref } from 'vue';
import { request } from '@/utils/request';
// const params = {
//   currentPage: 0,
//   pageSize: 5,
//   subjectID: 1,
//   catalogID: 1,
// };

interface Question {
  question: string;
  questionType: string;
  direction: string;
  difficulty: String;
  likes_num: number;
  browses_num: number;
}
export const question = ref<Question[]>([]);
request('POST', '/getQuestions', { data: params }).then((res: any) => {
  console.log(res);
  question.value = res.data.data.result;
});
