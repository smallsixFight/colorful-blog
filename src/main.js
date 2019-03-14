import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';


Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.HOST = 'http://localhost:9000'
Vue.use(ElementUI)

function getPath() {
  const path = window.location.pathname.split("/")[1]
  console.log(path)
  return '/' + window.location.pathname.split("/")[1];
}

Vue.filter('unixTimeFormat', function(val) {
  let date = new Date(val * 1000);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  return Y + M + D;
})

Vue.filter('blogTimeFormat', function(val) {
  let date = new Date(val * 1000).toDateString().split(" ");
  return date[1] + " " + date[2] + ", " + date[3];
})

Vue.filter('archiveTimeFormat', function(val) {
  let date = new Date(val * 1000);
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ': ';
  return M + D;
})

router.beforeEach((to, from, next) => {
  let accessToken = localStorage.getItem("accessToken")
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
  if(to.meta.content) {
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
    if (localStorage.getItem("accessToken")) {
      config.headers.Authorization = localStorage.getItem("accessToken")
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
        case 401:
          localStorage.setItem("accessToken", '')
          ElementUI.Message.warning("登录超时！")
          router.replace({
            path: '/admin/login'
          })
          break
        case 500:
          ElementUI.Message.error("服务器错误T_T")
          router.replace({
            path: getPath()
          })
          break
      }
    }
    ElementUI.Message.error("服务器崩溃了~ QAQ")
    router.replace({
      path: getPath() + '/login'
    })
    return Promise.reject(error)
  }
)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
