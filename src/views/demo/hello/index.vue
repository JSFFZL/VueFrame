<template>
  <div class="hello">
    <tab-swiper
      :dataSource="list"
    ></tab-swiper>
  </div>
</template>

<script>
import TabSwiper from '@/components/common/tab-swiper'

export default {
  name: 'hello',
  data () {
    return {
      list: [
        {
          name: '全部签收',
          routerPath: '/hello',
          routerViewName: 'swiper-view_'
        },
        {
          name: '部分签收',
          routerPath: '/hello/demo2',
          routerViewName: 'swiper-view_'
        },
        {
          name: '全部拒签',
          routerPath: '/hello/demo3',
          routerViewName: 'swiper-view_'
        }
      ]
    }
  },
  components: {
    TabSwiper
  },
}
</script>

<style lang="less" src="./index.less"></style>
