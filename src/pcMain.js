
import Vue from 'vue'
import vueRouter from 'vue-router'
import App from '@/App.vue'
import store from '@/vuex'
import { http } from '@/http'
import utils from '@/utils'
import router from '@/router'

Vue.use(http)
Vue.use(utils)
Vue.use(vueRouter)

let vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Vue.use({
  vm
})
