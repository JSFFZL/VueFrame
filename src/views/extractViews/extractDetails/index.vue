<template>
  <div class="page-extract_details" >
    <!-- 头部导航 start -->
    <div class="tab-box" ref="tabBox">
      <tab>
        <tab-item :selected="'orderBox' === curTab" @on-item-click="changeTab('orderBox')">订单</tab-item>
        <tab-item :selected="'goodsBox' === curTab" @on-item-click="changeTab('goodsBox')">货物</tab-item>
      </tab>
    </div>
    <!-- 头部导航 end -->

    <!-- better-scroll start -->
    <div class="orderDetailwrapper" ref="orderDetailwrapper" v-show="dataInfo.id">
      <div class="better-scroll_content">
        <!-- 订单信息 && 收发货人 start -->
        <div class="extract-details_info">
          <div class="details-info_number">
            <span>订单号:</span><span>{{dataInfo.orderCode}}</span>
          </div>
          <div class="details-info_cost">
            <span>成本:</span><span>{{dataInfo.apportionedCost}}元</span>
          </div>
          <div class="details-info_time">
            <div>
              <span>分配时间:</span><span v-show="dataInfo.distributeTime">{{dataInfo.distributeTime | filterTime}}</span>
            </div>
            <div>
              <span>预约时间:</span><span v-show="dataInfo.appointDeliveryTime">{{dataInfo.appointDeliveryTime | filterTime}}</span>
            </div>
          </div>
          <!-- 图章 start -->
          <div class="details-seal"><span>{{dataInfo.status === 3 ? '未提货' : '未接单'}}</span></div>
          <!-- 图章 end -->
        </div>
        <!-- 订单信息 && 收发货人 end -->

        <!-- 发货人 && 收货人 start -->
        <div class="details-receive_deliver">
          <div class="details-receive_deliver_left"></div>
          <div class="details-receive_deliver_right">
            <div class="receive-deliver_right_list">
              <div class="receive-deliver_right_item" v-for="(item, index) in receiveDeliverData" :key="index" v-show="item.userMobile && item.userName">
                <div class="receive-deliver_info">
                  <div class="receive-deliver_item_companyname">
                    <div class="receive_companyname" v-show="item.companyName">{{item.companyName || ''}}</div>
                    <div class="receive_companyname" v-show="!item.companyName">
                      <span>{{item.userName || ''}}</span>(<span>{{item.userMobile || ''}}</span>)
                    </div>
                    <div class="receive_icon" v-show="index === 0"></div>
                  </div>
                  <div class="receive-deliver_item_name" v-show="item.companyName">
                    <span>{{item.userName || ''}}</span>(<span>{{item.userMobile || ''}}</span>)
                  </div>
                  <div class="receive-deliver_item_address">
                    <span>{{item.address || ''}}</span>
                  </div>
                </div>
                <!-- 电话icon start -->
                <div class="receive-deliver_phone" @click="callPhone(item.userMobile)">
                  <span></span>
                </div>
                <!-- 电话icon end -->
              </div>
            </div>
          </div>
        </div>
        <!-- 发货人 && 收货人 end -->

        <!-- 发货要求 start -->
        <div class="details-require">
          <fw-cell-title title="发货要求"></fw-cell-title>
          <fw-cell>
            <div class="cell-title">回单要求</div>
            <div>{{dataInfo.receiptTypeName}}</div>
          </fw-cell>
          <fw-cell>
            <div class="cell-title">特殊要求</div>
            <div>{{dataInfo.specialRequire}}</div>
          </fw-cell>
          <fw-cell>
            <div class="cell-title">备注</div>
            <div class="cell-title_remark">{{dataInfo.remark}}</div>
          </fw-cell>
        </div>
        <!-- 发货要求 end -->

        <!-- 货物信息 start -->
        <div class="details-goods" ref="goodsBox">
          <div class="details-goods_cell_title">
            <fw-cell-title  title="货物信息" :subTitle="'合计：' + dataInfo.goodsInfo"></fw-cell-title>
          </div>
          <div class="details-goods_list">
            <div class="details-goods_item" v-for="(item, index) in dataInfo.goodsDetailsRespDTOs" :key="index">
              <div class="goods-item_goodname">
                <span>货物名称:</span><span>{{item.goodsName}}</span>
              </div>
              <div class="goods-item_info">
                <p><span>件数:</span><span>{{item.amount}}件</span></p>
                <p><span>重量:</span><span>{{item.weight}}㎏</span></p>
                <p><span>体积:</span><span>{{item.volume}}m³</span></p>
              </div>
            </div>
          </div>
        </div>
        <!-- 货物信息 end -->

        <!-- 费用信息 start -->
        <div class="details-require">
          <fw-cell-title title="费用信息" :subTitle="'预计运费: ' + (dataInfo.estimateFee === null ? '-元' : dataInfo.estimateFee + '元')"></fw-cell-title>
          <fw-cell>
            <div class="cell-title">付款方式</div>
            <div class="cell-subtitle" v-show="dataInfo.freights">{{dataInfo.paymentTypeName}}</div>
          </fw-cell>
          <fw-cell>
            <div class="cell-title">运费</div>
            <div class="cell-subtitle" v-show="dataInfo.freights"><span>{{dataInfo.freights}}</span><span>元</span></div>
          </fw-cell>
          <fw-cell>
            <div class="cell-title">提货费</div>
            <div class="cell-subtitle" v-show="dataInfo.pickupFee"><span>{{dataInfo.pickupFee}}</span><span>元</span></div>
          </fw-cell>
          <fw-cell>
            <div class="cell-title">声明价值</div>
            <div class="cell-subtitle" v-show="dataInfo.declareValue"><span>{{dataInfo.declareValue}}</span><span>元</span></div>
          </fw-cell>
          <fw-cell>
            <div class="cell-title">代收货款</div>
            <div class="cell-subtitle" v-show="dataInfo.goodsPayment"><span>{{dataInfo.goodsPayment}}</span><span>元</span></div>
          </fw-cell>
        </div>
        <!-- 费用信息 end -->

        <!-- 提交按钮 statr -->
        <div class="details-button">
          <div class="details-button_btn" @click="handleSubmit">
            <span>{{dataInfo.status === 3 ? '补录运单' : '接单'}}</span>
          </div>
        </div>
        <!-- 提交按钮 end -->


      </div>
    </div>
    <!-- better-scroll end -->
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import { Tab, TabItem } from 'vux'
import * as API from '@/http/common/api'
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
// cell 组件
import FwCell from '@/components/public/fw-cell'
// cellTitle 组件
import FwCellTitle from '@/components/public/fw-cell-title'
import mixinUtils from '@/mixins/common/public.js'

