<template>
  <div class="bridge">
    <div class="btn" @click="handleNative">点击 H5触发native中demo1方法， 传递参数为{"callBack": "", "id": "demo1"}</div>
      <!-- <span>jsBridgeDemo</span>
    <div class="btn" @click="handleNative2">触发nativedemo2</div> -->
    <div class="ps">当native触发window下test1方法时，这个页面会alert弹出对应提示，test1返回的数据为{"id": "test1"}</div>
  </div>
</template>

<script>
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)

export default {
  name: 'jsBridgeDemo',
  mounted() {
    // this.$webViewTools.registerGlobalFun(registerGlobalFunNames.TEST1, function (params) {
    //   window.alert('native 触发H5 test1方法，native传递过来的参数是:' + JSON.stringify(params))
    //   return JSON.stringify({"id": "test1"})
    // })
    // this.$webViewTools.registerGlobalFun(registerGlobalFunNames.TEST2,  function(params) {
    //   window.alert(JSON.stringify(params))
    //   return JSON.stringify({"id": "test2"})
    // })
    // window全局监听用户登录信息
    // this.$webViewTools.registerGlobalFun(registerGlobalFunNames.GET_USER_INFO_CALLBACK, function (params) {
    //   window.alert(JSON.stringify(res))
    //   this.$localStorage.set('userInfo', JSON.stringify(res))
    // }.bind(this))
    // window.registerGlobalFunNames.GET_USER_INFO_CALLBACK({"id": 123})
  },
  methods: {
    handleNative () {
      // js -> native DEMO1
      // this.$webViewTools.handleNativeFun(handleNativeFunNames.demo1, {"id": "demo1"}).then(function (res) {
      //     window.alert('h5调用native demo1方法后，native的返回值是: ' + res)
      // })
      this.$webViewTools.handleNativeFun(handleNativeFunNames.SCANORCODE, {"id": "SCANORCODE"}).then(function (res) {
          window.alert('h5调用native demo1方法后，native的返回值是: ' + res)
      })
    },
    handleNative2 () {
      // js -> native DEMO2
      // this.$webViewTools.handleNativeFun(handleNativeFunNames.DEMO2, {"id": "demo2"}).then(function (res) {
      //     window.alert(res.key)
      // })
    }
  }
}
</script>

<style lang="less" src="./index.less"></style>
