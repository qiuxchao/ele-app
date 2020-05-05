import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入 axios 请求模块
import axios from 'axios'
// 引入 qs 模块，该模块可以避免出现跨域问题，避免自动的将 post 请求转为 option 请求
// import qs from 'qs'

// 将 axios 加入到 Vue 的原型上，这样在所有组件中都能使用 axios
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
// 设置 axios 的根接口地址
// axios.defaults.baseURL = "https://ele-interface.herokuapp.com";


// 引入 mint-ui
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
// 引入 mint-ui 加载动画
import {Indicator} from 'mint-ui'
// 使用 mint-ui
Vue.use(MintUI);

// 请求拦截，载入 mint-ui 加载动画
axios.interceptors.request.use(config => {
  //   // 使用 qs 包装post 请求内容，避免抛出跨域错误
  // if (config.method == 'post') {
  //   config.data = qs.stringify(config.data);
  //   }

  // 使用加载动画
  Indicator.open();
  return config;
}, error => {
    return Promise.reject(error);
})



// 响应拦截，请求成功后关闭加载动画，请求失败后错误提醒
axios.interceptors.response.use(response => {
  // 请求成功，关闭加载动画
  Indicator.close();
  return response;
}, error => {
    // 请求失败, 错误提醒
    Indicator.close();
    return Promise.reject(error);
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
