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
      phone: '',
      sex: '',
      username: '',
    },
    selectedTopic: [],
  },
  mutations: {
    setUserData(state, payload) {
      state.userData = payload;
    },
    addSelectedTopic(state, payload) {
      state.selectedTopic = payload;
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
