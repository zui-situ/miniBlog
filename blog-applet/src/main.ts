import Vue from 'vue';
import App from './App.vue';
import minRequest from './models/api' ;
import './plugins/http';
import './plugins/uview';
import store from './store'
import common from './assets/js/common';

Vue.config.productionTip = false
Object.assign(Vue.prototype, common)
Vue.prototype.$store = store;

const app = new Vue({
    ...App,
    minRequest,
    store
})
app.$mount()
