// import { Menu } from '@element-plus/icons-vue/dist/types';
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home/index.vue';
// import NavBar from '../components/NavBar/index.vue';
import test_paper from '../components/Home/test_paper.vue';
import me_info from '@/views/Personal/me_info.vue';
import me_collection from '@/views/Personal/me_collection.vue';
import subject_me from '@/views/Personal/subject_me.vue';
import me_history from '@/views/Personal/me_history.vue';
import me_news from '@/views/Personal/me_news.vue';
import me_test_paper from '@/views/Personal/me_test_paper.vue';
import addSubject from '@/views/UploadQuestion/index.vue';
import addPaper from '@/views/addPaper/addPaper.vue';
import questionPage from '@/views/QuestionPage/index.vue';
import addPaperone from '../views/addPaper/one.vue';
import addPapertwo from '../views/addPaper/two.vue';
import addPaperthree from '../views/addPaper/three.vue';
import addPaperfour from '../views/addPaper/four.vue';
import ProblemInfo from '@/views/ProblemInfo/ProblemInfo.vue';
import user from '../views/Personal/user.vue';
import volume from '../components/volume.vue';
import Login from '../views/login/Login.vue';

const routes: any = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/questionPage',
    name: 'questionPage',
    component: questionPage,
  },
  {
    path: '/test_paper',
    name: 'test_paper',
    component: test_paper,
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
    children: [
      {
        path: 'addPaperone',
        component: addPaperone,
      },
      {
        path: 'addPapertwo',
        component: addPapertwo,
      },
      {
        path: 'addPaperthree',
        component: addPaperthree,
      },
      {
        path: 'addPaperfour',
        component: addPaperfour,
      },
    ],
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
