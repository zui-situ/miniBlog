// import store from './api.js' 
// declare module 'vue/types/options' {
//     interface ComponentOptions<V extends Vue> {
//         store?: store
//     }
// }

import Vue from 'vue';
import Vuex, { ModuleTree } from 'vuex';

// app
import app from './modules/app';
import { AppState } from './modules/app/state';

import createPersistedState from 'vuex-persistedstate'

const vuexPersisted = new createPersistedState({
    storage: {
    	  getItem: (key:any) => uni.getStorageSync(key),
        setItem: (key:any, value:any) => uni.setStorageSync(key, value),
        removeItem: (key:any) => uni.removeStorageSync(key)
    },
    reducer(val:any){
      return {
        app:val.app
      }
    }
})

// chat
import chat from './modules/chat';
import { ChatState } from './modules/chat/state';

export type RootState = {
  app: AppState;
  chat: ChatState;
};

Vue.use(Vuex);

const modules: ModuleTree<RootState> = {
  app,
  chat,
};

export default new Vuex.Store({
  modules,
  plugins:[vuexPersisted]
});