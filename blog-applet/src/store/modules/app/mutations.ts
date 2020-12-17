import { SET_USER, CLEAR_USER, SET_TOKEN } from './mutation-types';
import { AppState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<AppState> = {
  [SET_USER](state, payload) {
    state.user = payload;
  },

  [CLEAR_USER](state, payload) {
    state.user = {
        userId: '',
        avatar: '',
        openid:'',
        nickName:''
    };
  },

  [SET_TOKEN](state, payload) {
    state.token = payload;
  }
};

export default mutations;