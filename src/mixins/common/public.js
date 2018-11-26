import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合

export default {
  /**
   *
   * .then(res => {
      this.__isError(res, function (data) {
        let result = data.result
        console.log(result)
        this.pageData = data.result

      }.bind(this))
    })
   *
  */
  methods: {
    // 请求数据容错处理
    __isSuccess (target, cb) {
      if (Object.prototype.toString.call(target.result) === '[object Undefined]') {
        this.$toast.show('数据返回错误, result未定义')
      }
      let statusCode = target.status.statusCode
      let statusInfo = target.status.statusReason
      if (statusCode === 0) { // 成功
        cb && cb(target)
      } else if (statusCode === 1155001) { // 登录过期
        // 唤起App登录信息
        this.$webViewTools.handleNativeFun(handleNativeFunNames.HANDLELOGIN)
      } else if (statusCode === 1061013) { // 连接超时
        this.$toast.show('数据请求超时')
      } else { // 失败，包含数据返回超时, statusCode 999 时为数据返回超时
        // let str = statusInfo
        // this.$toast.show(str.replace(/[^\u4e00-\u9fa5]/gi, ''))
        let reg = /errorMsg:(.+)\]/
        let errorMsg = statusInfo
        if (reg.test(statusInfo)) {
          errorMsg = statusInfo.match(reg)[1]
        }
        this.$toast.show(errorMsg)
      }
    },
    // 解决键盘遮挡当前输入框问题 (android存在)
    __scrollIntoViewIfNeededInput (el) {
      setTimeout(function () {
        el.target.scrollIntoViewIfNeeded()
      }, 400)
    }
  }
}
