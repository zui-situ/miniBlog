import { GetterTree } from 'vuex';
import { State } from './state';
const getters: GetterTree<State, any> = {
    token(state) {
        return state.token;
    }
};

export default getters;