import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: Index
    },
    {
      path: '/index',
      component: Index
    },
    {
      path: '/login',
      component: Login
    }
  ]

})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
