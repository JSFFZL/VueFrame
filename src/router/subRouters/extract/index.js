/**
 * 提货任务模块路由
*/
// 提货任务首页
const ExtractTask = () => import(/* webpackChunkName: "extractTask" */'@/views/extractViews/extractTask')
// 待接单(子路由)
const WaitList = () => import(/* webpackChunkName: "waitList" */'@/views/extractViews/extractTask/children/waitList')
// 待提取(子路由)
const WaitListExtract = () => import(/* webpackChunkName: "waitListExtract" */'@/views/extractViews/extractTask/children/waitExtract')
// 提货任务历史页
const ExtractHistory = () => import(/* webpackChunkName: "extractHistory" */'@/views/extractViews/extractHistory')
// 搜索结果页
const ExtractSearchResult = () => import(/* webpackChunkName: "extractSearchResult" */'@/views/extractViews/extractSearchResult')
//  提货任务详情
const ExtractDetails = () => import(/* webpackChunkName: "extractDetails" */'@/views/extractViews/extractDetails')

const Routers = [
  { // 提货任务首页
    path: '/extractTask',
    meta: {
      title: '提货任务'
    },
    component: ExtractTask,
    children: [
      {
        path: 'list',
        meta: {
          title: '提货任务',
          index: 0
        },
        components: {
          'task-view_0': WaitList
        }
      },
      {
        path: 'extract',
        meta: {
          title: '提货任务',
          index: 1
        },
        components: {
          'task-view_1': WaitListExtract
        }
      }
    ]
  },
  { // 提货任务历史页
    path: '/extractHistory',
    component: ExtractHistory,
    meta: {
      title: '历史'
    }
  },
  { // 搜索结果页
    path: '/extractSearchResult',
    component: ExtractSearchResult,
    meta: {
      title: '提货搜索'
    }
  },
  { // 提货任务详情
    path: '/extractDetails',
    meta: {
      title: '订单详情'
    },
    component: ExtractDetails
  }
]

export default Routers
