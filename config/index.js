const path = require('path')
const autoprefixer = require('autoprefixer') // 浏览器前缀
const os = require('os')
// 动态获取 host || 也可在package.json中配置 HOST （--host 0.0.0.0)
let arr = []
let HOST
for (let key in os.networkInterfaces()) {
  os.networkInterfaces()[key].forEach((item) => {
    if (item.family === 'IPv4' && item.address.indexOf('192.168.') !== -1) {
      arr.push(item.address)
    }
  })
}
HOST = arr[0]

const config = class {
  static devServer () {
    return {
      historyApiFallback: true,
      noInfo: true,
      overlay: true,
      publicPath: '/',
      inline: true,
      host: HOST,
      port: 8888,
      disableHostCheck: true,
      proxy: { // 开发环境反向代理
        // 请求到 '/api' 下 的请求都会被代理到 target 中
        '/api': {
          target: require('../src/http/common/baseURL').devBaseUrl,
          secure: false, // 接受 运行在 https 上的服务
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    }
  }
  // 入口
  static isMain (isMobile) {
    return isMobile === 'true' ? path.join(__dirname, '../src/mobileMain.js') : path.join(__dirname, '../src/pcMain.js')
  }

  static postCssConfig (isMobile) {
    let config = [autoprefixer({
      browsers: ['Android > 1', 'ChromeAndroid > 1', 'FirefoxAndroid > 1', 'Samsung > 1', 'and_uc > 1', 'iOS > 1']
    })]
    config = isMobile === 'true' ? config.concat([require('postcss-plugin-px2rem')({
      rootValue: 75, // 根字体大小
      unitPrecision: 3 // 渲染单位小数个数
    })]) : config

    return config
  }
}

module.exports = config
