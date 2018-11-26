import Vue from 'vue'
import vueRouter from 'vue-router'
import App from '@/App.vue'
import store from '@/vuex'
import router from '@/router'
import es6Promise from 'es6-promise'
// import fastClick from 'fastclick'
import Rem from '@/_lib/rem'
import { Bus, busTypes } from '@/bus'
import { http } from '@/http'
import { _utils } from '@/utils' // 注入私有插件集合
import { VuxPublicConfig } from '@/components/common/vux'

const vuxPublicConfig = new VuxPublicConfig(Vue)
es6Promise.polyfill()
// fastClick.attach(document.body)
Vue.use(_utils)
Vue.use(vueRouter)
vuxPublicConfig.publicPlugins()
vuxPublicConfig.publicComponents()
Rem()

let vm = new Vue({
  el: '#app',
  data () {
    return {
      Bus,
      busTypes
    }
  },
  router,
  store,
  render: h => h(App)
})
window.h5Vm = vm
Vue.use(http, vm)

Vue.use({
  vm
})
