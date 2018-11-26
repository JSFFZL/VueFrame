import { ToastPlugin } from 'vux'

class VuxPublicConfig {
  constructor (Vue) {
    this._vue = Vue
  }

  publicPlugins () { // 全局插件
    this._vue.use(ToastPlugin)
  }

  publicComponents () {} // 全局组件
}

export {
  VuxPublicConfig
}
