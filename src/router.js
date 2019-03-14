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
        }
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
            title: 'Colorful - 仪表盘',
            requireAuth: true
          }
        },
        {
          path: '/admin/articleList',
          component: () => import('./views/admin/ArticleList.vue'),
          meta: { 
            title: 'Colorful - 我的文章',
            requireAuth: true
          }
        },
        {
          path: '/admin/articleEdit',
          component: () => import('./views/admin/ArticleEdit.vue'),
          meta: { 
            title: 'Colorful - 文章编辑',
            requireAuth: true
          }
        },
        {
          path: '/admin/pageList',
          component: () => import('./views/admin/PageList.vue'),
          meta: { 
            title: 'Colorful - 自定义页面',
            requireAuth: true
          }
        },
        {
          path: '/admin/pageEdit',
          component: () => import('./views/admin/PageEdit.vue'),
          meta: { 
            title: 'Colorful - 页面编辑',
            requireAuth: true
          }
        },
        {
          path: '/admin/commentList',
          component: () => import('./views/admin/CommentList.vue'),
          meta: { 
            title: 'Colorful - 评论管理',
            requireAuth: true
          }
        },
        {
          path: '/admin/categoryTagList',
          component: () => import('./views/admin/CategoryTagList.vue'),
          meta: { 
            title: 'Colorful - 分类 / 标签',
            requireAuth: true
          }
        },
        {
          path: '/admin/linkList',
          component: () => import('./views/admin/LinkList.vue'),
          meta: { 
            title: 'Colorful - 友链管理',
            requireAuth: true
          }
        },
        // {
        //   path: '/admin/logList',
        //   component: () => import('./views/admin/LogList.vue'),
        //   meta: { 
        //     title: 'Colorful - 系统日志',
        //     requireAuth: true
        //   }
        // },
        {
          path: '/admin/attachmentManagement',
          component: () => import('./views/admin/AttachmentManagement.vue'),
          meta: { 
            title: 'Colorful - 附件管理',
            requireAuth: true
          }
        },
        {
          path: '/admin/sysSetting',
          component: () => import('./views/admin/SysSetting.vue'),
          meta: { 
            title: 'Colorful - 系统设置',
            requireAuth: true
          }
        }
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
