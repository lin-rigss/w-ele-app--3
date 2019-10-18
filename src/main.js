import Vue from 'vue';
import App from './App.vue';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import router from './router';
import store from './store';
import axios from 'axios';
import qs from 'qs';  // 前端解决 post请求跨域问题，出现options

import { Indicator } from 'mint-ui';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

Vue.use(MintUI);

axios.defaults.baseURL = 'https://ele-interface.herokuapp.com/';

// 请求拦截
axios.interceptors.request.use(
  config => {
    // 如果是post请求  就调用qs中的一个方法解决
    if (config.method == 'post') {
      config.data = qs.stringify(config.data);
    }

    // 加载动画
    Indicator.open();
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截
axios.interceptors.response.use(
  response => {
    Indicator.close();
    return response;
  },
  error => {
    // 错误提醒
    Indicator.close();
    return Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
