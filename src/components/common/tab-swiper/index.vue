<template>
<div class="fw-tab_swiper">
  <!-- tab start -->
  <ul class="fw-tab">
    <li
      class="fw-tab_item"
      :class="index === currentIndex ? 'fw-tab_item_active' : ''"
      v-for="(item, index) in dataSource"
      :key="index"
      @click="switchTab(index, item)"
    >{{item.name}}</li>
    <span
      class="fw-tab_item_line"
      :style="{width: '16%', left: 100 / dataSource.length * currentIndex + (dataSource.length === 2 ? 17 : 8.5) + '%'}"
    ></span>
  </ul>
  <!-- tab end -->

  <!-- 搜索slot start -->
  <slot name="search"></slot>
  <!-- 搜索slot end -->

  <!-- panel start -->
  <div class="swiper-wrapper" ref="swiper">
    <div class="swiper-center" :style="{width: dataSource.length + '00%', minHeight: '20vh'}">
      <!-- 淘宝订单风格，每次tab切换重新刷新，并且滑动的时候看到的是空白 -->
      <div class="swiper-center_item"
        v-for="(item, index) in dataSource"
        :key="index"
      >
        <div v-show="index === currentIndex">
          <router-view class="subView" :name="item.routerViewName + index"></router-view>
        </div>
      </div>
    </div>
  </div>
  <!-- panel end -->
</div>
</template>

<script>
/**
 * @param {Array} dataSource 数据源 name: tab名称, routerPath: 渲染子路由路径(需配置相应路由), ps: [{name: '', routerPath: '', routerViewName: ''}]
 * @param {Number} animationTime 动画时长 默认200
 * @param {Number} height 滚动区域高度，默认最小高度200
*/

import BScroll from 'better-scroll'

export default {
  name: 'TabSwiper',
  data() {
    return {
      scroll: null,
      currentIndex: 0 // 当前操作索引 (x)
    }
  },
  props: {
    dataSource: {
      type: Array,
      default: function () {
        return [
          {
            name: 'name1',
            routerPath: '/testFwBtns',
            routerViewName: ''
          },
          {
            name: 'name2',
            routerPath: '/path2',
            routerViewName: ''
          },
          {
            name: 'name3',
            routerPath: '/path3',
            routerViewName: ''
          }
        ]
      }
    },
    height: {
      type: Number,
      default: 200
    },
    animationTime: {
      type: Number,
      default: 200
    }
  },
  mounted() {
    // 判断当前路由，为以后点进来直接跳转做处理
    let curPath = this.$route.path
    this.dataSource.some((item, index) => {
      if (curPath === item.routerPath) {
        this.currentIndex = index
      }
    })
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.swiper, {
        scrollX: true,
        scrollY: false,
        momentum: false,   // 关闭或者打开惯性运动的执行
        snap: { // 隔断（翻页)
          loop: false,
          threshold: 0.3
        },
        snapSpeed: this.animationTime,   //滑动的时间
        eventPassthrough: 'vertical', // 开启原生纵向滚动,
        bounce: false
      })
      // 跳转到相应位置
      this.scroll.goToPage(this.currentIndex, 0, this.animationTime)
      this.scroll.on('touchEnd', function(el) {
        this.$nextTick(() => {
          this.currentIndex = this.scroll.getCurrentPage().pageX
          this.switchTab(this.currentIndex, this.dataSource[this.currentIndex])
        })
      }.bind(this))

    })
  },
  methods: {
    switchTab(index, item) {
      this.currentIndex = index
      this.scroll.goToPage(index, 0, this.animationTime)
      // replace代替push
      this.$router.replace(item.routerPath)
    }
  },
  watch: {
    currentIndex(val) {
      // console.log(val)
    },
    '$route'(to, from, next) {
      this.currentIndex = to.meta.index
      this.scroll.goToPage(this.currentIndex, 0, this.animationTime)
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