export default {
  name: "orderDetail",
  mixins: [mixinUtils],
  components: {
    Tab,
    TabItem,
    FwCell,
    FwCellTitle
  },
  data () {
    return {
      dataInfo: {}, // 获取的数据
      receiveDeliverData: [], // 发货人收货人数据
      scroll: '',
      curTab: 'orderBox',
      isClickTabScroll: false,
      isShowCostPopup: false,
      goodsBoxTop: 0
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm._getWatBillDetail(vm.$route.query.id)
    })
  },
  filters: {
    filterTime: function (timeStamp) {
      let currentYear =  new Date(timeStamp).getFullYear()
      let currentMonth =  new Date(timeStamp).getMonth() + 1
      let currentDate =  new Date(timeStamp).getDate()
      let currentHours =  new Date(timeStamp).getHours()
      let currentMinutes =  new Date(timeStamp).getMinutes()
      return `${currentYear}-${currentMonth}-${currentDate} ${currentHours}:${currentMinutes}`
    }
  },
  methods: {
    // 请求订单数据
    _getWatBillDetail (id) {
      this.$http(API.GET_TASK_DETAILS, {
        type: 'POST',
        params: {
          orderId: id
        }
      })
      .then(res => {
        this.__isSuccess(res, function (result) {
          this.dataInfo = result.result
          this.receiveDeliverData = [
            {
              companyName: this.dataInfo.invoiceCompanyName,
              userName: this.dataInfo.invoiceUserName,
              userMobile: this.dataInfo.invoiceUserMobile,
              address: this.dataInfo.invoiceAddress
            },
            {
              companyName: this.dataInfo.receiptCompanyName,
              userName: this.dataInfo.receiptUserName,
              userMobile: this.dataInfo.receiptUserMobile,
              address: this.dataInfo.receiptAddress
            }
          ]
          this.initBetterScroll()
        }.bind(this))

      })
      .catch(err => {
        console.log(err)
      })

    },
    // 获取运单详情
    _getWayBillDetails (dispathId, dispathDetailsId, executeTaskType, waybillId, orderCode) {
      this.$http(`${API.GET_WAY_BILL_DETAIL}/${waybillId}`)
      .then(res => {
        this.__isSuccess(res, function (result) {
          // 运单详情信息
          let info = result.result
          console.log(info)
          // 目的地所在地区枚举
          let targetIdList = []
          let targetIdListStatic = [
            {id: info.destProvId || '', name: info.destProvName || ''},
            {id: info.destCityId || '', name: info.destCityName || ''},
            {id: info.destDistrictId || '', name: info.destDistrictName || ''}
          ]
          // 如果有区级单位，并且最后一一级单位不等于区级单位
          if (info.destDistrictId && info.destDistrictId !== info.destId || info.destDistrictName !== info.destName) {
            targetIdList = targetIdListStatic.concat([{id: info.destId ? Number.parseFloat(info.destId) : '', name: info.destName || ''}])
          } else {
            targetIdList = targetIdListStatic
          }
          // 目的地所在地区数据转换
          targetIdList = targetIdList.filter(item => {
            if (item.id) {
              return item
            }
          })

          // 发货人所在地区枚举
          let sendIdList = [
            {id: info.invoiceProvId || '', name: info.invoiceProvName || ''},
            {id: info.invoiceCityId || '', name: info.invoiceCityName || ''},
            {id: info.invoiceDistrictId || '', name: info.invoiceDistrictName || ''},
            {id: info.invoiceStreetId || '', name: info.invoiceStreetName || ''},
          ]
          // 发货人信息
          let sendInfo = {
            placeholder: '请选择或输入发货人信息',
            isMonthly: 1, // 是否支持月结
            companyName: info.invoiceCompany || '', // 发货人公司名称
            invoiceCompanyId: '', // 发货人客商ID
            name: info.invoiceUser || '', // 发货人姓名
            phone: info.invoiceMobleNo || '', // 发货人电话号码
            isActive: info.invoiceMobleNo ? true : false, // 是否显示在开单主页面中
            region: info.invoiceProvName + info.invoiceCityName + info.invoiceDistrictName + info.invoiceStreetName, // 发货人所在地区
            region_2: info.invoiceAddress || '', // 发货人详细地址
            address: info.invoiceFullAddress || '', // 发货人完整地址
            idList: sendIdList.filter((item) => {
              if (item.id) {
                return item
              }
            })
          }

          // 收货人所在地区枚举
          let getIdList = [
            {id: info.receiptProvId || '', name: info.receiptProvName || ''},
            {id: info.receiptCityId || '', name: info.receiptCityName || ''},
            {id: info.receiptDistrictId || '', name: info.receiptDistrictName || ''},
            {id: info.receiptStreetId || '', name: info.receiptStreetName || ''}
          ]
          // 收货人信息
          let getInfo = {
            placeholder: '请选择或输入发货人信息',
            companyName: info.receiptCompany || '', // 发货人公司名称
            name: info.receiptUser || '', // 发货人姓名
            phone: info.receiptConsignorMobleNo || '', // 发货人电话号码
            isActive: info.receiptConsignorMobleNo && info.receiptUser && info.receiptAddress ? true : false, // 是否显示在开单主页面中
            region: info.receiptProvName + info.receiptCityName + info.receiptDistrictName + info.receiptStreetName, // 发货人所在地区
            region_2: info.receiptAddress || '', // 发货人详细地址
            address: info.receiptFullAddress || '', // 发货人完整地址
            idList: getIdList.filter((item) => {
              if (item.id) {
                return item
              }
            })
          }
          // 附加费用列表
          let additional = ['', '', '', '', '', '', '', '', '', '', '', '']
          // 基本费用
          let baseCost = ''
          if (info.appWaybillFeeRespDtos) {
            info.appWaybillFeeRespDtos.forEach((item, index) => {
              if (item.attrId === 52) { // 提货费
                additional[0] = item.fee || ''
              } else if (item.attrId === 57) { // 代收货款
                additional[2] = item.fee || ''
              } else if (item.attrId === 68) { // 声明价值
                additional[4] = item.fee || ''
              } else if (item.attrId === 51) { // 基本运费
                baseCost = item.fee || ''
              }
            })
          }
          // 商品列表
          let goodsList = []
          if (info.appWaybillGoodsRespDtos) {
            info.appWaybillGoodsRespDtos.forEach((item, index) => {
              goodsList.push({
                goodName: item.goodsName || '', // 货物名称
                goodType: { // 货物类型
                  id: item.goodsType || '',
                  name: item.goodsTypeName || ''
                },
                packingObj: { // 货物包装
                  itemCode: item.packingType,
                  itemName: item.packingName
                },
                number: item.packageNum, // 件数
                volume: item.volume, // 体积
                weight: item.weight // 重量
              })
            })
          }
          // 传递到开单参数
          const params = {
            fromTask: true, // 来源提货任务
            wayBill: info.code || '', // 运单号
            orderCode: orderCode || '', // 订单号
            waybillId: waybillId, // 运单id
            waybillType: info.waybillType || '', // 订单来源类型
            waybillTypeName: info.waybillTypeName || '', // 订单来源名称
            targetAddressList: targetIdList.length > 0 ? targetIdList : [{id: null, name: '请选择'},{id: null, name: '请选择'}], // 目的地地址列表
            selectedDot: { // 目的网点
              networkCode: info.destOrgId || '',
              networkName: info.destOrgName || ''
            },
            sendInfo, // 发货人信息
            getInfo, // 收货人信息
            backCode: info.backCode, // 回单编号
            backNumber: info.backNum, // 回单数量
            backName: info.backType, // 回单类型 itemName
            distributionType: info.distributionType === 2 ? 0 : 1, // 配送方式，派送方式
            iwaitNotice: info.iwaitNotice, // 是否等通知
            shippingType: info.shippingType, // 运输方式，派送方式 itemCode
            payWay: info.payWay, // 付款方式 itemCode
            checkList : info.iemergency ? [ // 其他要求列表 是否加急 (列表)
              {name: '开票', id: 0, isShow: false},
              {name: '整车', id: 1, isShow: false},
              {name: '加急', id: 2, isShow: true},
              {name: '入仓', id: 3, isShow: false},
              {name: '卸货', id: 4, isShow: false},
              {name: '上楼', id: 5, isShow: false},
              {name: '报关', id: 6, isShow: false}
            ] : [
              {name: '开票', id: 0, isShow: false},
              {name: '整车', id: 1, isShow: false},
              {name: '加急', id: 2, isShow: false},
              {name: '入仓', id: 3, isShow: false},
              {name: '卸货', id: 4, isShow: false},
              {name: '上楼', id: 5, isShow: false},
              {name: '报关', id: 6, isShow: false}
            ],
            checked: info.iemergency ? [{ // 是否加急 (选中加急结果)
              id: 2,
              isShow: true,
              name: '加急'
            }] : [],
            additional: additional, // 附加费用列表
            baseCost: baseCost, // 基本运费
            goodsList: goodsList, // 商品列表
            remark: info.remark || '', // 备注
            dispathId: dispathId,  // 派车单id
            dispathDetailsId: dispathDetailsId, // 派车单详情id
            executeTaskType: Number.parseInt(executeTaskType) === 1 ? 2 : 1 // 操作类型(执行任务类型) 转换后 1 提货入库 2 补录运单
          }
          // 跳转开单 => 补录运单
          this.$router.push({
            name: 'openBill',
            params
          })
        }.bind(this))
      })
      .catch(err => {
        console.log(err)
      })
    },
    // 接单接口
    _receiptBill (id) {
      this.$http(API.RECEIPT_BILL, {
        type: 'POST',
        params: {
          idList: [id]
        }
      })
      .then(res => {
        this.__isSuccess(res, function (result) {
          if (result.result) { // 接单成功
            // 跳转待提货列表
            this.$router.push('/extractTask/extract')
          } else { // 接单失败
            this.$toast.show('订单已取消')
            setTimeout(function () {
              // 跳转待接单列表
              this.$router.push('/extractTask/list')
            }.bind(this), 2000)
          }

        }.bind(this))
      })
      .catch(err => {
        console.log(err)
      })
    },
    // 初始化 better-scroll
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
    // 切换tab
    changeTab (value) {
      this.curTab = value
      // 点击时不触发 this.scroll.on('scroll'的判断tab功能
      this.isClickTabScroll = true
      let goodsBoxTop = this.goodsBoxTop
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
    },
    // 拨打电话
    callPhone (phoneNumber) {
      this.$webViewTools.handleNativeFun(handleNativeFunNames.PHONECALL, {"value": phoneNumber})
    },
    // 提交
    handleSubmit () {
      // 接单
      if (this.dataInfo.status === 6) {
        // 接单接口
        this._receiptBill(this.dataInfo.id)
      }

      // 补录运单
      if (this.dataInfo.status === 3) {
        // 先获取运单详情
        this._getWayBillDetails(this.dataInfo.dispatcherId, this.dataInfo.dispatcherDetailId, this.dataInfo.executeTaskType, this.dataInfo.waybillId, this.dataInfo.orderCode)
      }

    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>

<style lang="less">
.page-extract_details{
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
  }
}

</style>
