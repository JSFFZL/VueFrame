<template>
  <div class="goods-cell" :class="{'bottom-cell': isBottomCell}">
    <h4 class="title">
      货物名称：{{goodsData.goodsName}}
    </h4>
    <div class="details">
      <p>件数：{{goodsData.packageNum}}件</p>
      <p>重量：{{goodsData.weight}}kg</p>
      <p>体积：{{goodsData.volume}}m³</p>
    </div>
    <div class="details">
      <p>包装：{{goodsData.packingName}}</p>
      <p>货物类型：{{goodsData.goodsTypeName}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "goodsCell",
  props: {
    // 是否最后一个cell，去除灰色间隔
    isBottomCell: {
      type: Boolean,
      default: false
    },
    goodsData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.goods-cell{
  padding-top: 15px;
  // line-height: 40px;
  font-size: 28px;
  color: #666666;
  box-sizing: border-box;
  &::after{
    content: ' ';
    height: 8px;
    width: 100%;
    display: block;
    background: #f2f1f6;
  }
  .title{
    color: #333333;
    padding: 0 28px;
    line-height: 60px;
  }
  .details{
    display: flex;
    padding: 0 28px;
    padding-bottom: 19px;
    justify-content: flex-start;
    p{
      width: 33%;
    }
  }
  &.bottom-cell{
    &::after{
      display: none;
    }
  }
}
</style>