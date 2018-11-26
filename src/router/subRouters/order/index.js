// 运单历史
const orderHistory = () => import(/* webpackChunkName: "orderHistory" */'@/views/order/orderHistory')
const orderDetailMain = () => import(/* webpackChunkName: "orderDetailMain" */'@/views/order/orderDetail/main.vue')
// 运单详情
const orderDetail = () => import(/* webpackChunkName: "orderDetail" */'@/views/order/orderDetail')
// 运单详情更多
const orderDetailSendMore = () => import(/* webpackChunkName: "orderDetailSendMore" */'@/views/order/orderDetail/children/orderDetailSendMore')
// 运单管理
const orderList = () => import(/* webpackChunkName: "orderList" */'@/views/order/orderList')
// 运单搜索
const orderSearch = () => import(/* webpackChunkName: "orderSearch" */'@/views/order/orderSearch')

const Routers = [
  {
    path: '/orderhistory',
    meta: {
      title: '历史',
      keepAlive: true
    },
    component: orderHistory,
    name: orderHistory
  },
  {
    path: '/orderdetailmain',
    meta: {
      title: '运单详情'
    },
    component: orderDetailMain,
    children: [
      {
        path: 'orderdetail/:id',
        meta: {
          title: '运单详情'
        },
        component: orderDetail,
        name: 'orderDetail'
      },
      {
        path: 'orderdetailsendmore/:id',
        meta: {
          title: '更多要求'
        },
        component: orderDetailSendMore,
        name: orderDetailSendMore
      }
    ]
  },
  {
    path: '/orderlist',
    meta: {
      title: '运单管理',
      allowSavePositonRoutersName: ['orderDetail'],
      keepAlive: true
    },
    component: orderList,
    name: orderList
  },
  {
    path: '/ordersearch',
    meta: {
      title: '运单搜索',
      keepAlive: true
    },
    component: orderSearch,
    name: orderSearch
  }
]

export default Routers
