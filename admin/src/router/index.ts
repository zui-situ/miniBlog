import Vue from 'vue'
import VueRouter, { RouteConfig }  from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import ResourceCrud from '../views/ResourceCrud.vue';
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path:'/login',
    name:'Login',
    component:Login,
    meta:{ isPublic:true }
  },
  {
    path: '/',
    name: 'Main',
    component: Main,
    children:[
      { name:'Home', path:'/', component:Home },
      { name:'resource-crud', path:'/:resource/list', component:ResourceCrud, props:true },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/admin',
  routes
})

const originalPush:any = VueRouter.prototype.push
VueRouter.prototype.push = function push(location:any) {
    return originalPush.call(this, location).catch((err:any) => err)
}

export default router
