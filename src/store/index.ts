import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import type { IQuestion } from '@/types';

export interface UserData {
  userId?: number;
  avatar: string;
  ctime: string;
  email: string;
  last_login_time: string;
  likeTopicsId: string;
  browseTopicsId: number[];
  phone: string;
  sex: string;
  username: string;
  name?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * 管理员身份（独立于 userData）。
 * 管理员走后端 ADMIN_SESS cookie 鉴权，不持有 JWT token；
 * 与普通用户身份分开存储，同一浏览器可同时持有两种身份、互不覆盖。
 */
export interface AdminData {
  id?: number;
  name?: string;
}

export interface PaperInfo {
  name?: string;
  desc?: string;
  auth?: string | number;
  dynamicTags?: string[];
}

export interface SearchHistory {
  keyword?: string;
  questionType?: string;
  difficulty?: string;
  currentPage?: number;
}

export interface RootState {
  userData: UserData;
  /** 管理员身份（与 userData 独立，同一浏览器可同时登录） */
  adminData: AdminData;
  selectedTopic: Array<IQuestion & { data?: string }>;
  paperInfo: PaperInfo;
  activeMenuIndex: string;
  browseTopicsId: number[];
  searchHistory: SearchHistory;
  unreadCount: number;
}

export default createStore<RootState>({
  state: {
    userData: {
      avatar: '',
      ctime: '',
      email: '',
      last_login_time: '',
      likeTopicsId: '',
      browseTopicsId: [],
      phone: '',
      sex: '',
      username: '',
    },
    adminData: {},
    selectedTopic: [],
    paperInfo: {},
    activeMenuIndex: '1',
    browseTopicsId: [],
    searchHistory: {},
    unreadCount: 0,
  },
  mutations: {
    setUserData(state, payload: UserData) {
      state.userData = payload;
    },
    setAdminData(state, payload: AdminData) {
      state.adminData = payload;
    },
    clearAdminData(state) {
      state.adminData = {};
    },
    addSelectedTopic(state, payload: Array<IQuestion & { data?: string }>) {
      state.selectedTopic = payload;
    },
    setSelectedTopic(state, payload: Array<IQuestion & { data?: string }>) {
      state.selectedTopic = payload;
    },
    setActiveMenuIndex(state, payload: string) {
      state.activeMenuIndex = payload;
    },
    setBrowseTopicsId(state, payload: number[]) {
      state.browseTopicsId = payload;
    },
    setSearchHistory(state, payload: SearchHistory) {
      state.searchHistory = payload;
    },
    setPaperInfo(state, payload: PaperInfo) {
      state.paperInfo = payload;
    },
    setUnreadCount(state, payload: number) {
      state.unreadCount = payload;
    },
  },
  actions: {},
  modules: {},
  plugins: [
    // 用 sessionStorage 而非 localStorage：sessionStorage 是「每个标签页独立」的，
    // 这样同一浏览器不同标签页可分别登录普通用户 / 管理员，互不影响。
    // 副作用：关闭标签页后登录态清空（已确认可接受）。
    createPersistedState({
      key: 'tkdog',
      storage: window?.sessionStorage,
    }),
  ],
});
