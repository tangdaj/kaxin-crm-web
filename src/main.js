import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'nprogress/nprogress.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios' ;
import Vuex from 'vuex' //引入状态管理
// 引入echarts
import echarts from 'echarts'

Vue.prototype.$echarts = echarts


Vue.prototype.$http= axios ;
Vue.use(Vuex) ;

Vue.config.productionTip = false
Vue.use(ElementUI)

//这里要导入store
import store from "./store";

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('Authorization')) {
            config.headers.Authorization = localStorage.getItem('Authorization');
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    });

new Vue({
    //这里要配置store
    router, store:store,
    render: function (h) { return h(App) }
}).$mount('#app')



/*
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'nprogress/nprogress.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'



/!*axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'*!/

Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.config.productionTip = false


/!*Vue.filter('dateFormat', (originVal) => {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + 1 + '').padStart(2, '0')
    const hh = (dt.getHours() + 1 + '').padStart(2, '0')
    const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
    const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})*!/
// 定义全局过滤器  过滤器的名称=“dateFormat”
/!*Vue.filter('dateFormat', function (datestr, pattern = "") {
    var dt = new Date(datestr)
    var y = dt.getFullYear()
    var m = dt.getMonth() + 1
    var d = dt.getDate()

    if (pattern.toLowerCase() === 'yyyy-mm-dd') {

        return `${y}-${m}-${d}`

    } else {
        var hh = (dt.getHours()).toString().padStart(2, '0')
        var mm = (dt.getMinutes()).toString().padStart(2, '0')
        var ss = (dt.getSeconds()).toString().padStart(2, '0')
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

    }

})*!/

// 添加请求拦截器，在请求头中加token
/!*
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers.Authorization = localStorage.getItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });
*!/


import store from './store';
// 创建axios实例
var instance = axios.create({    timeout: 1000 * 12});
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/!**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 *!/
instance.interceptors.request.use(
    config => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        const token = store.state.user.token;
        token && (config.headers.common['token']  = token);
        return config;
    },
    error => Promise.error(error))
//在请求头中携带token
axios.defaults.headers.common['token'] =store.state.user.token;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')*/
