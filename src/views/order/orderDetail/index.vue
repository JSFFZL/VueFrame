<template>
  <div class="order-wrap order-detail-wrap">
    <div class="tab-box" ref="tabBox">
      <tab>
        <tab-item :selected="'orderBox' === curTab" @on-item-click="changeTab('orderBox')">运单</tab-item>
        <tab-item :selected="'goodsBox' === curTab" @on-item-click="changeTab('goodsBox')">货物</tab-item>
      </tab>
    </div>
    <!-- better-scroll -->
    <div class="orderDetailwrapper" ref="orderDetailwrapper">
      <div class="content">
        <div class="order-box order-item" ref="orderBox">
          <header class="top-box" :class="{'no-ordercode':!wayBillData.ordercode}">
            <div class="order-no">
              <p>
                运单号：{{wayBillData.code}}
                <br>
                {{wayBillData.ordercode ? `订单号：${wayBillData.ordercode}` : ''}}
              </p>
            </div>
            <div class="order-status">
              {{wayBillData.statusName}}
            </div>
            <div v-if="wayBillData.financeList&&wayBillData.financeList.length" class="cur-status" :class="getFinanceListClass"><span>{{wayBillData.financeList[0]}}</span></div>
            <!-- <div class="cur-status four-word" :class="{'four-word': wayBillData.deliveryAmountSeal==='部分收银'}"><span>部分收银</span></div> -->
            <div class="cur-status iwaitNotice" v-if="wayBillData.iwaitNotice"><span>等通知</span></div>
          </header>
          <div class="middle-box">
            <div class="netPoint send">
              <p class="point">{{wayBillData.invoiceOrgName}}</p>
              <!-- <p class="city">（{{wayBillData.invoiceCityName + ' ' + wayBillData.invoiceDistrictName}}）</p> -->
            </div>
            <div class="arrow"></div>
            <div class="netPoint recive">
              <p class="point">{{wayBillData.destOrgName}}</p>
              <!-- <p class="city">（{{wayBillData.receiptProvName + ' ' + wayBillData.receiptDistrictName}}）</p> -->
            </div>
          </div>
          <div class="bottom-box">
            <div class="order-address">
              <div class="address send">
                <div class="line">&nbsp;</div>
                <p>
                  <template v-if="wayBillData.invoiceCompany">
                    {{wayBillData.invoiceCompany}}<br>
                  </template>
                  {{wayBillData.invoiceUser}}<span v-if="wayBillData.invoiceMobleNo">（{{wayBillData.invoiceMobleNo}}）</span>
                </p>
                <p class="name">{{wayBillData.invoiceFullAddress}}</p>
                <div v-if="wayBillData.invoiceMobleNo" class="phone" @click="phone(wayBillData.invoiceMobleNo)"></div>
              </div>
              <div class="address recive">
                <p class="p1">
                  <template v-if="wayBillData.receiptCompany">
                    {{wayBillData.receiptCompany}}<br>
                  </template>
                  <span class="name-phone-box">
                    <span class="name-phone-content">
                      {{wayBillData.receiptUser}}<span v-if="wayBillData.receiptConsignorMobleNo" class="name-phone-phone">（{{wayBillData.receiptConsignorMobleNo}}）</span>
                    </span>
                    <span class="translate-type" v-if="wayBillData.distributionTypeName">
                      <span>{{wayBillData.distributionTypeName}}</span>
                    </span>
                  </span>
                </p>
                <p class="name">{{wayBillData.receiptFullAddress}}</p>
                <div class="phone" v-if="wayBillData.receiptConsignorMobleNo" @click="phone(wayBillData.receiptConsignorMobleNo)"></div>
              </div>
            </div>
          </div>

        </div>
        <!-- 发货要求 -->
        <div class="send-box order-item">
          <div class="order-title">
            <div class="left-box">
              发货要求
            </div>
            <div class="right-box">
            </div>
          </div>
          <div>
            <order-cell>
              <span slot="left">运输方式</span>
              <span slot="right">{{wayBillData.shippingTypeName}}</span>
            </order-cell>
            <order-cell isBottomCell isShowArrow @click.native="toMoreDetail(wayBillData.id)" class="ellipsis-wrap other-require-box">
              <span slot="left">更多要求</span>
              <span slot="right" style="height: 50px;">
                <span class="ellipsis other-require-list">
                  <!-- ><span 消除inline元素空白， font-size为0时，ellipsis不起作用 -->
                  <span v-if="wayBillData.backType">{{wayBillData.backType}}</span
                  ><span v-if="wayBillData.iwaitNotice">等通知</span
                  ><span v-if="wayBillData.specialRequire">{{wayBillData.specialRequire}}</span
                  ><span v-if="wayBillData.ibill">开票</span
                  ><span v-if="wayBillData.itruckLoad">整车</span
                  ><span v-if="wayBillData.iemergency">加急</span
                  ><span v-if="wayBillData.intoWarehouse">入仓</span
                  ><span v-if="wayBillData.unLoaded">卸货</span
                  ><span v-if="wayBillData.upStairs">上楼</span
                  ><span v-if="wayBillData.noticeChianCustoms">报关</span
                  ><span v-if="wayBillData.remark">{{wayBillData.remark}}</span>
                </span>
              </span>
            </order-cell>
          </div>
        </div>
        <!-- 货物信息 -->
        <div class="goods-box order-item" ref="goodsBox">
          <div class="order-title">
            <div class="left-box">
              货物信息
            </div>
            <div class="right-box">
              合计：{{wayBillData.totalNum}}件/{{wayBillData.weight}}kg/{{wayBillData.volume}}m³
            </div>
          </div>
          <div>
            <goods-cell
              v-for="(item, index) in wayBillData.appWaybillGoodsRespDtos"
              :key="index"
              :goodsData="item"
              :isBottomCell="index === wayBillData.appWaybillGoodsRespDtos - 1">
            </goods-cell>
          </div>
        </div>
        <!-- 费用信息 -->
        <div class="pay-box order-item">
          <div class="order-title">
            <div class="left-box">
              费用信息
            </div>
            <div class="right-box">
              总运费：{{wayBillData.totalFee}}元
            </div>
          </div>
          <div>
            <order-cell>
              <span slot="left">付款方式</span>
              <span slot="right">{{wayBillData.payWayName}}</span>
            </order-cell>
            <!-- <order-cell>
              <span slot="left">基本运费</span>
              <span slot="right">
                <template v-if="getDeliveryMoney(wayBillData.appWaybillFeeRespDtos, '基本运费')">
                  {{getDeliveryMoney(wayBillData.appWaybillFeeRespDtos, "基本运费")}}
                  <span class="money"> 元</span>
                </template>
              </span>
            </order-cell> -->

            <order-cell  v-for="item in wayBillData.appWaybillFeeRespDtos" :key="item.id" v-if="isShowFee(item.attrName)&&item.fee">
              <span slot="left">{{item.attrName}}</span>
              <span slot="right">
                <template>
                  {{item.fee}}
                  <span class="money"> 元</span>
                </template>
              </span>
            </order-cell>


            <order-cell isBottomCell>
              <span slot="left">代收货款</span>
              <span slot="right">
                <template v-if="getDeliveryMoney(wayBillData.appWaybillFeeRespDtos, '代收货款')">
                  {{getDeliveryMoney(wayBillData.appWaybillFeeRespDtos, "代收货款")}}
                  <span class="money"> 元</span>
                </template>
              </span>
            </order-cell>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部打印 -->
    <footer class="print-box">
      <div class="print-button" @click="printOrder">打印面单</div>
      <div class="print-button" @click="printTag">打印标签</div>
    </footer>
    <!-- 底部总费用 -->
    <!-- <div class="page-open_bill_footer">
      <div class="footer-cost_info" @click="isShowCostPopup=!isShowCostPopup">
        <div>总费用:</div>
        <div>{{wayBillData.totalFee}}</div>
        <div>元</div>
        <div :class="isShowCostPopup ? 'transRoute' : ''"></div>
      </div>
      <div class="footer-submit" @click="toAppPrint(wayBillData.id)">打印</div>
      <div class="footer-mask animated fadeIn faster" v-show="isShowCostPopup" @click="isShowCostPopup=!isShowCostPopup"></div>
      <div class="cost-popup animated slideInUp faster" v-show="isShowCostPopup">
        <div class="page-cost_info_list">
          <div class="page-cost_info_item" v-for="item in wayBillData.appWaybillFeeRespDtos" :key="item.id" v-if="isShowFee(item.attrName)&&item.fee">
            <div class="cost-key">{{item.attrName}}</div>
            <template>
              <div class="cost-number">{{item.fee}}</div>
              <div class="cost-unit">元</div>
            </template>
          </div>
        </div>
      </div>
    </div> -->
    <!-- 付款方式 popup start -->
    <pay-popup
      :isShow.sync="isShowPayPopup"
      manualShow
      @pay="getPayPopupResult">
    </pay-popup>
    <!-- 付款方式 popup end -->
  </div>
