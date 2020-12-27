import { SET_TOKEN,CLEAR_TOKEN } from './mutation-types';

import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  [CLEAR_TOKEN](state, payload) {
    state.token = '';
  },

  [SET_TOKEN](state, payload) {
    state.token = payload;
  }
};

export default mutations;