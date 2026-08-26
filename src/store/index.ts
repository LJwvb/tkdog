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
  isAdmin?: boolean;
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
    createPersistedState({
      storage: window?.sessionStorage,
    }),
  ],
});
