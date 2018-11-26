<template>
  <div class="order-wrap order-list-wrap">
    <div class="order-search-wrap">
        <fw-search placeholder="运单号/收货人/发货人/手机"></fw-search>
      </div>
    <div class="content">
      <div style="background: gray;height: 2000px;"></div>
      <!-- <order-search-result ref="orderSearchResult"  @setResultStatus="setResultStatus"></order-search-result> -->
    </div>
    <div class="order-open-bill-wrap">
      <div class="open-bill-button">
        开单
      </div>
    </div>
  </div>
</template>
<script>
import FwSearch from '@/components/public/fw-search'
import orderSearchResult  from '@/views/order/orderSearchResult'
export default {
  name: "orderList",
  components: {
    FwSearch,
    orderSearchResult
  },
  data () {
    return {
      beginTime: '',
      endTime: '',
      resultStatus: '',
    };
  },
  mounted () {
    let NOW, todayDate, endTime, startTime
    NOW = new Date()
    todayDate = NOW.getFullYear() + '-' + (NOW.getMonth() + 1) + '-' + NOW.getDate()
    endTime = new Date(todayDate + ' 00:00:00').getTime() + 24*60*60*1000 - 1
    startTime = endTime - 24*60*60*1000*1 + 1
    this.$refs.orderSearchResult.searchData('', startTime, endTime)
  },
  methods: {
    setResultStatus (value) {
      this.resultStatus = value
    }
  }
}
</script>
<style lang="less" scoped>
.order-list-wrap{
  background: #f2f1f6;
  display: flex;
  flex-direction: column;
  height: 100%;
  // padding-bottom: 135px;
  .order-search-wrap{
    width: 100%;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    height: 92px;
    .fw-search{
      width: 694px;
      height: 60px;
      border-radius: 8px;
    }
  }
  .content{
    flex-grow: 1;
    // height: calc(100% - 228px);
    // overflow: scroll;
  }
  .order-open-bill-wrap{
    // position: fixed;
    // bottom: 0;
    width: 100%;
    height: 136px;
    background: #fff;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    border-top: 1px solid #f2f1f6;
    .open-bill-button{
      background-image: linear-gradient(-55deg, #CAA5FF 0%, #4F8FFF 100%);
      border-radius: 8px;
      text-align: center;
      font-size: 32px;
      line-height: 88px;
      width: 702px;
      color: #fff;
    }
  }
}
</style>
