// 预留demo
import Demo from '@/router/subRouters/demo'
// 运单管理模块路由
import WayBillRouter from '@/router/subRouters/wayBill'
// order router
import orderRouter from '@/router/subRouters/order'
// 签收 router
import signforRouter from '@/router/subRouters/signfor'
// 提货任务 router
import extractRouter from '@/router/subRouters/extract'

const routes = [
  ...Demo,
  ...WayBillRouter,
  ...orderRouter,
  ...signforRouter,
  ...extractRouter,
  {
    path: '*',
    redirect: '/signforAll/signAll'
  }
]

export default routes
