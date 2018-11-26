import * as actionTypes from '@/vuex/actions/types'
import * as mutationTypes from '@/vuex/mutations/types'
import { fetch } from '@/http/index'
import * as API from '@/http/common/api'
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合

// 容错
const _isSuccess = function (data, cb) {
  let statusCode = data.status.statusCode
  let statusInfo = data.status.statusReason
  if (statusCode === 0) { // 成功
    cb && cb(data)
  } else if (statusCode === 1155001) { // 登录过期
    // 唤起客户端登录
    this._vm.$webViewTools.handleNativeFun(handleNativeFunNames.HANDLELOGIN)
  } else { // 失败，包含数据返回超时, statusCode 999 时为数据返回超时
    this._vm.$toast.show(statusInfo)
  }
}

// Action
const actions = function () {
  return {
    // 获取省级地址列表
    [actionTypes.GET_PROVINCE_ADDRESS]: function ({commit}, options) {
      fetch(API.GET_PROVINCE)
        .then(res => {
          _isSuccess.call(this, res, function (result) { // 成功
            const localData = result.result.map((item) => {
              return Object.assign(item, {
                name: item.provinceName,
                id: item.provinceId
              })
            })
            // 改变state共享数据
            commit(mutationTypes.SET_PROVINCE_ADDRESS, localData)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 修改轮播tab
    changeSwieprTab: ({ commit }) => commit('changeSwieprTab' , '')
  }
}
export default actions
