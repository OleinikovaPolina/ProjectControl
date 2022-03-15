import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { userModule } from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/register',
    name: 'register',
    meta: { guest: true },
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/',
    name: 'login',
    meta: { guest: true },
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/profile/:id',
    name: 'profile',
    meta: { requiresAuth: true },
    component: () => import('../views/ProfileView.vue'),
  },
  {
    path: '/search',
    name: 'search',
    meta: { requiresAuth: true },
    component: () => import('../views/SearchView.vue'),
  },
  {
    path: '/ownprojects',
    name: 'ownprojects',
    meta: { requiresAuth: true },
    component: () => import('../views/ProjectOwnAllView.vue'),
  },
  {
    path: '/ownproject/:id',
    name: 'ownproject',
    meta: { requiresAuth: true },
    component: () => import('../views/ProjectOwnView.vue'),
  },
  {
    path: '/participantprojects',
    name: 'participantprojects',
    meta: { requiresAuth: true },
    component: () => import('../views/ProjectParticipantAllView.vue'),
  },
  {
    path: '/project/:id',
    name: 'project',
    meta: { requiresAuth: true },
    component: () => import('../views/ProjectView.vue'),
  },
  {
    path: '/applications',
    name: 'applications',
    meta: { requiresAuth: true },
    component: () => import('../views/ApplicationsUserView.vue'),
  },
  {
    path: '/kanban/:id',
    name: 'kanban',
    meta: { requiresAuth: true },
    component: () => import('../views/KanbanView.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: '*',
    redirect: '/404',
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// запрет перехода на страницы пользователей для неавторизованных пользователей
router.beforeResolve(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if(localStorage.getItem('user')?.toString() && !userModule.state.isAuth){
      await userModule.actions.userCheck({ id: localStorage.getItem('user')?.toString() || '' })
    }
    if (!userModule.state.isAuth) {
      next('/')
      return
    }
    next()
  } else {
    next()
  }
})

// запрет перехода на страницы входа и регистрации для авторизованных пользователей
router.beforeResolve(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if(localStorage.getItem('user')?.toString() && !userModule.state.isAuth){
      await userModule.actions.userCheck({ id: localStorage.getItem('user')?.toString() || '' })
    }
    if (userModule.state.isAuth) {
      next('/search')
      return
    }
    next()
  } else {
    next()
  }
})

export default router
