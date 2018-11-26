<template>
  <div class="scroll-wrapper" ref="scrollWrapper">
    <div class="scroll-wrapper-content">
      <div ref="scrollMain" v-show="showResult">
        <!-- 头部上拉刷新 start-->
        <div class="top-tip">{{topTipText}}</div>
        <!-- 头部上拉刷新 end-->
        <div v-if="data.length">
          <slot></slot>
          <!-- 底部下拉加载 start-->
          <div class="bottom-tip" @click="$emit('scrollToEnd')">
            <span class="loading-hook">{{bottomTipText}}</span>
          </div>
          <!-- 底部下拉加载 end-->
        </div>
        <div ref="noFind" v-show="!data.length">
          <no-find  :info="noFindInfo"></no-find> 
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import NoFind from '@/components/public/fw-nofind'
export default {
  name: "scrollWrapper",
  components: {
    NoFind
  },
  props: {
    // ajax是否请求完毕
    showResult: {
      type: Boolean,
      default: false
    },
    // 无数据时展示的文案
    noFindInfo: {
      type: String,
      default: '暂无数据'
    },
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: true
    },
    /**
     * 是否派发滚动事件
     */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 列表的数据
     */
    data: {
      type: Array,
      default: null
    },
    /**
     * 是否派发滚动到底部的事件，用于上拉加载
     */
    pullup: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    pulldown: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发列表滚动开始的事件
     */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 当数据更新后，刷新scroll的延时。
     */
    refreshDelay: {
      type: Number,
      default: 20
    },
    /**
     * 如果启用loading交互，传递loading的状态
     * isShow: false
     * showIcon: false,    // 是否显示loading的icon
     * status: ''  // '正在加载...', '刷新成功', '刷新失败', ''
     */
    loadingStatus: {
      type: Object,
      default: function () {
        return {
            showIcon: false,
            status: ''
        };
      }
    },
    /**
     * 是否启用下拉刷新的交互
     */
    pulldownUI: {
      type: Boolean,
      default: false
    },
    /**
     * 是否启用上拉加载的交互
     */
    pullupUI: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scroll: '',
      topTipText: '下拉刷新',
      pageNum: 0,
      bottomTipText: '查看更多'
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      this.refresh();
    }
  },
  methods: {
    refresh() {
      // 代理better-scroll的refresh方法
      this.$nextTick(() => {
        this.scroll && this.scroll.refresh()
        this.bottomTipText = '查看更多';
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        click: true,
        probeType: 3,
        // 是否回弹效果
        // bounce: false,
      })
      let that = this
      this.$refs.noFind.style.height = this.$refs.scrollWrapper.offsetHeight + 'px'
      this.$refs.scrollMain.style.minHeight = this.$refs.scrollWrapper.offsetHeight + 'px'
      this.scroll.on('scroll' , (pos) => {
        if (pos.y > 50) {
          this.topTipText = '释放立即刷新'
        } else {
          this.topTipText = '下拉刷新'
        }
      })
      this.scroll.on('touchEnd' ,(pos) => {
        that.topTipText = '下拉刷新'
        if (pos.y > 50) {
          // that.$toast.show('刷新成功')
          this.$emit('pulldown');
          // scroll.refresh()
        }else if(pos.y < (this.scroll.maxScrollY + 1)) {
          // that.$toast.show('加载成功')
          // 恢复文本值 
          if (!this.data.length) return
          this.bottomTipText = '加载中';
          this.$emit('scrollToEnd')
        }
      })
    })
  }
  // <transition>
  //       <router-view v-if="!$route.meta.keepAlive" class="conter"></router-view>
  //     </transition>
  //     <transition>
  //       <keep-alive>
  //         <router-view v-if="$route.meta.keepAlive" class="conter"></router-view>
  //       </keep-alive>
  //     </transition>
//   router.beforeEach((to, from, next) => {
//   if (from.meta.allowSavePositonRoutersName && from.meta.allowSavePositonRoutersName.length && from.meta.allowSavePositonRoutersName.includes(to.name)) {
//     from.meta.customSavedPosition = document.querySelector('.routerScrollWrapper').scrollTop
//     from.meta.keepAlive = true
//   } else {
//     from.meta.keepAlive = false
//   }
//   window.document.title = to.meta.title
//   next() // 可接受参数重定向
// })

// router.afterEach((to, from) => {
//   if (!to.meta.allowSavePositonRoutersName || !to.meta.allowSavePositonRoutersName.length || !to.meta.allowSavePositonRoutersName.includes(from.name)) return
//   if (to.meta.customSavedPosition && to.meta.keepAlive) {
//     setTimeout(() => {
//       document.querySelector('.routerScrollWrapper').scrollTop = to.meta.customSavedPosition
//     }, 4)
//   }
// })
}
</script>
<style lang="less" scoped>
.scroll-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  .top-tip{
    position: absolute;
    width: 100%;
    line-height: 50px;
    top: -50px;
    text-align: center;
  } 
  // 只有content超过wrapper时bscroll才会滚动
  .scroll-wrapper-content{
    min-height: calc(100% + 1px);
    
  }
  .bottom-tip{
    width: 100%;
    line-height: 50px;
    text-align: center;
  }
}
</style>