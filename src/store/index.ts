import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
export default createStore({
  state: {
    userData: {
      avatar: '',
      ctime: '',
      email: '',
      last_login_time: '',
      likeTopicsId: [],
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
  },
  mutations: {
    setUserData(state, payload) {
      state.userData = payload;
    },
    addSelectedTopic(state, payload) {
      state.selectedTopic = payload;
    },
    setActiveMenuIndex(state, payload) {
      state.activeMenuIndex = payload;
    },
    setBrowseTopicsId(state, payload) {
      state.browseTopicsId = payload;
    },
    setSearchHistory(state, payload) {
      state.searchHistory = payload;
    },
    setPaperInfo(state, payload) {
      state.paperInfo = payload;
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
