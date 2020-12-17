import { GetterTree } from 'vuex';
import { ChatState } from './state';
import { RootState } from '../../index';

const getters: GetterTree<ChatState, RootState> = {
  socket(state) {
    console.log(state);
    return state.socket;
  },
  targetMessage(state) {
    return state.targetMessage;
  },
  dialogList(state) {
    return state.dialogList;
  },
//   friendGather(state) {
//     return state.friendGather;
//   },
//   userGather(state) {
//     return state.userGather;
//   },
};

export default getters;