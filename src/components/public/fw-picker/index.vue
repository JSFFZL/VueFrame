<template>
<div class="fw-picker" v-if="isShow">
  <div class="position"></div>
  <div class="fw-scroll-wrap">

    <ul class="fw-scroll_list">
      <li class="fw-scroll_item" ref="scrollItem" :class="ativeIndex === index ? 'fw-scroll_item_active' : ''" v-for="(item, index) in dataSource" :key="index">
        <span>{{item.itemName}}</span>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
/**
 * @class picker组件
 * @param {Array} dataSource 数据源
 * @param {Boolean} isShow 是否显示
*/
import BScroll from 'better-scroll'

export default {
  name: 'fwPicker',
  data() {
    return {
      BScroll: null,
      // ativeIndex: 0
    }
  },
  props: {
    dataSource: {
      type: Array
    },
    isShow: {
      type: Boolean,
      default: false
    },
    ativeIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    isShow(isShow) {
      if (!isShow) return
      this.$nextTick(() => {
        this.BScroll = new BScroll('.fw-scroll-wrap',{
          bounce: false, // 阻止回弹
          wheel: {
            selectedIndex: 0,
            wheelWrapperClass: 'fw-scroll_list',
            wheelItemClass: 'fw-scroll_item'
          },
          probeType: 3,
          swipeTime: 1500
        })
        // 滚动到当前选择位置
        this.BScroll.wheelTo(this.ativeIndex)

        this.BScroll.on('scroll', function (res) {
          // this.ativeIndex = Math.round(Math.round(-res.y) / this.$refs.scrollItem[0].offsetHeight)
           // this.ativeIndex = this.BScroll.getSelectedIndex()
           this.$emit('update:ativeIndex', this.BScroll.getSelectedIndex())
        }.bind(this))
      })
    },
    ativeIndex: {
      handler: function (newIndex) {
        // 回传选中数据
        this.$emit('result', this.dataSource[newIndex])
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
