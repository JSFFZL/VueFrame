// 生产环境中通用的配置
const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const HtmlwebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清空文件夹
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin') // 压缩js，让输出的JS文件体积更小、加载更快、流量更省，还有混淆代码的加密功能
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin') // 将dll插入到HTML
const CompressionWebpackPlugin = require('compression-webpack-plugin') // gzip 压缩
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin') // css压缩

let prodConfig
prodConfig = merge(baseConfig, {
  mode: 'production',
  module: {},
  plugins: [
    new CleanWebpackPlugin(['dist'], { // 清空打包文件
      root: path.resolve(__dirname, '..'), // 根目录
      dry: false // 启用删除文件
    }),
    // 根据已有的html文件生成html文件
    new HtmlwebpackPlugin({ // 打包输出HTML
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true// 压缩内联css
      },
      filename: 'index.html',
      template: path.join(__dirname, '../index.html')
    }),
    new webpack.DllReferencePlugin({ // dll
      context: __dirname,
      /**
       *  下面这个地址对应webpack.dll.config.js中生成的那个json文件的路径
       *  这样webpack打包时，就先直接去这个json文件中把那些预编译的资源弄进来
       * **/
      manifest: require('../dll/dll.manifest.json')
    }),
    new webpack.DefinePlugin({
      'process.__DEV__': JSON.stringify(process.env.__DEV__), // devpub || test || prod
      'process.__MOBILE__': JSON.stringify(process.env.IS_MOBILE) // mobile || pc
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['dll/dll.js'],
      append: false, // 资产前添加
      publicPath: '/',
      hash: true
    }),
    new UglifyjsWebpackPlugin({ // js 压缩
      cache: true, // 启用文件缓存。缓存目录的默认路径：node_modules/.cache/uglifyjs-webpack-plugin
      parallel: true // 启用并行化。默认并发运行数：os.cpus().length - 1
    }),
    new CompressionWebpackPlugin({ // 最高级别gzip压缩，需server允许gzip，减缓server压力
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
})

module.exports = prodConfig
