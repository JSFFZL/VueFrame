# 员工端App （H5） #

Ps: node ≥ 8.2

### 安装依赖

`$ npm install yarn -g` - 全局安装yarn

### npm scripts
## mobile
`$ yarn run init` - 初始化yarn 设置镜像

`$ yarn` - 安装依赖

`$ yarn run dll` - 分离三方模块

`$ yarn run dev` - 建立本地开发模式并启动应用程序在 http://localhost:8888

`$ yarn run devpub` - 开发环境

`$ yarn run test` - 测试环境

`$ yarn run pre` - 预发布环境

`$ yarn run prod` - 生产环境

### 开发要求/原则

**projectInfo**

```
--- ./build
        |--- ./webpack.config.base.js (base配置)
        |--- ./webpack.config.dll.js (三方模块配置)
        |--- ./webpack.config.dev.js (开发环境配置)
        |--- ./webpack.config.prod.js (生产配置)
--- ./config
        |--- ./index.js (构建配置)
--- ./dist (bundle)
--- ./dll (第三方资源打包的bundle)
--- ./src
        |--- ./_lib (私有集)
            |--- ./jsbridge (H5 && native 交互)
                |--- ./handleNativeFunNames.js (H5 调用 native 方法名称集合)
                |--- ./registerGlobalFunNames.js (native 调用 window 方法集合， H5监听)
                |--- ./webViewJavaScriptBridge.js (宿主文件, 会以插件的形式挂载到vue实例中)
            |--- ./rem.js (移动端适配)
        |--- ./assets (静态资源)
        |--- ./bus (全局通讯)
        |--- ./components (组件)
        |--- ./config (开发环境功能配置)
        |--- ./http (axios配置)
        |--- ./less (css预编译)
        |--- ./lib (公共集)
        |--- ./mixins (mixins)
        |--- ./modules (模块)
        |--- ./plugins (插件)
        |--- ./router (路由)
        |--- ./utils (工具集，集成各类插件)
        |--- ./views (视图)
        |--- ./vuex (状态管理)
        |--- ./App.vue (root挂载点)
        |--- ./mobileMain.js (mobile)
        |--- ./pcMain.js (pc)
```

### 相关链接

[webpack: <http://www.css88.com/doc/webpack/guides/output-management>]

[yarn: <https://blog.csdn.net/mjzhang1993/article/details/70092902>]

[vue: <https://cn.vuejs.org/>]

### 开发者
Email: kuangmiaolong@newbeescm.com
