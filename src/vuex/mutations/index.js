import * as mutationTypes from '@/vuex/mutations/types'

// Mutation
const mutations = function (state) {
  return {
    // 同步设置运单信息 费率等
    [mutationTypes.SET_WAYBILL_INFO]: function (state, options) {
      state.wayBillInfo = options
    },
    // 同步省级地址列表
    [mutationTypes.SET_PROVINCE_ADDRESS]: function (state, options) {
      state.addressProvince = options
    },
    // 同步目的地选择四级地址列表
    [mutationTypes.SET_TARGET_ADDRESS_LIST]: function (state, options) {
      state.targetAddressList = options
    },
    // 同步开单 -> 初始化设置数据字典
    [mutationTypes.SET_DICTIONARIES_DATA]: function (state, options) {
      state.dataDictionaries = options
    },
    // 同步开单 -> 设置网点
    [mutationTypes.SET_DOT]: function (state, options) {
      state.selectedDot = options
    },
    // 同步开单 -> 设置发货人信息或者收货人信息
    [mutationTypes.SET_RECEIVEDELIVER_INFO]: function (state, options) {
      let from = options.index // 来源 0: 发货人， 1: 收货人
      let data = options.data
      state.receiveDeliverData[from] = Object.assign(state.receiveDeliverData[from], data)
    },
    // 同步开单 -> 设置当前选中发货人客商信息
    [mutationTypes.SET_RECEIVEDELIVER_INFO_SELECTED]: function (state, options) {
      state.receiveDeliverData[2] = options
    },
    // 同步开单 -> 设置更多要求
    [mutationTypes.SET_MORE_REQUIRE]: function (state, options) {
      state.moreRequire = options
    },
    // 同步开单 -> 添加货物信息
    [mutationTypes.ADD_GOODS_ITEM]: function (state, options) {
      if (state.goodsList.length === 3) {
        this._vm.$toast.show('货物最多可添加3个')
        return
      }
      state.goodsList.unshift(options)
    },
    // 同步开单 -> 更新所有货物信息
    [mutationTypes.UPDATE_GOODS_LIST]: function (state, options) {
      state.goodsList = options
    },
    // 同步开单 -> 设置每条货物运费列表
    [mutationTypes.SET_GOOD_ITEM_COST]: function (state, options) {
      state.totalList = options
    },
    // 同步开单 -> 删除货物信息
    [mutationTypes.DELETE_GOODS_ITEM]: function (state, index) {
      state.goodsList.splice(index, 1)
    },
    // 同步开单 -> 设置送货费
    [mutationTypes.SET_DELIVERY_COST]: function (state, options) {
      state.costInfo.delivery = options
    },
    // 同步开单 -> 设置基本运费
    [mutationTypes.SET_BASE_COST]: function (state, options) {
      state.costInfo.base = options
    },
    // 同步开单 -> 同步附加费用列表
    [mutationTypes.SYNC_COST_INFO]: function (state, options) {
      state.costInfo.additional = options
    },
    // 同步开单 -> 设置代收货款及费率选项
    [mutationTypes.SET_COLLECTION_OF_GOODS]: function (state, options) {
      // 代收货款
      state.costInfo.additional[2] = options.base
      // 代收货款费率
      state.costInfo.additional[3] = options.baseRate
    }
  }
}
export default mutations
