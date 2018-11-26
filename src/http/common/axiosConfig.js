
let baseConfig = require('./baseURL')

function baseURL () {
  if (process.__DEV__ === 'dev') { // 本地开发
    return '/api/'
  } else if (process.__DEV__ === 'devpub') { // jenkins 开发
    return baseConfig.devBaseUrl
  } else if (process.__DEV__ === 'test') { // jenkins 测试
    return baseConfig.testBaseUrl
  } else if (process.__DEV__ === 'pre') { // jenkins 预发布
    return window.location.protocol + baseConfig.preBaseUrl
  } else if (process.__DEV__ === 'prod') { // jenkins 生产
    return window.location.protocol + baseConfig.prodBaseUrl
  }
}

// 获取用户信息存入到localStorage
let userInfo = {}
let u = navigator.userAgent
let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端

if (process.__DEV__ !== 'dev' && window.obj && isAndroid) { // android 平台
  let result = window.obj.fwLogin()
  window.localStorage.setItem('userInfo', result)
  userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
}

if (process.__DEV__ === 'dev') {
  userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  // 开发环境
  // window.localStorage.setItem('userInfo', JSON.stringify({
  //   'carrierGlobalId': '392',
  //   'carrierGlobalName': '杨晓娟运输公司',
  //   'createTime': 1513411126039,
  //   'createUser': 2170020,
  //   'deleted': false,
  //   'enable': 1,
  //   'firstTimeLogin': false,
  //   'globalCustomer': '392',
  //   'identityType': 0,
  //   'lock': false,
  //   'managerLevel': 2,
  //   'passwordFlag': false,
  //   'remark': '初始集团管理员',
  //   'source': 1000,
  //   'updateTime': 1539077536585,
  //   'updateUser': 1,
  //   'email': '123@qq.com',
  //   'groupId': '33',
  //   'id': 2170024,
  //   'orgId': '34',
  //   'orgName': '杨晓娟运输公司根',
  //   'phone': '18800183022',
  //   'profile': 'http://appservice-1254060329.picbj.myqcloud.com/43861a831a2b487d807f3187873f176d.jpg',
  //   'realName': '',
  //   'token': 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTcwMDI0IiwiaWF0IjoxNTQxNTc5MjY2LCJidXNpbmVzc1N5c3RlbSI6IlRNU19FTVBMT1lFRVMiLCJzb3VyY2VUeXBlIjoiQVBQIiwidG9rZW5FeHBpcmVUaW1lIjoxMjk2MDAwfQ.cBdHVQ1IXkcHOy9AxKvX-7uP0XtwIMcvfPH7e2tlP0rR7GdHBnJOnAj6Q_nTX1f_BhpJak0BGmhVA5emwTS6Og',
  //   'tokenExpireDate': '2018-11-22 16:27:46',
  //   'tokenExpireTime': 1296000,
  //   'userName': 'yangxiaojuan',
  //   'userNumber': 'YHM2970012'
  // }))
  // 测试环境
  window.localStorage.setItem('userInfo', JSON.stringify({
    'archivesId': '2283',
    'carrierGlobalId': '2133', // 公司ID
    'carrierGlobalName': '鹈鹕物流有限公司',
    'remark': '人员生成用户',
    'globalCustomer': '2133',
    'updateTime': 1539082606146,
    'createTime': 1528447220497,
    'deleted': false,
    'identityType': 0,
    'lock': false,
    'managerLevel': 3,
    'createUser': 2173431,
    'passwordFlag': false,
    'firstTimeLogin': false,
    'source': 1000,
    'enable': 1,
    'updateUser': 2173431,
    'groupId': '7065', // 集团ID
    'userNumber': 'YHM4140086',
    'orgId': '7071',
    'orgName': '北京一部',
    'phone': '15911112222',
    'profile': '',
    'realName': '北京营业员1',
    'token': 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyMTczNDQzIiwiaWF0IjoxNTM5MjQyMzM1LCJidXNpbmVzc1N5c3RlbSI6IlRNUyIsInNvdXJjZVR5cGUiOiJBUFAiLCJ0b2tlbkV4cGlyZVRpbWUiOjEyOTYwMDB9.8anqLiSIFlz9uigvG9BvN5upZjjjGkFwNWNM7BVNFjt7HK39FkYFn5ImttMskdu9f81Hll5Jv6IghFfj38Ccdw',
    'tokenExpireDate': '2018-10-26 15:18:55',
    'userName': 'beijing001',
    'tokenExpireTime': 1296000,
    'id': 2173443
  }))
}

// window.alert(JSON.parse(window.localStorage.getItem('userInfo')).id)
// if (process.__DEV__ === 'dev' && !isAndroid && window.webkit) { // ios 平台
//   if (window.fwLoginCallBack) delete window.fwLoginCallBack
//     window.fwLoginCallBack = function (result) {
//       window.localStorage.setItem('userInfo', JSON.stringify(result))
//       userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
//       window.alert(userInfo.token)
//       window.alert(2)
//     }
//   window.webkit.messageHandlers.fwLogin.postMessage(`{"callBack": "fwLoginCallBack"}`)
// }

// window.webkit.messageHandlers.fwLogin.postMessage(`{"callBack": "fwLoginCallBack"}`)
// window.alert(JSON.stringify(window.localStorage.getItem('userInfo')))

// userInfo = JSON.parse(window.localStorage.getItem('userInfo'))

export default {
  baseURL: baseURL(),
  timeout: 80000,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded' // app
    'Content-Type': 'application/json;charset=UTF-8', // web
    token: userInfo.token ? userInfo.token : '',
    orgId: userInfo.orgId ? userInfo.orgId : '',
    userId: userInfo.id ? userInfo.id : '',
    userName: userInfo.userName ? userInfo.userName : ''
  },
  withCredentials: false // 携带cookie
}
