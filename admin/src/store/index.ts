import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import state from './state'
import getters from './getters'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    plugins:[persistedState()]
})