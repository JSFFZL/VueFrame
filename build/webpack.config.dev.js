const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const config = require('../config/index')

let devConfig
devConfig = merge(baseConfig, {
  mode: 'development',
  devServer: config.devServer(),
  performance: {
    hints: false
  },
  module: { // eslint
    rules: [
      // {
      //   test: /\.(vue|js)$/,
      //   loader: 'eslint-loader',
      //   exclude: [
      //     /node_modules/,
      //     '../src/assets/'
      //   ],
      //   enforce: 'pre'
      // }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ // 打包输出HTML
      title: 'Hello World app',
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true// 压缩内联css
      },
      filename: 'index.html',
      template: 'index.html'
    }),
    new CleanWebpackPlugin(['dist'], { // 清空打包文件
      root: path.resolve(__dirname, '..'), // 根目录
      dry: false // 启用删除文件
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.DefinePlugin({
      'process.__DEV__': JSON.stringify(process.env.__DEV__), // devpub || test || prod
      'process.__MOBILE__': JSON.stringify(process.env.IS_MOBILE) // mobile || pc
    })
  ]
})
module.exports = devConfig
