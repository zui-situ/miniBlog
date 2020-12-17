import { GetterTree } from 'vuex';
import { AppState } from './state';
import { RootState } from '../../index';
const getters: GetterTree<AppState, RootState> = {
    user(state) {
        return state.user;
    },
    token(state) {
        return state.token;
    },
    loginStatus(state) {
        return state.token?true:false;
    }
};

export default getters;