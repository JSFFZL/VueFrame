
<template>
    <div>
        <div class="list-wrapper" ref="wrapper">
            <div class="bscroll-container">
                <!-- 刷新提示信息 -->
                <div class="top-tip">
                    <span class="refresh-hook">下拉刷新</span>
                </div>
                <!-- 内容列表 -->
                <slot></slot>
                <!-- 底部提示信息 -->
                <div class="bottom-tip">
                    <span class="loading-hook">上拉加载</span>
                </div>
            </div>
        </div>

        <!-- alert提示刷新成功 -->
        <!-- <div class="alert-hook">刷新成功</div> -->
    </div>

</template>

<script>
  /**
   * @param {DDD} AAA // 注释
   * 
   * 
   */
  
  import BScroll from 'better-scroll'
  
  export default {
    name: 'fwScroll',
    data() {
      return {
        type: Array,
        default: null
      }
    },
  
    props: {
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
       * 是否开启横向滚动
       */
      scrollX: {
        type: Boolean,
        default: false
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
        type: Number, //Array 根据数据类型改变
        default: null
      },
      /**
       * 上拉加载
       */
      pullup: {
        type: Boolean,
        default: false
      },
      /**
       * 下拉刷新
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
      }
  
    },
  
    created() {
  
    },
    mounted() {
      // 保证在DOM渲染完毕后初始化better-scroll
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        // better-scroll的初始化
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          scrollX: this.scrollX
        })
        
        // 是否派发滚动事件
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
        // this.scroll.on('scroll', (position)=> {
        //   if(position.y > 30) {
        //     console.log('释放立即刷新');
        //   }
        // });
        // 是否派发滚动到底部事件，用于上拉加载
          this.scroll.on('scrollEnd', () => {
            if (!this.pullup) return;
            // 滚动到底部
            if ((this.scroll.y + 1) <= (this.scroll.maxScrollY + 50) && (this.scroll.y + 1) != 1) {
                this.$emit('pullup');
            }
          })
  
        // 是否派发顶部下拉事件，用于下拉刷新
          this.scroll.on('touchEnd', (pos) => {
            if (!this.pulldown) return;
            // 下拉动作
            if (pos.y > 50) {
              this.$emit('pulldown');
            }
          })
        // 是否派发列表滚动开始的事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      disable() {
        // 代理better-scroll的disable方法
        this.scroll && this.scroll.disable()
      },
      enable() {
        // 代理better-scroll的enable方法
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
    },
    watch: {
      // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style lang="less" src="./index.less" scoped></style>
