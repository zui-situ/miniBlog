import Vue from 'vue';
import {
  SET_SOCKET,
  SET_TARGET_MES,
  CLEAR_UNREAD_MES_COUNT,
  DEL_MES_MAP,
  SET_TARGET_ID,
  INIT_DIALOG_LIST,
  ADD_TARGET_MES,
  ADD_DIALOG_MES,
  UPDATE_DIALOG_MES,
  DEL_TARGET_ID
} from './mutation-types';
import { ChatState } from './state';
import { MutationTree } from 'vuex';



const mutations: MutationTree<ChatState> = {
  // 保存socket
  [SET_SOCKET](state, payload: any) {
    state.socket = payload;
  },
  //初始化已登录用户的对话信息
  [INIT_DIALOG_LIST](state,payload) {
    state.dialogList = payload;
  },
  //更新对话信息
  [UPDATE_DIALOG_MES](state,payload) {
    const dialogList = state.dialogList;
    if (payload.code=='OK') {
      const info = payload.messageInfo;
      // 如果已有此对话信息则进行对话信息的更新
      for(let i=0;i<dialogList.length;i++) {
        if(dialogList[i]._id === info.senderId || dialogList[i]._id === info.receiverId) {
            dialogList[i].createdAt = info.createdAt;
            dialogList[i].lastMessage = info.content;
            if(state.targetId != dialogList[i]._id){
              ++dialogList[i].unreadMsgCount;
            }
            //置顶对话
            const mes = state.dialogList[i];
            state.dialogList.splice(i,1);
            state.dialogList.unshift(mes);
            return;
        }
      }
      // 没有，则进行添加
      // store.commit('addDialogMes',payload);
    }
  },
  // 添加对话信息
  [ADD_DIALOG_MES](state,payload) {
    state.dialogList.unshift(payload);
  },
  //添加对话信息
  [ADD_TARGET_MES](state,payload) {
    console.log(payload);
    if (payload.code=='OK') {
      state.targetMessage.push(payload.messageInfo);
    }
  },
  //设置目标信息
  [SET_TARGET_MES](state,payload) {
    if (payload && payload.length) {
      if (state.targetMessage.length===0) {
        state.targetMessage = payload;
      } else {
        state.targetMessage = [...payload,...state.targetMessage];
      }
    }
  },
  //清零未读信息数
  [CLEAR_UNREAD_MES_COUNT](state,payload){
    if(state.targetId != ''){
      const dialogList = state.dialogList;
      for(let i=0;i<dialogList.length;i++) {
        if(dialogList[i]._id === payload) {
            dialogList[i].unreadMsgCount = 0;
            return;
        }
      }
    }
  },
  //删除对应目标ID的聊天内容
  [DEL_MES_MAP](state,payload){
    state.targetMessage = [];
  },
  //设置当前聊天对象的用户的ID
  [SET_TARGET_ID](state,payload) {
    state.targetId = payload;
  },
  //删除当前聊天对象的用户的ID
  [DEL_TARGET_ID](state,payload) {
    state.targetId = '';
  }
};

export default mutations;
