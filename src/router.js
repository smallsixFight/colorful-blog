import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: Home,
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: () => import('./views/Dashboard.vue'),
          meta: { 
            title: 'Colorful - 仪表盘',
            requireAuth: true
          }
        },
        {
          path: '/articleList',
          component: () => import('./views/ArticleList.vue'),
          meta: { 
            title: 'Colorful - 我的文章',
            requireAuth: true
          }
        },
        {
          path: '/articleEdit',
          component: () => import('./views/ArticleEdit.vue'),
          meta: { 
            title: 'Colorful - 文章编辑',
            requireAuth: true
          }
        },
        {
          path: '/pageList',
          component: () => import('./views/PageList.vue'),
          meta: { 
            title: 'Colorful - 自定义页面',
            requireAuth: true
          }
        },
        {
          path: '/pageEdit',
          component: () => import('./views/PageEdit.vue'),
          meta: { 
            title: 'Colorful - 页面编辑',
            requireAuth: true
          }
        },
        {
          path: '/commentList',
          component: () => import('./views/CommentList.vue'),
          meta: { 
            title: 'Colorful - 评论管理',
            requireAuth: true
          }
        },
        {
          path: '/categoryTagList',
          component: () => import('./views/CategoryTagList.vue'),
          meta: { 
            title: 'Colorful - 分类 / 标签',
            requireAuth: true
          }
        },
        {
          path: '/linkList',
          component: () => import('./views/LinkList.vue'),
          meta: { 
            title: 'Colorful - 友链管理',
            requireAuth: true
          }
        },
        // {
        //   path: '/logList',
        //   component: () => import('./views/LogList.vue'),
        //   meta: { 
        //     title: 'Colorful - 系统日志',
        //     requireAuth: true
        //   }
        // },
        {
          path: '/attachmentManagement',
          component: () => import('./views/AttachmentManagement.vue'),
          meta: { 
            title: 'Colorful - 附件管理',
            requireAuth: true
          }
        },
        {
          path: '/sysSetting',
          component: () => import('./views/SysSetting.vue'),
          meta: { 
            title: 'Colorful - 系统设置',
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/404',
      component: () => import('./views/404.vue'),
      meta: { 
        title: '404',
        requireAuth: false
      }
    },
    {
      path: '/login',
      name: "login",
      component: Login,
      meta: {
        title: "Colorful - 登录",
        requireAuth: false
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
