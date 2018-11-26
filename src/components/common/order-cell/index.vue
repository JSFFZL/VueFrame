<template>
  <div class="order-cell" :class="{'bottom-cell': isBottomCell, 'show-arrow': isShowArrow}">
    <div class="left">
      <slot name="left">
      </slot>
    </div>
    <div class="right">
      <slot name="right">
      </slot>
    </div>
    <div class="order-arrow">
    </div>
  </div>
</template>
<script>
export default {
  name: "orderCell",
  props: {
    // 是否最后一个cell，去除底部border
    isBottomCell: {
      type: Boolean,
      default: false
    },
    // 是否显示箭头
    isShowArrow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  }
}
</script>
<style lang="less" scoped>
  .order-cell{
    position: relative;
    width: 694px;
    margin: 0 auto;
    border-bottom: 1px solid #EBE9F1;
    line-height: 50px;
    font-size: 28px;
    overflow: hidden;
    &.bottom-cell {
      border-bottom: 0;
    }
    .left{
      padding: 16px 0;
      color: #666666;
      float: left;
      width: 150px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .right{
      padding: 16px 0;
      float: right;
      color: #333333;
      max-width: 532px;
      // text-align: right;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .money{
        color: #666666;
      }
    }
    &.show-arrow{
      .right{
        margin-right: 30px;
        // max-height: 72px;
      }
      .order-arrow{
        width: 8px;
        height: 16px;
        background: url(../../../assets/images/order-arrow.png);
        background-size: cover;
        position: absolute;
        top: calc(50% - 8px);
        right: 0;
      }
    }
  }
</style>