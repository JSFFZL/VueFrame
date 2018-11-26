import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
export default {
  mounted () {
    let that = this
    this.$webViewTools.registerGlobalFun(registerGlobalFunNames.RELOAD, function (params) {
      // 引入mixin的页面需要将要刷新的数据写在methods中initData方法内
      that.initData(params)
    })
  }
}
