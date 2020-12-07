import { SET_USER, SET_TOKEN } from './mutation-types';
import { ActionTree } from 'vuex';
import { AppState } from './state';
import { RootState } from '../../index';
import http from '@/models/api' ;

const actions: ActionTree<AppState, RootState> = {
  async login({ commit }, payload) {
    let res = await http.apis.wxSaveUserByOpenId({
      ...payload,
    });
    if (res) {
      commit(SET_USER, {
        userId:res.user,
        openid:res.openid,
        nickName:res.nickName,
        avatar:res.avatarUrl
      });
      commit(SET_TOKEN, 'Bearer '+res.token);
      return res;
    }
  },
};

export default actions;
