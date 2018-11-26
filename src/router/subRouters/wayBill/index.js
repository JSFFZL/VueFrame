/**
 * 运单管理模块路由
*/
// 开单页
const OpenBill = () => import(/* webpackChunkName: "openbill" */'@/views/wayBillViews/openBill')
// 开单页 -> 目的地网点页
const TargetDot = () => import(/* webpackChunkName: "targetdot" */'@/views/wayBillViews/openBill/children/targetDot')
// 开单页 -> 发货人信息页
const Deliver = () => import(/* webpackChunkName: "deliver" */'@/views/wayBillViews/openBill/children/deliver')
// 开单页 -> 收货人信息页
const Receive = () => import(/* webpackChunkName: "receive" */'@/views/wayBillViews/openBill/children/receive')
// 开单页 -> 发货要求
const MoreLimit = () => import(/* webpackChunkName: "morelimit" */'@/views/wayBillViews/openBill/children/moreLimit')
// 开单页 -> 货物信息
const GoodsInfo = () => import(/* webpackChunkName: "goodsinfo" */'@/views/wayBillViews/openBill/children/goodsInfo')
// 开单页 -> 添加费用
const CostInfo = () => import(/* webpackChunkName: "costinfo" */'@/views/wayBillViews/openBill/children/costInfo')

const Routers = [
  {
    path: '/openbill', // 开单页 main
    name: 'openBill',
    meta: {
      title: '移动开单',
      index: 1
    },
    children: [
      {
        path: 'targetdot', // 开单页 -> 目的地网点页
        name: 'targetdot',
        meta: {
          title: '选择目的网点'
        },
        component: TargetDot
      },
      {
        path: 'deliver', // 开单页 -> 发货人信息页
        meta: {
          title: '发货人信息'
        },
        component: Deliver
      },
      {
        path: 'receive', // 开单页 -> 收货人信息页
        meta: {
          title: '收货人信息'
        },
        component: Receive
      },
      {
        path: 'morelimit', // 开单页 -> 发货要求
        meta: {
          title: '更多要求'
        },
        component: MoreLimit
      },
      {
        path: 'goodsinfo', // 开单页 -> 货物信息
        meta: {
          title: '货物信息'
        },
        component: GoodsInfo
      },
      {
        path: 'costinfo', // 开单页 -> 费用详情页
        meta: {
          title: '添加费用'
        },
        component: CostInfo
      }
    ],
    component: OpenBill
  }
]

export default Routers
