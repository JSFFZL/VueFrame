import Vue from 'vue'
import Vuex from 'vuex'
import openBillModule from '@/vuex/modules/openBill'
Vue.use(Vuex)

/**
 * @class vuex
 * @module openBillModule // 开单模块
*/

// 创建 store 实例
const Store = new Vuex.Store({
  modules: {
    openBill: openBillModule
  }
})

export default Store
