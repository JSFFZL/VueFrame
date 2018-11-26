const path = require('path')
const config = require('../config/index')
const vuxLoader = require('vux-loader')

const baseConfig = {
  entry: {
    'babel-polyfill': 'babel-polyfill', // android 4.4 兼容
    main: config.isMain(process.env.IS_MOBILE)
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: process.env.NODE_ENV === 'development' ? '/' : '/dist/',
    filename: 'assets/js/[name]-chunk-[hash:6].js',
    chunkFilename: 'assets/js/[name]-chunk-[hash:6].js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      happypack: path.resolve('./node_modules/happypack')
      // 'vue$': 'vue/dist/vue.esm.js' // 暂且注释，三方打包强依赖
    },
    extensions: ['*', '.js', '.vue', '.json', '.less'],
    modules: [
      path.join(__dirname, '../node_modules/') // 指定node_modules所在位置 当你import 第三方模块时 直接从这个路径下搜索寻找
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: false,
          // postcss: config.postCssConfig(process.env.IS_MOBILE), // rem postCss 适配方案 暂用vw适配
          hotReload: true // 热重载
        }
      },
      {
        test: /\.css$/,
        loader: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        loader: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        },
        include: [path.join(__dirname, '../src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: 'assets/images/[name].[hash:6].[ext]',
          limit: 1024
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/media/[name].[hash:6].[ext]'
        }
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[hash:6].[ext]'
            }
          }
        ]
      }
    ]
  }
}

module.exports = vuxLoader.merge(baseConfig, {
  plugins: [
    'vux-ui',
    'progress-bar',
    {
      name: 'duplicate-style',
      options: {
        cssProcessorOptions: {
          safe: true,
          zindex: false,
          autoprefixer: {
            add: true,
            browsers: [
              'iOS >= 7',
              'Android >= 4.1'
            ]
          }
        }
      }
    }
  ]
})
