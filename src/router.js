import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/admin/Home.vue'
import Login from './views/admin/Login.vue'
import Index from './views/colorfulStory/Index.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: 'articlesList'
    },
    {
      path: '/',
      component: Index,
      meta: { 
        title: 'Colorful',
        requireAuth: false
      },
      children: [
        {
          path: '/articlesList',
          component: () => import('./views/colorfulStory/ArticlesList.vue'),
          meta: { requireAuth: false }
        },
        {
          path: '/article/:id',
          component: () => import('./views/colorfulStory/Article.vue'),
          meta: { requireAuth: false }
        },
        {
          path: '/read',
          component: () => import('./views/colorfulStory/Read.vue'),
          meta: { requireAuth: false }
        },
        {
          path: '/categories',
          component: () => import('./views/colorfulStory/Meta.vue'),
          meta: { requireAuth: false }
        },
        {
          path: '/tags',
          component: () => import('./views/colorfulStory/Meta.vue'),
          meta: { requireAuth: false }
        },
        {
          path: '/archive',
          component: () => import('./views/colorfulStory/Archive.vue'),
          meta: { requireAuth: false }
        },
        {
          path: '/page/:cid',
          component: () => import('./views/colorfulStory/Page.vue'),
          meta: { requireAuth: false }
        },
        {
          path: '/link',
          component: () => import('./views/colorfulStory/Link.vue'),
          meta: { requireAuth: false }
        },
      ]
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard'
    },
    {
      path: '/admin',
      component: Home,
      meta: { title: '自述文件' },
      children: [
        {
          path: '/admin/dashboard',
          component: () => import('./views/admin/Dashboard.vue'),
          meta: { 
            title: '仪表盘 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/articleList',
          component: () => import('./views/admin/ArticleList.vue'),
          meta: { 
            title: '我的文章 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/articleEdit',
          component: () => import('./views/admin/ArticleEdit.vue'),
          meta: { 
            title: '文章编辑 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/pageList',
          component: () => import('./views/admin/PageList.vue'),
          meta: { 
            title: '自定义页面 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/pageEdit',
          component: () => import('./views/admin/PageEdit.vue'),
          meta: { 
            title: '页面编辑 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/commentList',
          component: () => import('./views/admin/CommentList.vue'),
          meta: { 
            title: '评论管理 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/categoryTagList',
          component: () => import('./views/admin/CategoryTagList.vue'),
          meta: { 
            title: '分类 / 标签 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/linkList',
          component: () => import('./views/admin/LinkList.vue'),
          meta: { 
            title: '友链管理 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/attachManagement',
          component: () => import('./views/admin/AttachManagement.vue'),
          meta: { 
            title: '七牛云存储管理 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/sysSetting',
          component: () => import('./views/admin/SysSetting.vue'),
          meta: { 
            title: '系统设置 - Colorful',
            requireAuth: true
          }
        },
        {
          path: '/admin/logList',
          component: () => import('./views/admin/LogList.vue'),
          meta: { 
            title: '系统日志 - Colorful',
            requireAuth: true
          }
        },
      ]
    },
    {
      path: '/admin/404',
      component: () => import('./views/admin/404.vue'),
      meta: { 
        title: '404',
        requireAuth: false
      }
    },
    {
      path: '/404',
      component: () => import('./views/colorfulStory/404.vue'),
      meta: {
        title: "Colorful - 404",
        requireAuth: false
      }
    },
    {
      path: '/admin/login',
      name: "login",
      component: Login,
      meta: {
        title: "Colorful - 登录",
        requireAuth: false
      }
    },
    {
      path: '/admin/*',
      redirect: '/admin/404'
    },
    {
      path: '/*',
      redirect: '/404',
    }
  ]
})
