import axios from 'axios'
const axiosConfig = require('@/http/common/axiosConfig')
const _axios = axios.create(axiosConfig.default)
const http = {}
// 当前vue实例
let vm

// 请求拦截
_axios.interceptors.request.use(config => {
  // show loading
  vm.$loading.show()
  return config
}, () => {})

// // 响应拦截
_axios.interceptors.response.use(data => { // 响应成功
  // hide loading
  vm.$loading.hide()
  return data.data
}, any => { // 响应失败
  // hide loading
  vm.$loading.hide()
  return {
    status: {
      statusCode: 999,
      statusReason: '数据返回超时，请重试:' + any
    }
  }
})

const fetchConfig = (url, opt) => {
  let u = navigator.userAgent
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
  let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  // let headers = {
  //   token: userInfo ? userInfo.token : '',
  //   orgId: userInfo ? userInfo.orgId : '',
  //   userId: userInfo ? userInfo.id : '',
  //   userName: userInfo ? userInfo.userName : ''
  // }
  if (opt.type === 'POST') { // web 网关
    return {
      url: url,
      method: opt.type || 'POST',
      data: opt.params || {}, // post请求时 设置为data可以自定义 Content-Type
      headers: !isAndroid && window.webkit ? Object.assign({}, axiosConfig.default.headers, {
        token: userInfo ? userInfo.token : '',
        orgId: userInfo ? userInfo.orgId : '',
        userId: userInfo ? userInfo.id : '',
        userName: userInfo ? userInfo.userName : ''
      }) : axiosConfig.default.headers
    }
  } else {
    return {
      url: url,
      method: opt.type || 'GET',
      params: opt.params || {}, // 默认GIT
      headers: !isAndroid && window.webkit ? Object.assign({}, axiosConfig.default.headers, {
        token: userInfo ? userInfo.token : '',
        orgId: userInfo ? userInfo.orgId : '',
        userId: userInfo ? userInfo.id : '',
        userName: userInfo ? userInfo.userName : ''
      }) : axiosConfig.default.headers
    }
  }
  // if (opt.type === 'POST') { // app 网关
  //   /**
  //    * @class POST
  //    * @param {String} fid  必须，加密令牌
  //    * @param {String} edata  必须 加密
  //    * @param {Object} dev  必须 非加密 包含 header: {} && body: {} -> dev: {header: {}, body: {}}
  //    */
  //   let requestData = 'fid=js-v1.0.0&edata=null&dev='
  //   let header = {
  //     header: JSON.parse(vm.$localStorage.get('userInfo'))
  //   }
  //   let body = {
  //     body: opt.params
  //   }
  //   requestData += JSON.stringify(Object.assign(header, body))

  //   return {
  //     url: url,
  //     method: opt.type || 'POST',
  //     data: requestData || '' // post请求时 设置为data可以自定义 Content-Type
  //   }
  // } else {
  //   return {
  //     url: url,
  //     method: opt.type || 'GET',
  //     params: opt.params || {} // 默认GIT
  //   }
  // }
}

const fetch = (url, options) => {
  return new Promise((resolve, reject) => {
    let opt = options || {}

    _axios(fetchConfig(url, opt))
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        // reject({ 'code': '-100', 'message': '网络异常或参数错误！' });
        reject(err)
      })
  })
}

http.install = function (vue, vms) {
  vm = vms
  vue.prototype.$http = function (url, options) {
    return fetch(url, options)
  }
}

export {
  http,
  fetch
}
