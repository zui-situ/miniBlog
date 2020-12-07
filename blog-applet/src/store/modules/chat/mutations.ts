import Vue from 'vue';
import {
  SET_SOCKET,
  ADD_GROUP_MESSAGE,
  SET_GROUP_MESSAGES,
  ADD_FRIEND_MESSAGE,
  SET_FRIEND_MESSAGES,
  SET_ACTIVE_ROOM,
  SET_GROUP_GATHER,
  SET_FRIEND_GATHER,
  SET_USER_GATHER,
} from './mutation-types';
import { ChatState } from './state';
import { MutationTree } from 'vuex';



const mutations: MutationTree<ChatState> = {
  // 保存socket
  [SET_SOCKET](state, payload: any) {
    state.socket = payload;
  },
  //初始化已登录用户的对话信息
  initDialogList(state,payload) {
    state.dialogList = payload;
  },
  //更新对话信息
  updateDialogMes(state,payload) {
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
  addDialogMes(state,payload) {
    state.dialogList.unshift(payload);
  },
  //添加对话信息
  addTargetMessage(state,payload) {
    if (payload.code=='OK') {
      state.targetMessage.push(payload.messageInfo);
    }
  },
  //设置目标信息
  setTargetMessage(state,payload) {
    if (payload && payload.length) {
      if (state.targetMessage.length===0) {
        state.targetMessage = payload;
      } else {
        state.targetMessage = [...payload,...state.targetMessage];
      }
    }
  },
  //清零未读信息数
  clearUnreadMsgCount(state,payload){
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
  delMessageMap(state,payload){
    state.targetMessage = [];
  },
  //设置当前聊天对象的用户的ID
  setTargetId(state,payload) {
    state.targetId = payload;
  },
  //删除当前聊天对象的用户的ID
  delTargetId(state,payload) {
    state.targetId = '';
  }
};

export default mutations;
