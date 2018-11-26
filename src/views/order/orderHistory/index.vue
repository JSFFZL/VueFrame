<template>
  <div class="order-wrap order-history">
    <div class="order-search-wrap" @click.stop.prevent="showAppSearch">
      <fw-search placeholder="运单号/发货人/收货人/手机" isDisabled></fw-search>
    </div>
    <div class="container">
      <order-search-result ref="orderSearchResult" @setResultStatus="setResultStatus" isUseCustomTime></order-search-result>
    </div>
  </div>
</template>
<script>
import orderSearchResult  from '@/views/order/orderSearchResult'
import FwSearch from '@/components/public/fw-search'
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
export default {
  name: "orderHistory",
  components: {
    FwSearch,
    orderSearchResult
  },
  data () {
    return {
    }
  },
  mounted () {
    // this.$refs.orderSearchResult.searchData()
  },
  methods: {
    setResultStatus (value) {
      this.resultStatus = value
    },
    showAppSearch () {
      this.$router.push('/ordersearch')
      // this.$webViewTools.handleNativeFun(handleNativeFunNames.TOSEARCH)
    },
  }
}
</script>
<style lang="less" scoped>
@searchHeight: 92px;
.order-history{
  background: #f2f1f6;
  height: 100%;
  .order-search-wrap{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: @searchHeight;
    position: relative;
    background: #f2f1f6;
    z-index: 1;
    .fw-search{
      width: 694px;
      height: 60px;
      border-radius: 8px;
    }
  }
  .container{
    height: calc(100% - @searchHeight);
  }
}
</style>


