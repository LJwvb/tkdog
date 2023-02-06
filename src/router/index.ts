// import { Menu } from '@element-plus/icons-vue/dist/types';
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import NavBar from '../components/NavBar/index.vue';
import Tabs from '../components/Index/Tabs.vue';
import Subject from '../components/subject.vue';
import label from '../components/subject/label.vue';
import subject_bytype from '../components/subject/subject_bytype.vue';
import test_paper from '../components/Home/test_paper.vue';
import me_info from '../views/me/me_info.vue';
import me_collection from '../views/me/me_collection.vue';
import subject_me from '../views/me/subject_me.vue';
import me_history from '../views/me/me_history.vue';
import me_news from '../views/me/me_news.vue';
import add_subject from '../components/add_subject.vue';
import addPaper from '../views/addPaper.vue';
import addPaperone from '../views/addPaper/one.vue';
import addPapertwo from '../views/addPaper/two.vue';
import addPaperthree from '../views/addPaper/three.vue';
import addPaperfour from '../views/addPaper/four.vue';
import problem_info from '../views/problem_info.vue';
import me_test_paper from '../views/me/me_test_paper.vue';
import user from '../components/user.vue';
import volume from '../components/volume.vue';
import Login from '../views/login/Login.vue';

const routes: any = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/subject',
    name: 'subject',
    component: Subject,
    children: [
      {
        path: 'subject_bytype',
        name: 'subject_bytype',
        component: subject_bytype,
      },
    ],
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
    path: '/add_subject',
    name: 'add_subject',
    component: add_subject,
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
    path: '/problem_info',
    name: 'problem_info',
    component: problem_info,
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
