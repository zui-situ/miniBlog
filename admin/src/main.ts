import Vue from 'vue'
import App from './App.vue'
import './plugins/element'
import './plugins/avue'
import router from './router'
import axios from 'axios';
import http from './http';
import store from './store';

Vue.config.productionTip = false

Vue.prototype.$http = http;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
