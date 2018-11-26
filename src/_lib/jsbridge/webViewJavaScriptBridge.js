
// 触发native方法名称集合
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames'

class WebViewTools {
  constructor () {
    this.list = []
  }
  // H5 调用 native 全局方法 (h5 -> native)
  handleNativeFun (funName, params = {}) {
    let task = []
    for (let key in handleNativeFunNames) {
      task.push({
        key,
        name: handleNativeFunNames[key]
      })
    }
    let target = task.find(item => {
      if (item.name === funName) return item
    })
    return new Promise(function (resolve) {
      let u = navigator.userAgent
      let isAndroid = navigator.userAgent.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端

      if (isAndroid) { // android
        /** 暂且注释
         *  let callbackResult = window.obj[target.name](JSON.stringify(params))
         *  resolve(JSON.parse(callbackResult))
        */

        Object.assign(params, {
          'callBack': target.name + 'CallBack'
        })
        if (window[target.name + 'CallBack']) delete window[target.name + 'CallBack']
        window[target.name + 'CallBack'] = function (params) {
          resolve(params)
        }

        window.obj[target.name](JSON.stringify(params))
      } else { // ios
        Object.assign(params, {
          'callBack': target.name + 'CallBack'
        })
        if (window[target.name + 'CallBack']) delete window[target.name + 'CallBack']
        window[target.name + 'CallBack'] = function (params) {
          resolve(JSON.stringify(params))
        }
        window.webkit.messageHandlers[target.name].postMessage(JSON.stringify(params))
      }
    })
  }
  // js 注册 window 全局方法 (供 native 调用)
  registerGlobalFun (funName, cb) {
    let isHaveIndex = this.list.findIndex(item => {
      if (item.name === funName) return item
    })
    // if (isHaveIndex !== -1) return
    // 每次注册时，删除之前的事件
    if (isHaveIndex !== -1) {
      delete window[funName]
      this.list.splice(isHaveIndex, 1)
    }
    // window 事件注册
    this.list.push({
      name: funName,
      fun: window[funName] = function (params) {
        if (window.Object.prototype.toString.call(params) === '[object Object]') {
          cb(params)
          return
        }
        return Object.prototype.toString.call(params) === '[object Undefined]' ? cb(params) : cb(JSON.parse(params))
      }
    })
  }
}
export default new WebViewTools()