</template>
<script>
// 判断那些费用需要展示
let costEnumeration = [
  // {key: '', id: , name: ''},
  {key: 'basicfreight', id: 51, name: '基本运费'},
  {key: 'pickup', id: 52, name: '提货费'},
  {key: 'delivery', id: 53, name: '送货费'},
  {key: 'upstairs', id: 54, name: '上楼费'},
  {key: 'packingcharges', id: 55, name: '包装费'},
  {key: 'informationfee', id: 56, name: '信息费'},
  {key: 'collectpayment', id: 57, name: '代收货款'},
  {key: 'collectpaymentservice', id: 58, name: '代收货款手续费'},
  {key: 'insurancefee', id: 59, name: '保价费'},
  {key: 'emergencyfee', id: 60, name: '加急费'},
  {key: 'tax', id: 61, name: '税费'},
  {key: 'freightadvanced', id: 66, name: '垫付运费'},
  {key: 'declaredvalue', id: 68, name: '声明价值'},
  {key: 'business', id: 69, name: '业务费'},
  {key: 'otherfee', id: 70, name: '其他费用'},
  {key: 'transfercharge', id: 71, name: '中转费'},
  {key: 'terminalcharges', id: 76, name: '装卸费'},
  {key: 'forkliftcharge', id: 73, name: '叉车费'},
  {key: 'warehousefee', id: 74, name: '仓储费'},
  {key: 'freightpayment', id: 67, name: '垫付货款'}
]
import orderCell from '@/components/common/order-cell'
import goodsCell from '@/components/common/goods-cell'
import { Tab, TabItem } from 'vux'
import BScroll from 'better-scroll'
import * as API from '@/http/common/api'
import dateFormat from '@/components/common/vux-datetime/dateFormat.js'
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import mixinUtils from '@/mixins/common/public.js'
import mixinReload from '@/mixins/common/reload.js'
// 付款方式弹层
import payPopup from '@/components/common/pay-popup'
import Vue from "vue"
import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)
export default {
  name: "orderDetail",
  mixins: [mixinUtils, mixinReload],
  components: {
    orderCell,
    goodsCell,
    Tab,
    TabItem,
    payPopup
  },
  data () {
    return {
      scroll: '',
      curTab: 'orderBox',
      isClickTabScroll: false,
      wayBillData: {},
      isShowCostPopup: false,
      goodsBoxTop: 0,
      showFeesArray: [],
      isShowPayPopup: false, // 付款方式 现金 || 微信
      waybillId: '',
      payMoney: 0,
      isCashPayed: false // 是否现金付款过

    }
  },
  computed: {
    getFinanceListClass () {
      let financeList = this.wayBillData.financeList
      if (!financeList) return
      let length = financeList[0].split('').length
      console.log(length)
      return {
        'four-word': length === 4,
        'more-word': length > 4
      }
    }
  },
  mounted() {
    this.waybillId = this.$route.params.id
    // 注册调起付款弹窗事件
    let that = this
    this.$webViewTools.registerGlobalFun(registerGlobalFunNames.TRIGGERPAYBTN, function (params) {
      if (that.isCashPayed) return
      that.isShowPayPopup = true
    })
    this.initData()
  },
  methods: {
    initData () {
      this.$webViewTools.handleNativeFun(handleNativeFunNames.FWISSHOWPAYBTN, {"value": false})
      this.getWatBillDetail(this.waybillId)
    },
    getPayPopupResult(result) {
      if (result.index === 0) {
        this.isShowPayPopup = false
      }else if (result.index === 2) {
        this.$webViewTools.handleNativeFun(handleNativeFunNames.WECHATPAY, {'receiptPhase': '1', 'wayBillId': this.waybillId})
        this.isShowPayPopup = false
      } else if (result.index === 1) {
        const _this = this
        this.$vux.confirm.show({
          content: `已收款${_this.wayBillData.totalFee}元`,
          // 组件除show外的属性
          onCancel () {

          },
          onConfirm () {
            // _this.$toast.show('已收款')
            _this.isCashPayed = true
            _this.isShowPayPopup = false
            _this.$webViewTools.handleNativeFun(handleNativeFunNames.FWISSHOWPAYBTN, {"value": false})
          }
        })
      }
    },
    // 打印面单
    printOrder () {
      // 唤起native打印
      this.$webViewTools.handleNativeFun(handleNativeFunNames.PRINT_ORDER, {"value": this.waybillId})
    },
    // 打印标签
    printTag () {
      let waybillOrderTotalNum =  parseInt(this.wayBillData.totalNum)
      // 唤起native打印
      this.$webViewTools.handleNativeFun(handleNativeFunNames.PRINT_TAG, {"value": this.waybillId, "waybillOrderTotalNum": waybillOrderTotalNum})
    },
    getWatBillDetail (id) {
      const task = [
        this.$http(API.GET_WAY_BILL_RULE),
        this.$http(`${API.GET_WAY_BILL_DETAIL}/${id}`)
      ]
      Promise.all(task)
      .then(res => {
        let [totalFeeItemListRes, wayBillDataRes] = res
        this.__isSuccess(totalFeeItemListRes, function (result) { // 成功
        // 要展示的费用
          let totalFeeItemList = result.result.totalFeeItemList
          this.showFeesArray = costEnumeration.map(itemOne => {
            let name
            totalFeeItemList.map(itemTwo => {
              if (itemTwo.attrCode === itemOne.key) {
                name = itemOne.name
              }
            })
            return name
          })
        }.bind(this))
        this.__isSuccess(wayBillDataRes, function (result) { // 成功
          this.wayBillData = result.result
          this.initBetterScroll()
          if (this.wayBillData.payWayName === '现付') {
            if (this.wayBillData.financeList && this.wayBillData.financeList[0] === '未收银') {
              this.$webViewTools.handleNativeFun(handleNativeFunNames.FWISSHOWPAYBTN, {"value": true})
            }
            // this.getPayResult()
          }
        }.bind(this))
      }).catch(err => {
        console.log(err)
        this.$toast.show('网络错误，请重试')
      })
    },
    // 获取支付结果
    getPayResult () {
      let params = {
        receiptPhase: 1,
        waybillId: this.waybillId
      }
      this.$http(API.GET_PAY_RESULT, {
        type: 'POST',
        params
      }).then(res => {
          this.__isSuccess(res, function (result) { // 成功
            let paymentStatus = result.result.paymentStatus
            if (paymentStatus === 2 ) {
              this.$webViewTools.handleNativeFun(handleNativeFunNames.FWISSHOWPAYBTN, {"value": true})
              this.$toast.show('支付中...')
            }
          }.bind(this))
        })
        .catch(err => {
          console.log(err)
          this.showResult = true
          this.$toast.show('网络错误，请重试')
        })
    },
    // 获取代收货款
    getDeliveryMoney (allFees, name) {
      if (!allFees || !allFees.length) return ''
      let result
      allFees.forEach(item => {
        if (item.attrName === name) {
          result =  item.fee
        }
      })
      return result
    } ,
    phone (value) {
      this.$webViewTools.handleNativeFun(handleNativeFunNames.PHONECALL, {"value": value})
    },
    isShowFee (value) {

      if (this.showFeesArray.includes(value)) {
        return true
      }
      return false
    },
    initBetterScroll () {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.orderDetailwrapper, {
          // 是否回弹效果
          bounce: false,
          // 是否可以点击
          click: true,
          // 为3时才可on scroll事件
          probeType: 3
        })
        let that = this
        let tabBoxHeight = this.$refs.tabBox.offsetHeight
        // 减去tab高度
        this.goodsBoxTop = this.$refs.goodsBox.getBoundingClientRect().top - tabBoxHeight
        this.scroll.on('scroll' , (pos) => {
          if (!this.isClickTabScroll) {
            if (pos.y < -this.goodsBoxTop) {
              that.curTab = 'goodsBox'
            } else {
              that.curTab = 'orderBox'
            }
          }
        })
        // tab滚动结束，isClickTabScroll改为false
        this.scroll.on('scrollEnd' ,() => {
          this.isClickTabScroll = false
        })
      })
    },
    toMoreDetail (id) {
      this.$router.push(`/orderdetailmain/orderdetailsendmore/${id}`)
    },
    toAppPrint (id) {
      let d = this.wayBillData, goodsNameAll = ''
      // 唤起native打印
      this.$webViewTools.handleNativeFun(handleNativeFunNames.PRINT_TAG, {"value": d.id})
      // if (d.appWaybillGoodsRespDtos.length > 0) {
      //   d.appWaybillGoodsRespDtos.forEach(item => {
      //     goodsNameAll += item.goodsName + '/'
      //   });
      //   goodsNameAll = goodsNameAll.substring(0, goodsNameAll.length - 1 )
      // }
      // // 打印参数
      // let params = {
      //   wayBillnumber: d.code, // 运单号
      //   targetDotName: d.destOrgName, // 目的网点名称
      //   destCompanyName: d.invoiceOrgName, // 收货人公司名称
      //   destName: d.receiptUser, // 收货人名称
      //   destPhone: d.receiptConsignorMobleNo, // 收货人电话
      //   destAddress: d.receiptFullAddress, // 收货人地址
      //   goodsNameAll: goodsNameAll, // 货物名称集合 /...那个
      //   goodsNumberAll: d.totalNum, // 货物总件数
      //   collectionCost: d.orderGoodsPayment, // 代收货款
      //   costName: d.payWayName, // 付款名称
      //   invoiceUser: d.invoiceUser, // 发件人姓名
      //   invoiceMobleNo: d.invoiceMobleNo, // 发件人电话
      //   invoiceCompany: d.invoiceCompany, // 发货单位
      //   receiptCompany: d.receiptCompany, // 收货单位
      //   value: d.id, // 运单ID
      // }
      // // alert(JSON.stringify(params))
      // this.$webViewTools.handleNativeFun(handleNativeFunNames.PRINTORDER, params)
    },
    changeTab (value) {
      this.curTab = value
      // 点击时不触发 this.scroll.on('scroll'的判断tab功能
      this.isClickTabScroll = true
      let goodsBoxTop = this.goodsBoxTop
      // console.log(goodsBoxTop)
      if (value !== 'orderBox') {
        // 高度超过太多时回弹效果不好，这里让其只能滚动到最大滚动高度。
        if (-this.scroll.maxScrollY < goodsBoxTop) {
          this.scroll.scrollTo(0, this.scroll.maxScrollY, 300)
        } else {
          this.scroll.scrollTo(0, -goodsBoxTop, 300)
        }
      } else {
        this.scroll.scrollTo(0, 0, 300)
      }
    }
  }
}
</script>
<style lang="less" src="@/less/common/order.less"></style>
<style lang="less" scoped>
@import '../../../less/core.less';
@images: '../../../assets/images';
.order-detail-wrap{
  position: relative;
  display: flex;
  flex-direction: column;
  // left: 0;
  // top: 0;
  // overflow: hidden;
  // bscroll wrapper
  .orderDetailwrapper{
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    flex-grow: 1;
  }
  // bscroll content
  .content{
    padding-top: 102px;
    padding-bottom: 116px;
  }
  .order-item{
    background: #fff;
    overflow: hidden;
  }
  // 运单信息
  .order-box{
    position: relative;
    overflow: hidden;
    // margin-top: 102px;
    // padding-top: 15px;
    // 运单号等
    .top-box{
      width: 694px;
      margin: 0 auto;
      padding: 15px 0;
      border-bottom: 1px solid #E9E6F1;
      line-height: 44px;
      overflow: hidden;
      &.no-ordercode{
        padding: 0 0;
        .cur-status{
          top: 20px;
        }
      }
      .order-no{
        display: flex;
        // flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        height: 88px;
        font-size: 28px;
        float: left;
      }
      .order-status{
        margin-top: 22px;
      }
      // 印章
      .cur-status{
        left: 530px;
        top: 30px;
        &.iwaitNotice{
          left: 422px;
        }
      }
    }
    // 网点到网点
    .middle-box{
      width: 694px;
      margin: 0 auto;
      border-bottom: 1px solid #E9E6F1;
      padding: 23px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 28px;
      .netPoint{
        width: 280px;
        line-height: 40px;
        .city{
          color: #999999;
        }
      }
      .arrow {
        // position: relative;
        // top: 30px;
        width: 56px;
        height: 14px;
        margin: 0 10px;
        background: url(../../../assets/images/right-arrow.png);
        background-size: cover;
      }
    }
    // 地址电话等
    .bottom-box{
      .order-address{
        .address{
          width: 550px;
          position: relative;
          .phone{
            position: absolute;
            right: -62px;
            top: 32px;
            width: 40px;
            height: 40px;
            background: url(../../../assets/images/phone.png);
            background-size: cover;
          }
          &.recive{
            .name-phone-box{
              display: flex;
              align-items: center;
              width: 550px;
              position: relative;
              word-wrap: break-word;
              .name-phone-content{
                word-wrap: break-word;
                max-width: 490px;
              }
              .name-phone-phone{
                word-wrap: break-word;
                max-width: 550px;
              }
              .translate-type{
                width: 60px;
                flex: 0 0 60px;
                height: 32px;
                box-sizing: border-box;
                border: 1px solid #317CC3;
                border-radius: 4px;
                font-size: 20px;
                color: #317CC3;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .p1{
              overflow: hidden;
            }

          }
        }
      }
    }

  }
  // 发货要求
  .send-box{
    .ellipsis-wrap{
      height: 82px;
      overflow: hidden;
    }
    .ellipsis{
      width: 370px;
      text-align: right;
      display: inline-block;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  // 费用信息
  .pay-box{
    .right-box{
      // color: #d33;
      color: #666666;
    }
  }
  // 底部打印按钮
  .print-box{
    position: fixed;
    height: 98px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    bottom: 0;
    z-index: 100;
    background: #ffffff;
    border-top: 1px solid #f2f1f6;
    .print-button{
      border: 1px solid #317CC3;
      border-radius: 8px;
      width: 152px;
      height: 68px;
      margin-right: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #317CC3;
    }
  }
  // 底部固定按钮，copy kml代码
  .page-open_bill_footer {
    position: relative;
    // .flex-x(flex-start, center);
    position: fixed;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: 100px;
    background: #ffffff;
    border-top: 1px solid #f2f1f6;
    .footer-mask {
      position: fixed;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 100px;
      background: rgba(0, 0, 0, .5);
    }
    .cost-popup {
      width: 100%;
      position: absolute;
      left: 0px;
      bottom: 100px;
      max-height: 360px;
      background: #ffffff;
      z-index: 1;
      .page-cost_info_list {
        width: 100%;
        max-height: 360px;
        overflow: scroll;
        box-sizing: border-box;
        background: #ffffff;

        .page-cost_info_item {
          .flex-x(space-between, center);
          width: 100%;
          height: 90px;
          padding: 0px 30px;
          box-sizing: border-box;
          border-bottom: 2px solid @public_line-color;

          .cost-key {
            font-size: 32px;
            color: #333333;
          }

          .cost-number {
            .flex-x(flex-end, center);
            font-size: 32px;
            color: #333333;
            flex: 1;
          }

          .cost-unit {
            font-size: 28px;
            color: #666666;
            margin-left: 20px;
          }
        }
      }
    }
    .footer-cost_info {
      .flex-x(flex-start, center);
      height: 100px;
      flex: 1;
      box-sizing: border-box;
      padding-left: 30px;
      background: #ffffff;
      z-index: 2;
      position: relative;
      width: 500px;
      > div {

        &:nth-of-type(1) {
          .flex-x(flex-start, center);
          width: 128px;
          height: 32px;
          color: #333333;
          font-size:32px;
        }

        &:nth-of-type(2) {
          .flex-x(flex-start, center);
          color: @public_active_color;
          font-size: 40px;
        }

        &:nth-of-type(3) {
          .flex-x(flex-start, center);
          color: @public_active_color;
          font-size: 28px;
          margin: 6px 0px 0px 10px;
        }

        &:nth-of-type(4) {
          .flex-x(flex-start, center);
          width: 32px;
          height: 32px;
          background: url("@{images}/top_icon.png") no-repeat center center;
          background-size: cover;
          margin: 6px 0px 0px 20px;
          transition: .2s;
        }
      }

      .transRoute {
        transform: rotate(180deg);
      }
    }

    .footer-submit {
      .flex-x(center, center);
      float: right;
      position: relative;
      margin-top: -100px;
      width: 240px;
      height: 100px;
      background: linear-gradient(left, #caa5ff, #4f8fff);
      font-size: 32px;
      color: #ffffff;
      z-index: 2;
    }
  }
}
</style>
<style lang="less">
.order-detail-wrap{
  .tab-box{
    position: fixed;
    height: 88px;
    z-index: 90;
    top: 0;
    position: relative;
    width: 100%;
    color: #999999;
    font-size: 28px;
    .vux-tab-ink-bar {
      background-image: linear-gradient(left, #CAA5FF, #4F8FFF);
    }
    .vux-tab .vux-tab-item.vux-tab-selected{
      color: #317CC3;
    }
    .selected-item {

    }
  }
}
.weui-dialog{
  max-width: 80%!important;
  width: 80%!important;
}
.weui-dialog{
  border-radius: 12px;
  width: 72%;
}
.weui-dialog__bd:first-child{
  color: #030303;
}
.weui-dialog__ft{
  font-size: 16px;
}
.weui-dialog__btn_default{
  color:#666 ;
}
.weui-dialog__btn_primary{
  color: #317CC3;
}
</style>
