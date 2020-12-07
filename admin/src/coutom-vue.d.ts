import { AxiosInstance } from 'axios'
import VueRouter from 'vue-router'
import { Route } from 'vue-router'
import { ElMessage } from 'element-ui/types/message'
// import Vue from 'vue'
declare module 'vue/types/vue' {
  // 3. 声明为 Vue 补充的东西
  interface Vue {
    $http: AxiosInstance,
    $router:VueRouter,
    $route:Route,
    $message:ElMessage
  }
}