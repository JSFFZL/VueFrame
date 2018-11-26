<template>
  <div id="app">
    <div class="wrap">
      <transition>
        <router-view class="conter"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
export default {
  name: 'app',
  created() {},
  mounted() {

    // 暂时模拟
    // this.$localStorage.set('userInfo',JSON.stringify({
    //   "platform": "android",
    //   "os": "19",
    //   "appid": "com.hivescm.tms.employee",
    //   "mac": "58:1f:28:89:4b:a6",
    //   "udid": "d995b8c4-92ed-380e-8d27-63081c646bf6",
    //   "fwToken": "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTcwMDI0IiwiaWF0IjoxNTM3MzU2MjMzLCJidXNpbmVzc1N5c3RlbSI6IlRNUyIsInNvdXJjZVR5cGUiOiJBUFAiLCJ0b2tlbkV4cGlyZVRpbWUiOjEyOTYwMDB9.uhGBlYRkIay05_rz0ILYEuUSNHXjfsSOvLpsRysUuhte_OG-kMPJ3wi8btkqKm8D_EjyulKJuM9krg8RqMzt6Q",
    //   "h": 1776,
    //   "network": "WIFI",
    //   "version": "1.0.0_055",
    //   "version_code": 100050,
    //   "w": 1080,
    //   "guid": "d50d2ae781fcfadb8d5973cd96722485",
    //   "IMEI": "865586020556876",
    //   "encrypt": "0",
    //   "userId": 2170024,
    //   "Accept-Encoding": "",
    //   "brand": "Huawei",
    //   "mid": "PE-TL20",
    //   "appType": "Tms",
    //   "content_type": "json"
    // }))

    // this.$localStorage.set('userInfo',JSON.stringify({
    //   "token": "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTcwMDI0IiwiaWF0IjoxNTM4MjAxMDk1LCJidXNpbmVzc1N5c3RlbSI6IlRNUyIsInNvdXJjZVR5cGUiOiJBUFAiLCJ0b2tlbkV4cGlyZVRpbWUiOjEyOTYwMDB9.siqeWsZHZrbThi-VOf8_OMdXm4ixRl7adNUQbuZuB-evae29crUvT8hgj9y7Swp7iGjdvejT2Auk38XhTdQ29w",
    //   "tokenExpireDate": "2018-10-14 14:04:55",
    //   "tokenExpireTime": 1296000,
    //   "globalCustomer": 392,
    //   "orgName": null,
    //   "groupName": null,
    //   "carrierGlobalId": null,
    //   "carrierGlobalName": null,
    //   "storeIds": null
    // }))
    // this.$localStorage.set('userInfo',JSON.stringify({
    //   "platform": "android",
    //   "os": "19",
    //   "appid": "com.hivescm.tms.employee",
    //   "mac": "58:1f:28:89:4b:a6",
    //   "udid": "d995b8c4-92ed-380e-8d27-63081c646bf6",
    //   "fwToken": "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTcwMDI0IiwiaWF0IjoxNTM3MzU2MjMzLCJidXNpbmVzc1N5c3RlbSI6IlRNUyIsInNvdXJjZVR5cGUiOiJBUFAiLCJ0b2tlbkV4cGlyZVRpbWUiOjEyOTYwMDB9.uhGBlYRkIay05_rz0ILYEuUSNHXjfsSOvLpsRysUuhte_OG-kMPJ3wi8btkqKm8D_EjyulKJuM9krg8RqMzt6Q",
    //   "h": 1776,
    //   "network": "WIFI",
    //   "version": "1.0.0_055",
    //   "version_code": 100050,
    //   "w": 1080,
    //   "guid": "d50d2ae781fcfadb8d5973cd96722485",
    //   "IMEI": "865586020556876",
    //   "encrypt": "0",
    //   "userId": 2170024,
    //   "Accept-Encoding": "",
    //   "brand": "Huawei",
    //   "mid": "PE-TL20",
    //   "appType": "Tms",
    //   "content_type": "json",
    //   "groupId": 33
    // }))

    // this.$localStorage.set('userInfo',JSON.stringify({
    //   "carrierGlobalId": "392",
    //   "carrierGlobalName": "杨晓娟运输公司",
    //   "createTime": 1513411126039,
    //   "createUser": 2170020, // 登录人ID
    //   "deleted": false,
    //   "enable": 1,
    //   "firstTimeLogin": false,
    //   "globalCustomer": "392",
    //   "identityType": 0,
    //   "lock": false,
    //   "managerLevel": 2,
    //   "passwordFlag": false,
    //   "remark": "初始集团管理员",
    //   "source": 1000,
    //   "updateTime": 1538046274183,
    //   "updateUser": 1,
    //   "email": "123@qq.com",
    //   "groupId": "33",
    //   "id": 2170024,
    //   "orgId": "34", // 发货网点ID
    //   "orgName": "杨晓娟运输公司根", // 发货网点名称
    //   "phone": "18800183022",
    //   "profile": "http://appservice-1254060329.picbj.myqcloud.com/e280da8f300740fab3bfabf0b568c35d.jpg",
    //   "realName": "",
    //   "token": "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTcwMDI0IiwiaWF0IjoxNTM4OTY5OTE2LCJidXNpbmVzc1N5c3RlbSI6IlRNUyIsInNvdXJjZVR5cGUiOiJBUFAiLCJ0b2tlbkV4cGlyZVRpbWUiOjEyOTYwMDB9.AjjAUZADumjwwKdsUl9STWguFm1_Dou6E6ov_2H9IKzH7hw9_eyJJnHsVsvNH1j9rXqR9KJjQ5URQ0sgtD6WCA",
    //   "tokenExpireDate": "2018-10-23 11:38:36",
    //   "tokenExpireTime": 1296000,
    //   "userName": "yangxiaojuan", // 登录人姓名
    //   "userNumber": "YHM2970012"
    // }))

    // 开发
    // this.$localStorage.set('userInfo',JSON.stringify({
    //   "carrierGlobalId": "392",
    //   "carrierGlobalName": "杨晓娟运输公司",
    //   "createTime": 1513411126039,
    //   "createUser": 2170020, // 登录人ID
    //   "deleted": false,
    //   "enable": 1,
    //   "firstTimeLogin": false,
    //   "globalCustomer": "392",
    //   "identityType": 0,
    //   "lock": false,
    //   "managerLevel": 2,
    //   "passwordFlag": false,
    //   "remark": "初始集团管理员",
    //   "source": 1000,
    //   "updateTime": 1539077536585,
    //   "updateUser": 1,
    //   "email": "123@qq.com",
    //   "groupId": "33",
    //   "id": 2170024,
    //   "orgId": "34", // 发货网点ID
    //   "orgName": "杨晓娟运输公司根", // 发货网点名称
    //   "phone": "18800183022",
    //   "profile": "http://appservice-1254060329.picbj.myqcloud.com/e280da8f300740fab3bfabf0b568c35d.jpg",
    //   "realName": "",
    //   "token": "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTcwMDI0IiwiaWF0IjoxNTM5MDc5NTQwLCJidXNpbmVzc1N5c3RlbSI6IlRNUyIsInNvdXJjZVR5cGUiOiJBUFAiLCJ0b2tlbkV4cGlyZVRpbWUiOjEyOTYwMDB9.3xQjqa-TznSew3mIj7oo6EhqMLrOzCTrzahQk9bNB_XGgJkzBiu66uzc7wQsNZQwE10SDAHiuWNB4v6CiJaXUg",
    //   "tokenExpireDate": "2018-10-24 18:05:40",
    //   "tokenExpireTime": 1296000,
    //   "userName": "yangxiaojuan", // 登录人姓名
    //   "userNumber": "YHM2970012"
    // }))

    // 测试 运费可用的
    // this.$localStorage.set('userInfo',JSON.stringify({
    //   "archivesId": "2283",
    //   "carrierGlobalId": "2133", // 公司ID
    //   "carrierGlobalName": "鹈鹕物流有限公司",
    //   "remark": "人员生成用户",
    //   "globalCustomer": "2133",
    //   "updateTime": 1539082606146,
    //   "createTime": 1528447220497,
    //   "deleted": false,
    //   "identityType": 0,
    //   "lock": false,
    //   "managerLevel": 3,
    //   "createUser": 2173431,
    //   "passwordFlag": false,
    //   "firstTimeLogin": false,
    //   "source": 1000,
    //   "enable": 1,
    //   "updateUser": 2173431,
    //   "groupId": "7065", // 集团ID
    //   "userNumber": "YHM4140086",
    //   "orgId": "7071",
    //   "orgName": "北京一部",
    //   "phone": "15911112222",
    //   "profile": "",
    //   "realName": "北京营业员1",
    //   "token": "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTczNDQzIiwiaWF0IjoxNTM5MjQyMzM1LCJidXNpbmVzc1N5c3RlbSI6IlRNUyIsInNvdXJjZVR5cGUiOiJBUFAiLCJ0b2tlbkV4cGlyZVRpbWUiOjEyOTYwMDB9.8anqLiSIFlz9uigvG9BvN5upZjjjGkFwNWNM7BVNFjt7HK39FkYFn5ImttMskdu9f81Hll5Jv6IghFfj38Ccdw",
    //   "tokenExpireDate": "2018-10-26 15:18:55",
    //   "userName": "beijing001",
    //   "tokenExpireTime": 1296000,
    //   "id": 2173443
    // }))
    // 测试 杨晓娟
    // this.$localStorage.set('userInfo',JSON.stringify({
    //   "carrierGlobalId": "392",
    //   "carrierGlobalName": "杨晓娟运输公司",
    //   "remark": "初始集团管理员",
    //   "globalCustomer": "392",
    //   "updateTime": 1528698210955,
    //   "createTime": 1513411126039,
    //   "deleted": false,
    //   "identityType": 0,
    //   "lock": false,
    //   "managerLevel": 2,
    //   "createUser": 2170020,
    //   "passwordFlag": false,
    //   "firstTimeLogin": false,
    //   "source": 1000,
    //   "enable": 1,
    //   "updateUser": 0,
    //   "email": "123@qq.com",
    //   "groupId": "33",
    //   "userNumber": "YHM2970012",
    //   "orgId": "6366",
    //   "orgName": "杨晓娟运输公司根",
    //   "phone": "13581952100",
    //   "profile": "http://test-1254060329.costj.myqcloud.com/54775192ef71429eb8f7f83d0073bf5f.jpg",
    //   "realName": "",
    //   "token": "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTcwMDI0IiwiaWF0IjoxNTM5NDAxMzQ0LCJidXNpbmVzc1N5c3RlbSI6IlRNUyIsInNvdXJjZVR5cGUiOiJBUFAiLCJ0b2tlbkV4cGlyZVRpbWUiOjEyOTYwMDB9.E-igeWZQU_-h5opKUOWu1vgAuU6DltEAnHMuVymnhVQA2__bOfQEfRqteumFJwB3i46affzOHy2D0e-Tpj6YOA",
    //   "tokenExpireDate": "2018-10-28 11:29:04",
    //   "userName": "yangxiaojuan",
    //   "tokenExpireTime": 1296000,
    //   "id": 2170024
    // }))
    // 测试 账号:wangdian9 密码:111111
    // this.$localStorage.set('userInfo',JSON.stringify({
    //   "driverId": 1088,
    //   "archivesId":"5671",
    //   "carrierGlobalId":"3445",
    //   "carrierGlobalName":"石头物流有限公司",
    //   "createTime":1536727589647,
    //   "createUser":2175898,
    //   "deleted":false,
    //   "enable":1,
    //   "firstTimeLogin":false,
    //   "globalCustomer":"3445",
    //   "identityType":0,
    //   "lock":false,
    //   "managerLevel":3,
    //   "passwordFlag":false,
    //   "remark":"人员生成用户",
    //   "source":1000,
    //   "updateTime":1540976617725,
    //   "updateUser":2175898,
    //   "groupId":"11860",
    //   "id":2176960,
    //   "orgId":"13849",
    //   "orgName":"小石头九部",
    //   "phone":"18812121220",
    //   "profile":"",
    //   "realName":"小石头九",
    //   "token":"eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTc2OTYwIiwiaWF0IjoxNTQxMTQ4NTgxLCJidXNpbmVzc1N5c3RlbSI6IlRNU19FTVBMT1lFRVMiLCJzb3VyY2VUeXBlIjoiQVBQIiwidG9rZW5FeHBpcmVUaW1lIjoxMjk2MDAwfQ.a5_kvhtLNOg-4-gKQkNcsjrDERwXgYduAiKig8nlhYkEZ6I7PtYqxMF35J2SoYhkL3ZTjKigavx-PsqrDsU0rQ",
    //   "tokenExpireDate":"2018-11-17 16:49:41",
    //   "tokenExpireTime":1296000,
    //   "userName":"wangdian9",
    //   "userNumber":"YHM4340398"}))
  }
}
</script>

<style lang="less">
  @import "./less/core.less";
  #app, .wrap, .conter {
    width: 100%;
    height: 100%;
    font-size: 24px;
  }

  .left-enter {
    transform: translateX(100%);
  }

  .left-enter-to {
    transform: translateX(0%);
  }

  .left-leave {
    transform: translateX(0%);
  }

  .left-leave-to {
    transform: translateX(-100%);
  }

  .left-enter-active, .left-leave-active {
    transition: .2s;
  }

  .right-enter {
    transform: translateX(-100%);
  }

  .right-enter-to {
    transform: translateX(0%);
  }

  .right-leave {
    transform: translateX(0%);
  }

  .right-leave-to {
    transform: translateX(100%);
  }

  .right-enter-active, .right-leave-active {
    transition: .2s;
  }

</style>
