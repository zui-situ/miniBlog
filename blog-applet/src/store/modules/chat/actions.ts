import { ActionTree } from 'vuex';
import { ChatState } from './state';
import { RootState } from '../../index';
import io from '@hyoga/uni-socket.io';
import http from '@/models/api' ;
// import { processReturn } from '@/utils/common.ts';
import {
  SET_SOCKET,
  ADD_TARGET_MES,
  UPDATE_DIALOG_MES,
  INIT_DIALOG_LIST,
} from './mutation-types';

const actions: ActionTree<ChatState, RootState> = {
  // 初始化socket连接和监听socket事件
  async connectSocket({ commit, state, dispatch, rootState }, callback) {
    // let friendGather = state.friendGather;
    let socket = io(process.env.VUE_APP_WSS_URL,{
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
      commit(ADD_TARGET_MES,res);
      commit(UPDATE_DIALOG_MES,res);
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
      if(state.socket.connected){
        state.socket.emit("joinFriendSocket", {
            userId: rootState.app.user.userId,
            friendId: item.friendInfo[0]._id,
        })
      }
      item.unreadMsgCount = 0;
    })
    commit(INIT_DIALOG_LIST,list)
  }
};

export default actions;
