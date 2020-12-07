import minRequest from '../models/api.js'
import Vue from 'vue'
import store from '../store'
import { navigateBack } from './common.d'
declare module 'vue/types/vue' {
  // 3. 声明为 Vue 补充的东西
  interface Vue {
    $http:any,
    $store:store
    navigateBack:any
  }
}