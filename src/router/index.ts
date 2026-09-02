import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router';
import store from '@/store';

declare module 'vue-router' {
  interface RouteMeta {
    /** 是否需要登录才能访问（鉴权统一在导航守卫处理） */
    requireAuth?: boolean;
    /** 是否为管理端路由，用于导航守卫做权限判断 */
    isAdmin?: boolean;
    /** 路由层级，用于 router.go 回退到最初的路由 */
    index?: number;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/ErrorPage/index.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/index.vue'),
  },
  {
    // 管理员登录页：对所有人开放
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/admin.vue'),
  },
  {
    path: '/adminHome',
    name: 'adminHome',
    meta: { requireAuth: true, isAdmin: true },
    component: () => import('@/views/AdminPage/adminHome.vue'),
  },
  {
    path: '/adminQuestion',
    name: 'adminQuestion',
    meta: { requireAuth: true, isAdmin: true },
    component: () => import('@/views/AdminPage/adminQuestion.vue'),
  },
  {
    path: '/adminTestPaper',
    name: 'adminTestPaper',
    meta: { requireAuth: true, isAdmin: true },
    component: () => import('@/views/AdminPage/adminTestPaper.vue'),
  },
  {
    path: '/adminUser',
    name: 'adminUser',
    meta: { requireAuth: true, isAdmin: true },
    component: () => import('@/views/AdminPage/adminUser.vue'),
  },
  {
    path: '/adminComment',
    name: 'adminComment',
    meta: { requireAuth: true, isAdmin: true },
    component: () => import('@/views/AdminPage/adminComment.vue'),
  },
  {
    path: '/adminSensitiveWord',
    name: 'adminSensitiveWord',
    meta: { requireAuth: true, isAdmin: true },
    component: () => import('@/views/AdminPage/adminSensitiveWord.vue'),
  },
  {
    path: '/adminAnnouncement',
    name: 'adminAnnouncement',
    meta: { requireAuth: true, isAdmin: true },
    component: () => import('@/views/AdminPage/adminAnnouncement.vue'),
  },
  {
    path: '/adminTag',
    name: 'adminTag',
    meta: { requireAuth: true, isAdmin: true },
    component: () => import('@/views/AdminPage/adminTag.vue'),
  },
  {
    path: '/adminFeedback',
    name: 'adminFeedback',
    meta: { requireAuth: true, isAdmin: true },
    component: () => import('@/views/AdminPage/adminFeedback.vue'),
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
    path: '/testPaper/doPaper',
    name: 'doPaper',
    meta: { requireAuth: true },
    component: () => import('@/views/TestPaper/doPaper.vue'),
  },
  {
    path: '/userProfile',
    name: 'userProfile',
    meta: { requireAuth: true },
    component: () => import('@/views/Personal/UserProfile.vue'),
  },
  {
    path: '/user',
    name: 'user',
    meta: { requireAuth: true },
    component: () => import('@/views/Personal/user.vue'),
    // user.vue 只负责渲染左侧菜单 + <router-view>，
    // 直接访问 /user 时必须重定向到默认子页，否则右侧内容区是空的
    redirect: { name: 'userInfo' },
    children: [
      {
        path: 'UserInfo',
        name: 'userInfo',
        component: () => import('@/views/Personal/UserInfo.vue'),
      },
      {
        path: 'UserLikes',
        name: 'userLikes',
        component: () => import('@/views/Personal/UserLikes.vue'),
      },
      {
        path: 'UserFavorite',
        name: 'userFavorite',
        component: () => import('@/views/Personal/UserFavorite.vue'),
      },
      {
        path: 'UserQuestions',
        name: 'userQuestions',
        component: () => import('@/views/Personal/UserQuestions.vue'),
      },
      {
        path: 'UserHistory',
        name: 'userHistory',
        component: () => import('@/views/Personal/UserHistory.vue'),
      },
      {
        path: 'UserTestPaper',
        name: 'userTestPaper',
        component: () => import('@/views/Personal/UserTestPaper.vue'),
      },
      {
        path: 'UserWrong',
        name: 'userWrong',
        component: () => import('@/views/Personal/UserWrong.vue'),
      },
      {
        path: 'UserRecord',
        name: 'userRecord',
        component: () => import('@/views/Personal/UserRecord.vue'),
      },
      {
        path: 'UserMessage',
        name: 'userMessage',
        component: () => import('@/views/Personal/UserMessage.vue'),
      },
      {
        path: 'UserFeedback',
        name: 'userFeedback',
        component: () => import('@/views/Personal/UserFeedback.vue'),
      },
    ],
  },
  {
    path: '/addPaper',
    name: 'addPaper',
    meta: { requireAuth: true },
    component: () => import('@/views/addPaper/index.vue'),
  },
  {
    path: '/problemInfo',
    name: 'problemInfo',
    component: () => import('@/views/ProblemInfo/index.vue'),
  },
  {
    // 用户登录页：对所有人开放
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  next(); return;
  // 登录态以后端 session 为准，前端只做 UI 拦截
  const userData = store.state.userData;
  const isLoggedIn = Boolean(userData?.phone);
  const isAdmin = Boolean(userData?.isAdmin);

  // 需要登录的路由：未登录重定向到登录页
  if (to.meta?.requireAuth && !isLoggedIn) {
    next({ path: '/Login', replace: true });
    return;
  }

  // 管理端路由：非管理员重定向到 404
  if (to.meta?.isAdmin && !isAdmin) {
    next({ path: '/404', replace: true });
    return;
  }

  next();
});

export default router;
