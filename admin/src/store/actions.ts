import { SET_TOKEN } from './mutation-types';
import { ActionTree } from 'vuex';
import { State } from './state';
import http from '../http';
import router from '../router';
import Vue from 'vue';

const actions: ActionTree<State, any> = {
    async login({ commit }, payload) {
        let res:any = await http.post('auth/login',{
            ...payload,
        });
        if (res) {
            if(res.code=='OK'){
                Vue.prototype.$message({
                    type:'success',
                    message:res.msg
                })
                router.push('/');
                commit(SET_TOKEN, 'Bearer '+res.data.token);
            }else{
                Vue.prototype.$message({
                    type:'error',
                    message:res.msg
                })
            }
            return res;
        }
    },
};

export default actions;