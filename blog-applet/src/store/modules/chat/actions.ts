import { ActionTree } from 'vuex';
import { ChatState } from './state';
import { RootState } from '../../index';
import io from '@hyoga/uni-socket.io';
import Vue from 'vue';
import http from '@/models/api' ;
import appStore from "../app/state";
import { mapState } from "vuex";
// import { processReturn } from '@/utils/common.ts';
import {
  SET_SOCKET,
  ADD_GROUP_MESSAGE,
  SET_GROUP_MESSAGES,
  ADD_FRIEND_MESSAGE,
  SET_FRIEND_MESSAGES,
  SET_GROUP_GATHER,
  SET_FRIEND_GATHER,
  SET_USER_GATHER,
  SET_ACTIVE_ROOM,
} from './mutation-types';

const actions: ActionTree<ChatState, RootState> = {
  // 初始化socket连接和监听socket事件
  async connectSocket({ commit, state, dispatch, rootState }, callback) {
    let user = rootState.app.user;
    // let friendGather = state.friendGather;
    let socket = io(process.env.VUE_APP_BASE_URL,{
      query: {
        userId:rootState.app.user.userId
      },
      transports: [ 'websocket', 'polling' ],
      timeout: 5000,
    });
    socket.on('connect', async (data:any) => {
      // 先保存好socket对象
      commit(SET_SOCKET, socket);
      dispatch('handleChatData');
      // 先保存好socket对象
      // uni.setStorageSync('socket',socket);
    });
    socket.on('messageFromFriend', (res: any) => {
      commit('addTargetMessage',res);
      commit('updateDialogMes',res);
      // if (!res.code) {
      //   if (res.data.friendId === user.userId || res.data.userId === user.userId) {
      //     console.log('ADD_FRIEND_MESSAGE', res.data);
      //     commit(ADD_FRIEND_MESSAGE, res.data);
      //   }
      // }
    });
  },
  async handleChatData({ commit, state, dispatch, rootState }, callback){
    console.log(rootState);
    let list = await http.apis.friendList({})
    list.map((item:any)=>{
      console.log(item);
      if(state.socket.connected){
        state.socket.emit("joinFriendSocket", {
            userId: rootState.app.user.userId,
            friendId: item.friendInfo[0]._id,
        })
      }
      item.unreadMsgCount = 0;
    })
    commit('initDialogList',list)
  }
};

export default actions;
