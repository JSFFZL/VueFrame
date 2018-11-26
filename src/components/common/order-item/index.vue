<template>
  <div class="order-wrap orderItem-wrap" @click="toDetail(wayBillData.id)">
    <header class="top-box">
      <div class="order-no">
        {{wayBillData.code}}
      </div>
      <div class="order-status">
        {{wayBillData.statusName}}
      </div>
    </header>
    <div class="middle-box">
      <div class="order-address">
        <div class="address send">
          <div class="line">&nbsp;</div>
          <p>{{wayBillData.invoiceFullAddress}}</p>
          <p class="name">{{wayBillData.invoiceUser}} {{getPhoneNUmber(wayBillData.invoiceMobleNo)}}</p>
        </div>
        <div class="address recive">
          <p>{{wayBillData.receiptFullAddress}}</p>
          <p class="name">{{wayBillData.receiptUser}} {{getPhoneNUmber(wayBillData.receiptConsignorMobleNo)}}</p>
        </div>
      </div>
      <div class="order-pay">
        <p class="pay-money"><span>¥</span>{{wayBillData.totalFee}}</p>
        <p class="pay-type">{{wayBillData.payWayName}}</p>
      </div>
    </div>
    <footer class="bottom-box">
      <div class="left-box">
        <div>{{wayBillData.totalNum}}件</div>
        <div>{{wayBillData.weight}}kg</div>
        <div>{{wayBillData.volume}}m³</div>
      </div>
      <div class="right-box">
        {{getDateFormat(wayBillData.createTime)}}
        <!-- createTime -->
      </div>
    </footer>
    <!-- 印章部分 -->
    <div v-if="wayBillData.financeList&&wayBillData.financeList.length" class="cur-status" :class="{'four-word': wayBillData.financeList[0]==='部分收银'}"><span>{{wayBillData.financeList[0]}}</span></div>
    <!-- 未收银 部分收银 已收银 -->
  </div>
</template>
<script>
import dateFormat from '@/components/common/vux-datetime/dateFormat.js'
export default {
  name: "orderItem",
  props: {
    wayBillData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

    }
  },
  methods: {
    getPhoneNUmber (phone) {
      if (phone) {
        return `(${phone})`
      } else {
        return ''
      }
    },
    getDateFormat (time) {
      return dateFormat(time, )
    },
    toDetail (id) {
      this.$router.push(`/orderdetailmain/orderdetail/${id}`)
    }
  }
}
</script>
<style lang="less" src="@/less/common/order.less"></style>

<style lang="less" scoped>
.orderItem-wrap{
  margin-bottom: 16px;
  background: white;
  position: relative;
  .top-box{
    width: 694px;
    margin: 0 auto;
    border-bottom: 1px solid #E9E6F1;
    height: 76px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .order-no{
      font-size: 28px;
    }
  }
  .middle-box{
    padding-top: 5px;
    // padding-bottom: 0px;
    position: relative;
    .order-pay{
      position: absolute;
      right: 30px;
      top: 60px;
      text-align: right;
      .pay-money{
        color: #DD3333;
        font-size: 36px;
        span{
          font-size: 24px;
          padding: 10px;
        }
      }
      .pay-type{
        margin-top: 7px;
        font-size: 24px;
        color: #999999;
      }
    }
  }
  .bottom-box{
    border-top: 1px solid #E9E6F1;
    overflow: hidden;
    .left-box{
      float: left;
      margin-left: 16px;
      color: #48C5AA;
      margin-top: 18px;
      div{
        border: 1px solid #48C5AA;
        border-radius: 4px;
        float: left;
        margin-left: 12px;
        height: 32px;
        box-sizing: border-box;
        padding: 0 10.5px;
        font-size: 20px;
        display: flex;
        align-items: center;
      }
    }
    .right-box{
      font-size: 24px;
      color: #666666;
      float: right;
      margin-right: 36px;
      height: 72px;
      display: flex;
      align-items: center;
    }
  }
}

</style>