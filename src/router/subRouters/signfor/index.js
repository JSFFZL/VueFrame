
const signforAll = () => import(/* webpackChunkName: "signforAll" */'@/views/signfor/signforAll')
const searchSignfor = () => import(/* webpackChunkName: "searchSignfor" */'@/views/signfor/searchSignfor')
const deliverySignfor = () => import(/* webpackChunkName: "deliverySignfor" */'@/views/signfor/deliverySignfor')
const detailsSignfor = () => import(/* webpackChunkName: "detailsSignfor" */'@/views/signfor/detailsSignfor')

// 签收记录 子路由
const signAll = () => import(/* webpackChunkName: "signAll" */'@/views/signfor/signforAll/children/signAll')
const signPortion = () => import(/* webpackChunkName: "signPortion" */'@/views/signfor/signforAll/children/signPortion')
const signRefusal = () => import(/* webpackChunkName: "signRefusal" */'@/views/signfor/signforAll/children/signRefusal')
const Routers = [
  {
    path: '/signforAll',
    meta: {
      title: '签收记录'
    },
    component: signforAll,
    name: signforAll,
    children: [
      {
        path: 'signAll',
        meta: {
          title: '签收记录',
          index: 0
        },
        components: {
          'sign-view_0': signAll
        }
      },
      {
        path: 'signPortion',
        meta: {
          title: '签收记录',
          index: 1
        },
        components: {
          'sign-view_1': signPortion
        }
      },
      {
        path: 'signRefusal',
        meta: {
          title: '签收记录',
          index: 2
        },
        components: {
          'sign-view_2': signRefusal
        }
      }
    ]
  },
  {
    path: '/searchSignfor',
    meta: {
      title: '签收记录搜索'
    },
    component: searchSignfor,
    name: searchSignfor
  },
  {
    path: '/deliverySignfor',
    meta: {
      title: '送货签收'
    },
    component: deliverySignfor,
    name: deliverySignfor
  },
  {
    path: '/detailsSignfor',
    meta: {
      title: '签收详情'
    },
    component: detailsSignfor,
    name: detailsSignfor
  }
]

export default Routers
