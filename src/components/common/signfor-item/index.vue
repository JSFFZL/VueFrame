<template>
  <div>
    <div @click="goDetails" class="item-wrap">
      <header>
        <div class="signforNum" v-if="signforRecord!=''">签收号:{{signforArr.signCode}}</div>
        <div class="signforNum" v-if="signforRecord==''">{{signforArr.waybillCode}}</div>
        <div class="log" v-if="signforRecord!=''&&signforArr.deliveryType==1"><div>送货</div></div>
        <div class="log" v-if="signforRecord!=''&&signforArr.deliveryType==2"><div>自提</div></div>
        <div class="log" v-if="signforRecord!=''&&(signforArr.cashierStatus==0||signforArr.cashierStatus==null)"><div>未收银</div></div>
        <div class="log" v-if="signforRecord!=''&&(signforArr.cashierStatus==1)"><div>已收银</div></div>
        <div class="date" v-if="signforRecord==''">{{signforArr.createTime | formatDate}}</div>
      </header>
      <div class="itemBody" >
        <div class="waybillNum" v-if="signforRecord!=''">运单号:{{signforArr.waybillCode}}</div>
        <div class="message-warp">
          <div class="messageCall">
            <div class="line">&nbsp;</div>
            <div style="margin-bottom: 20px">{{signforArr.invoiceUser}} ({{signforArr.invoiceMobileNo}})</div>
            <div>{{signforArr.receiptUser}} ({{signforArr.receiptMobileNo}})</div>
          </div>
          <div class="messagePrice">
            <div class="price"><span>￥</span>{{signforArr.totalReceivable?signforArr.totalReceivable:0}}</div>
            <div >应收款</div>
          </div>
        </div>
        <div class="address">{{signforArr.receiptFullAddress}}</div>
      </div>
      <footer>
        <div class="types">
          <div class="types-methods">{{signforArr.totalNum}}件</div>
          <div class="types-methods">{{signforArr.totalWeight}}kg</div>
          <div class="types-methods">{{signforArr.totalVolume}}m³</div>
        </div>
        <div class="cancel"   v-if="signforRecord!=''&&(signforArr.cashierStatus==0||signforArr.cashierStatus==null)">取消签收</div>
        <div class="cancel canceled" v-if="signforRecord!=''&&(signforArr.cashierStatus==1)">取消签收</div>
        <div class="cancel signforBtn" v-if="signforRecord==''">签收</div>
      </footer>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import Vue from 'vue'
    import * as API from '../../../http/common/api'
    import mixinUtils from '../../../mixins/common/public.js'
    export default {
      name: 'signforItem',
      mixins: [mixinUtils],
      components: {
      },
      props: {
        signforArr: {
          type: Object,
          required: true
        },
        signforRecord: {
          type: String
        }
      },
      data () {
        return {
        }
      },
      compouted: mapGetters([

      ]),
      methods: {

        // 去详情
        goDetails () {
          if(this.signforRecord == '') {
            var pageIndex = 1  // 签收页
          } else {
            var pageIndex = 0  // 取消签收页
          }
          this.$router.push({path: '/detailsSignfor',
            query: {
              'dispatcherDetailId': this.signforArr.dispatcherDetailId,
              'pageIndex': pageIndex
            }})
        }
      },
      mounted () {

      },
      filters: {
        formatDate: function (value) {
          let date = new Date(value)
          let y = date.getFullYear()
          let MM = date.getMonth() + 1
          MM = MM < 10 ? ('0' + MM) : MM
          let d = date.getDate()
          d = d < 10 ? ('0' + d) : d
          return y + '-' + MM + '-' + d
        }
      }
    }
</script>
<style lang="less" src="@/less/common/order.less"></style>
<style lang="less" scoped>
  .item-wrap{
    background: #fff;
    box-shadow: 0 5px 5px rgba(242,242,242,0.5);
  }
  header{
    margin: 0 28px;
    font-size: 32px;
    color: #333;
    line-height: 80px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #f2f1f6;
    justify-content: space-between;
    background: #fff!important;
    .log{
      width: 100px;
      height: 60px;
      background: url("../../../assets/images/cur-status-bgold.png") no-repeat center center;
      background-size:100% 100%;
      margin-right: 35px;
      div{
        transform: rotate(-15deg);
        font-size: 20px;
        text-align: center;
        line-height: 56px;
        color: #dd3333;
      }
    }
    .date{
      font-size: 24px;
      color: #666;

    }
    .signforNum{
      width: 400px;
    }
  }
  .itemBody{
    padding: 20px 24px;
    border-bottom: 2px #f2f1f6 solid;
    .waybillNum{
      font-size: 24px;
      color: #333;
      margin-bottom: 24px;
    }
  }
  .message-warp{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .messageCall{
      position: relative;
      margin-left: 35px;
      /*height:100px;*/
      width: 500px;
      color: #666;
      .line{
        width: 1px;
        position: absolute;
        left: -30px;
        top: 22px;
        height: 38px;
        border-left: 1px dotted #CCCCCC;
        &::before{
          content: ' ';
          display: block;
          position: absolute;
          top: -13px;
          left: -7px;
          font-size: 0;
          width: 12px;
          height: 12px;
          background: #48C5AA;
          border-radius: 10px;
        }
        &::after{
          content: ' ';
          display: block;
          position: absolute;
          bottom: -10px;
          left: -7px;
          font-size: 0;
          width: 12px;
          height: 12px;
          background: #FE9B4A;
          border-radius: 10px;
        }
      }

    }
    .messagePrice{
      width: 150px;
      text-align: right;
      line-height: 40px;
      color: #999;
      font-size: 24px;
      .price{
        color: #d33;
        font-size: 32px;
      }
      span{
        font-size: 20px;
      }
    }

  }
  .address{
    margin-left: 35px;
    font-size: 20px;
    color: #999;
    width: 500px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    padding: 0 28px;
    .types{
      display: flex;
      .types-methods{
        margin-right: 10px;
        color: #48C5AA;
        position: relative;
        border:none;
        font-size: 20px;
        font-weight: 300;
        padding: 1px 12px;
        border-radius:2px;
      }
      >.types-methods:after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid #48C5AA;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: left top;
        transform-origin: left top;
      }
    }

    .cancel{
      color: #317cc3;
      border: #317cc3 1px solid;
      border-radius: 2px;
      width: 136px;
      height: 52px;
      line-height: 52px;
      font-size: 28px;
      text-align: center;
    }
    .canceled{
      color: #ccc;
      border: #ccc 1px solid;
    }
    .signforBtn{
      background-image: linear-gradient(-55deg, #4F8FFF 0%, #CAA5FF 100%);
      color: #fff;
      border: none;
    }

  }
</style>
<style>
  .weui-dialog {
    border-radius: 12px!important;
    font-size: 16px!important;
    width: 540px!important;
  }
  .weui-dialog__btn_primary{
    color: #317CC3;
    font-size: 16px;
  }
  .weui-dialog__btn_default{
    color: #666;
  }
  .weui-dialog__bd:first-child{
    color: #333;
    font-size: 18px!important;
  }
</style>
