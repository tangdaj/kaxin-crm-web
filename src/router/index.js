import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../views/Home";
import Welcome from "../components/Welcome";
import AccountMaintenance from "../components/setting/AccountMaintenance";
import MenuManagement from "../components/setting/MenuManagement";
import NumberOwnership from "../components/setting/NumberOwnership";
import RoleManagement from "../components/setting/RoleManagement";
import scBilledQuery from "../components/sc/scBilledQuery";
import scOperationLog from "../components/sc/scOperationLog";
import scTrumpetManagement from "../components/sc/scTrumpetManagement";
import ynBilledQuery from "../components/yn/ynBilledQuery";
import ynOperationLog from "../components/yn/ynOperationLog";
import ynTrumpetManagement from "../components/yn/ynTrumpetManagement";
import smsReceivingRecord from "../components/yn/smsReceivingRecord";
import smsSendingRecord from "../components/yn/smsSendingRecord";
import EditPassword from "../components/setting/EditPassword";
import Upload from "@/components/Upload";
import Login1 from "@/components/Login1";
import Statistics from "../components/yn/Statistics";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login1',
    name: 'Login1',
    component: Login1
  },
  {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'home',
      redirect: '/welcome',
        component: Home,
        children: [
          {
            path: '/roleManagement',
            component: RoleManagement
          }, {
            path: '/welcome',
            name:'welcome',
            component: Welcome
          },

          {
            path: '/upload',
            component: Upload
          },
          {
            path: '/statistics',
            component: Statistics
          },
          {
            path: '/numberOwnership',
            component: NumberOwnership
          },
          {
            path: '/menuManagement',
            component: MenuManagement
          },
          {
            path: '/editPassword',
            component: EditPassword
          },
          {
            path: '/accountMaintenance',
            component: AccountMaintenance
          },
          {
            path: '/scOperationLog',
            component: scOperationLog
          },
          {
            path: '/scTrumpetManagement',
            component: scTrumpetManagement
          },
          {
            path: '/scBilledQuery',
            component: scBilledQuery
          },
          {
            path: '/ynTrumpetManagement',
            component: ynTrumpetManagement
          },
          {
            path: '/ynOperationLog',
            component: ynOperationLog
          },
          {
            path: '/ynBilledQuery',
            component: ynBilledQuery
          },
          {
            path: '/smsSendingRecord',
            component: smsSendingRecord
          },
          {
            path: '/smsReceivingRecord',
            component: smsReceivingRecord
          },

        ],
    },
]

const router = new VueRouter({
  mode: 'history',
  //mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
/*router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径而来
  //next() 代表放行 next('xxx') 强制放行的xxx的路径
  if(to.path==='/'||to.path==='/login1'){
    next();
  }else{
    const tokenStr=window.localStorage.getItem('token')
    if(!tokenStr){
      return next('/login')
    }
    next()
  }
})*/

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/login') {
    next();
  } else {
    let token = localStorage.getItem('Authorization');
    if (token === 'null' || token === '') {
      next('/login');
    } else {
      next();
    }
  }
});
export default router


