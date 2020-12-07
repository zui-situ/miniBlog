import { GetterTree } from 'vuex';
import { AppState } from './state';
import { RootState } from '../../index';
const getters: GetterTree<AppState, RootState> = {
    user(state) {
        state.user;
        let _vuex = uni.getStorageSync('vuex');
        if (!_vuex) {
            return '';
        }
        state.user = JSON.parse(_vuex).app.user;
        return state.user;
    },
    token(state) {
        state.token;
        let _vuex = uni.getStorageSync('vuex');
        if (!_vuex) {
            return '';
        }
        state.token = JSON.parse(_vuex).app.token;
        return state.token;
    }
};

export default getters;