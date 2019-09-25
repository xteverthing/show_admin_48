import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.use(ElementUI)

Vue.config.productionTip = false
// axios 优化 - 绑定到 vue 的原型
Vue.prototype.$axios = axios
// axios 优化 - 配置默认的baseurl
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios 优化 - 配置请求拦截器 - 配置 token
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  return Promise.reject(error)
})
// axios 优化 - 响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  response = response.data
  // 如果status是404
  if (response.meta.status === 404) {
    localStorage.removeItem('token')
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
