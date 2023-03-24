// import { Menu } from '@element-plus/icons-vue/dist/types';
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home/index.vue';
import testPaper from '@/views/TestPaper/index.vue';
import me_info from '@/views/Personal/me_info.vue';
import me_collection from '@/views/Personal/me_collection.vue';
import subject_me from '@/views/Personal/subject_me.vue';
import me_history from '@/views/Personal/me_history.vue';
import me_news from '@/views/Personal/me_news.vue';
import me_test_paper from '@/views/Personal/me_test_paper.vue';
import addSubject from '@/views/UploadQuestion/index.vue';
import addPaper from '@/views/addPaper/Index.vue';
import questionPage from '@/views/QuestionPage/index.vue';
import ProblemInfo from '@/views/ProblemInfo/ProblemInfo.vue';
import user from '@/views/Personal/user.vue';
import volume from '@/components/volume.vue';
import Login from '@/views/login/Login.vue';

const routes: any = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      needLogin: true, //需要加校检判断的路由
    },
  },
  {
    path: '/questionPage',
    name: 'questionPage',
    component: questionPage,
    meta: {
      needLogin: true, //需要加校检判断的路由
    },
  },
  {
    path: '/testPaper',
    name: 'testPaper',
    component: testPaper,
  },
  {
    path: '/user',
    name: 'user',
    component: user,
    children: [
      {
        path: 'me_info',
        component: me_info,
      },
      {
        path: 'me_collection',
        component: me_collection,
      },
      {
        path: 'subject_me',
        component: subject_me,
      },
      {
        path: 'me_history',
        component: me_history,
      },
      {
        path: 'me_test_paper',
        component: me_test_paper,
      },
      {
        path: 'me_news',
        component: me_news,
      },
    ],
  },
  {
    path: '/addSubject',
    name: 'addSubject',
    component: addSubject,
  },
  {
    path: '/addPaper',
    name: 'addPaper',
    component: addPaper,
  },
  {
    path: '/problemInfo',
    name: 'problemInfo',
    component: ProblemInfo,
  },
  {
    path: '/volume',
    name: 'volume',
    component: volume,
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
