import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

Vue.use(Router)

export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  }
]

export const asyncRoutes: RouteConfig[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home'
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/welcome',
    name: 'home',
    meta: {
      title: '主页',
      roles: ['admin', 'editor'], // you can set roles in root nav
      alwaysShow: true // will always show the root menu
    },
    children: [
      {
        path: 'welcome',
        component: () => import('@/views/home/index.vue'),
        name: 'welcome',
        meta: {
          title: '欢迎',
        }
      },
      {
        path: 'welcome2',
        component: () => import('@/views/home/index.vue'),
        name: 'welcome2',
        meta: {
          title: '欢迎2',
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
