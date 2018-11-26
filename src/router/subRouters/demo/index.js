// 初始页
const Hello = () => import(/* webpackChunkName: "hello" */'@/views/demo/hello')
// jsbridge Demo
const JsBridge = () => import(/* webpackChunkName: "jsbridge" */'@/views/demo/jsBridgeDemo')

const Demo1 = () => import(/* webpackChunkName: "demo1" */'@/views/demo/demo1')
const Demo2 = () => import(/* webpackChunkName: "demo2" */'@/views/demo/demo2')
const Demo3 = () => import(/* webpackChunkName: "demo3" */'@/views/demo/demo3')

const testFwBtns = () => import(/* webpackChunkName: "test-fw-btns" */'@/views/demo/test-fw-btns')
const testScroll = () => import(/* webpackChunkName: "testScroll" */'@/views/demo/testScroll')
const Routers = [
  {
    path: '/testFwBtns',
    meta: {
      title: 'testFwBtns'
    },
    children: [
      {
        path: '1',
        component: Demo1
      },
      {
        path: '2',
        component: Demo2
      },
      {
        path: '3',
        component: Demo3
      }
    ],
    component: testFwBtns
  },
  {
    path: '/hello',
    meta: {
      title: 'hello'
    },
    children: [
      {
        path: '',
        meta: {index: 0},
        components: {
          'swiper-view_0': Demo1
        }
      },
      {
        path: 'demo2',
        meta: {index: 1},
        components: {
          'swiper-view_1': Demo2
        }
      },
      {
        path: 'demo3',
        meta: {index: 2},
        components: {
          'swiper-view_2': Demo3
        }
      }
    ],
    component: Hello
  },
  { // jsbridge 预留demo界面
    path: '/jsbridge',
    meta: {
      title: 'jsbridge'
    },
    component: JsBridge
  },
  {
    path: '/testScroll',
    component: testScroll
  }
]

export default Routers
