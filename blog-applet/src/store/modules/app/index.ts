import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import state, { AppState } from './state';
import { Module } from 'vuex';
import { RootState } from '../../index';

const app: Module<AppState, RootState> = {
  // 表示允许  使用namespaced方法使用该模块，必须有
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default app;