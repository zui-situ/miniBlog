import { SET_USER, CLEAR_USER, SET_TOKEN } from './mutation-types';
import { AppState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<AppState> = {
  [SET_USER](state, payload) {
    state.user = payload;
    // 数据持久化
    // uni.setStorageSync('user',payload);
  },

  [CLEAR_USER](state, payload) {
    state.user = {
        userId: '',
        avatar: '',
        openid:'',
        nickName:''
    };
    // uni.setStorageSync('user','');
  },

  [SET_TOKEN](state, payload) {
    state.token = payload;
    // 数据持久化
    // uni.setStorageSync('token',payload);
  }
};

export default mutations;