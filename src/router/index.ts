import { createRouter, createWebHashHistory } from 'vue-router';

const routes: any = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/ErrorPage/index.vue'),
  },
  {
    path: '/',
    name: 'home',
    meta: {
      isAdmin: false,
    },
    component: () => import('@/views/Home/index.vue'),
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   component: () => import('@/views/admin/admin.vue'),
  // },
  {
    path: '/adminHome',
    name: 'adminHome',
    meta: {
      isAdmin: true,
    },
    component: () => import('@/views/AdminPage/adminHome.vue'),
  },
  {
    path: '/adminQuestion',
    name: 'adminQuestion',
    meta: {
      isAdmin: true,
    },
    component: () => import('@/views/AdminPage/adminQuestion.vue'),
  },
  {
    path: '/adminTestPaper',
    name: 'adminTestPaper',
    meta: {
      isAdmin: true,
    },
    component: () => import('@/views/AdminPage/adminTestPaper.vue'),
  },
  {
    path: '/adminUser',
    name: 'adminUser',
    isAdmin: true,
    meta: {
      isAdmin: true,
    },
    component: () => import('@/views/AdminPage/adminUser.vue'),
  },
  {
    path: '/questionPage',
    name: 'questionPage',
    meta: {
      isAdmin: false,
    },
    component: () => import('@/views/QuestionPage/index.vue'),
  },
  {
    path: '/testPaper',
    name: 'testPaper',
    meta: {
      isAdmin: false,
    },
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
    meta: {
      isAdmin: false,
    },
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
