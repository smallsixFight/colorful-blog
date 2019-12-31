import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';


Vue.config.productionTip = false
Vue.prototype.$axios = axios
// Vue.prototype.HOST = 'http://localhost:9011/api'
Vue.prototype.HOST = '/api'
Vue.use(ElementUI)
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

function getPath() {
  return '/' + window.location.pathname.split("/")[1] + '/';
}

router.beforeEach((to, from, next) => {
  let accessToken = sessionStorage.getItem("accessToken")
  if (to.meta.requireAuth) {
    if (accessToken) {
      next()
    } else {
      ElementUI.Message.warning("尚未登录")
      next({
        path: '/admin/login',
      })
    }
  }
  if (to.meta.content) {
    let head = document.getElementsByTagName('head');
    let meta = document.createElement('meta');
    meta.content = to.meta.content;
    head[0].appendChild(meta)
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
});

axios.interceptors.request.use(
  config => {
    if (sessionStorage.getItem("accessToken")) {
      config.headers.accessToken = sessionStorage.getItem("accessToken")
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          ElementUI.Message.warning("400 " + error.response.data.message);
          break;
        case 401:
          ElementUI.Message.warning("401 登录超时，请重新登录");
          break;
        case 500:
          ElementUI.Message.error("500 服务器错误T_T")
          break;
      }
    } else {
      ElementUI.Message.error("无法连接服务器~ QAQ")
      router.replace({
        path: getPath() + 'login'
      })
    }
    return Promise.reject(error)
  }
)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
