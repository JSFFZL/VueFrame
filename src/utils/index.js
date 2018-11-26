import jscalc from 'jscalc'
import Wx from 'weixin-js-sdk'
import WebViewTools from '@/_lib/jsbridge/webViewJavaScriptBridge.js' // 引入jsBridge
import ToastPlugin from '@/plugins/common/Toast/index.vue' // 引入Toast模板
import InlineLoadingPlugin from '@/plugins/common/InlineLoading/index.vue' // 引入Toast模板
const _utils = {}

// 计算 + - * /
const calc = function (type, paramOne, paramTwo) {
  switch (type) {
    case '+':
      return jscalc.Add(parseFloat(paramOne), parseFloat(paramTwo))
    case '-':
      return jscalc.Subtr(parseFloat(paramOne), parseFloat(paramTwo))
    case '*':
      return jscalc.Mul(parseFloat(paramOne), parseFloat(paramTwo))
    case '/':
      return jscalc.Div(parseFloat(paramOne), parseFloat(paramTwo))
  }
}

// 挂载全局 _utils
_utils.install = function (Vue) {
  // 注入计算
  Vue.prototype.$calc = function (type, paramOne, paramTwo) {
    return calc(type, parseFloat(paramOne), parseFloat(paramTwo))
  }

  // 注入 wxSDK
  Vue.prototype.$wx = Wx

  // 注入 jsBridge
  Vue.prototype.$webViewTools = WebViewTools

  // 注入UA (ios android webview)
  Vue.prototype.$UA = _ua

  // 注入 inlineLoading
  _inlineLoading(Vue, function ($loading) {
    Vue.prototype.$loading = {
      show (options) {
        if (Object.prototype.toString.call(options) === '[object Object]') {
          Object.assign($loading, options)
        } else {
          // options为空的时候text为之前的
          Object.assign($loading, {text: '加载中...'})
        }
        $loading.isShow = true
      },
      hide () {
        $loading.isShow = false
      }
    }
  })

  // 注入 toast
  _toast(Vue, function ($toast) {
    // 初始化time时间段隐藏
    const time = 2000
    // 在Vue的原型上添加实例方法，以全局调用
    Vue.prototype.$toast = {
      show (options) {
        if (Object.prototype.toString.call(options) === '[object String]') { // 对参数进行判断
          $toast.text = options // 传入props
          $toast.time = time
        } else if (Object.prototype.toString.call(options) === '[object Object]') { // 合并参数与实例
          Object.assign($toast, options)
        } else {
          $toast.time = time
        }
        $toast.isShow = true
      },
      hide () {
        $toast.isShow = false
      }
    }
  })

  // 注入 localStorage
  Vue.prototype.$localStorage = {
    set (key, value) {
      window.localStorage.setItem(key, value)
    },
    get (key) {
      return window.localStorage.getItem(key)
    },
    clearitem (key) {
      window.localStorage.removeItem(key)
    },
    clear () {
      window.localStorage.clear()
    }
  }

  // 注入 深拷贝
  Vue.prototype.$deepCopy = _deepCopy
}

function _ua (target) {
  const UA = window.navigator.userAgent
  const isAndroid = UA.indexOf('Android') !== -1 || UA.indexOf('Adr') !== -1
  const isWebView = UA.indexOf('fwapp') !== -1
  const isIos = !!UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  const TASK = {
    isWebView,
    isAndroid,
    isIos
  }

  if (!Object.keys(TASK).includes(target)) {
    console.warn('$UA参数错误，参考: isAndroid?isWebView?isIos? current:', target)
    return
  }

  return TASK[target]
}

function getType (obj) {
  // tostring会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

function _deepCopy (data) {
  let type = getType(data)
  let obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(_deepCopy(data[i]))
    }
  } else if (type === 'object') {
    for (let key in data) {
      obj[key] = _deepCopy(data[key])
    }
  }
  return obj
}

// 挂载 inlineLoading
function _inlineLoading (Vue, cb) {
  // 如果loading还在, return
  if (document.getElementsByClassName('inline-loading_wrap').length) {
    return
  }
  // 创建构造器
  let LoadingTpl = Vue.extend(InlineLoadingPlugin)
  // 实例化loading
  let $loading = new LoadingTpl()
  // 插入DOM
  document.body.appendChild($loading.$mount().$el)
  cb($loading)
}
// 挂载 toast 方法
function _toast (Vue, cb) {
  // 如果toast还在, return
  if (document.getElementsByClassName('toast-wrap').length) {
    return
  }
  // 创建构造器
  let ToastTpl = Vue.extend(ToastPlugin)
  // 实例化toast
  let $toast = new ToastTpl()
  // 插入DOM
  document.body.appendChild($toast.$mount().$el)
  cb($toast)
}

export {
  _utils
}
