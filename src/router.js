import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/users/Users.vue'
import Roles from './components/rights/Roles.vue'
import Rights from './components/rights/Rights.vue'
import Categories from './components/products/Categories.vue'
import Goods from './components/products/Goods.vue'
import GoodsAdd from './components/products/GoodsAdd.vue'
Vue.use(Router)
// 解决 vue-router 版本更新小bug(不用记)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      children: [
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/categories', component: Categories },
        { path: '/goods', name: 'goods', component: Goods },
        { path: '/goods-add', name: 'goods-add', component: GoodsAdd }

      ]

    },
    {
      path: '/login',
      component: Login
    }
  ]

})
router.beforeEach((to, form, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
