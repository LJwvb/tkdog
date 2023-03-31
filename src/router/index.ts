import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/index.vue'),
  },
  {
    path: '/questionPage',
    name: 'questionPage',
    component: () => import('@/views/QuestionPage/index.vue'),
  },
  {
    path: '/testPaper',
    name: 'testPaper',
    component: () => import('@/views/TestPaper/index.vue'),
  },
  {
    path: '/testPaper/paperDetail',
    name: 'paperDetail',
    component: () => import('@/views/TestPaper/paperDetail.vue'),
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/Personal/User.vue'),
    children: [
      {
        path: 'UserInfo',
        component: () => import('@/views/Personal/UserInfo.vue'),
      },
      {
        path: 'UserLikes',
        component: () => import('@/views/Personal/UserLikes.vue'),
      },
      {
        path: 'UserQuestions',
        component: () => import('@/views/Personal/UserQuestions.vue'),
      },
      {
        path: 'UserHistory',
        component: () => import('@/views/Personal/UserHistory.vue'),
      },
      {
        path: 'UserTestPaper',
        component: () => import('@/views/Personal/UserTestPaper.vue'),
      },
      {
        path: 'UserMessage',
        component: () => import('@/views/Personal/UserMessage.vue'),
      },
    ],
  },
  {
    path: '/addSubject',
    name: 'addSubject',
    component: () => import('@/views/UploadQuestion/index.vue'),
  },
  {
    path: '/addPaper',
    name: 'addPaper',
    component: () => import('@/views/addPaper/index.vue'),
  },
  {
    path: '/problemInfo',
    name: 'problemInfo',
    component: () => import('@/views/ProblemInfo/index.vue'),
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
