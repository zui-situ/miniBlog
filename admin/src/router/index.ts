import Vue from 'vue'
import VueRouter, { RouteConfig }  from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import ResourceCrud from '../views/ResourceCrud.vue';

Vue.use(VueRouter)

  const routes: RouteConfig[] = [
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
  routes
})

export default router
