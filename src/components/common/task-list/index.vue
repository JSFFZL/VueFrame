<template>
<div class="fw-task_list">
  <div class="task-list">
    <div class="task-item" v-show="dataSource.length >= 1" v-for="(item, index) in dataSource" :key="index">
      <!-- top -->
      <div class="task-item_top">
        <div class="task-item_left">
          <span>订单:</span><span>{{item.orderCode}}</span><span></span>
        </div>
        <div class="task-item_right">{{item.status === 6 ? '未接单' : '未提货'}}</div>
      </div>
      <!-- center -->
      <div class="task-item_center" @click="handleEvent(1, item)">
        <!-- 地址 && 姓名 && 货物详情 -->
        <div class="task-item_left">
          <div class="task-item_left_icon">
            <span></span>
          </div>
          <div class="task-item_left_content">
            <p class="left-content_address">{{item.invoiceAddress}}</p>
            <p class="left-content_name"><span>{{item.invoiceUserName}}</span>(<span>{{item.invoiceUserMobile}}</span>)</p>
            <p class="left-content_info">{{item.goodsNames | filterGoodInfo(item.totalCount)}}</p>
          </div>
        </div>
        <!-- 价格 && 成本 -->
        <div class="task-item_right" v-show="item.apportionedCost">
          <div class="task-item_right_content">
            <div class="right-content_price">{{item.apportionedCost}}<span>元</span></div>
            <div class="right-content_unit">成本</div>
          </div>
        </div>
      </div>

      <!-- bottom -->
      <div class="task-item_bottom">
        <div class="item-bottom_time" v-show="item.appointDeliveryTime"><span>预约:</span><span>{{item.appointDeliveryTime | filterTime}}</span></div>
        <div class="item-bottom_time" v-show="!item.appointDeliveryTime">未预约时间，请及时提货</div>
        <!-- 电话 -->
        <div class="item-bottom_phoneicon">
          <p @click="handleEvent(2, item)"><span></span></p>
        </div>
        <div class="item-bottom_button" @click="handleEvent(3, item)">{{item.status === 6 ? '接单' : '补录运单'}}</div>
      </div>
    </div>
  </div>
  <div :style="{height: fullPage}" v-show="dataSource.length === 0">
    <no-find info="暂无数据"></no-find>
  </div>
</div>
</template>

<script>
/**
 * @class 提货任务列表组件
 * @param {Array} dataSource 数据源
 * @param {String} fullPage 是否满屏撑载nofind
*/

import * as API from '@/http/common/api'
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import mixinUtils from '@/mixins/common/public.js'
import NoFind from '@/components/public/fw-nofind'

export default {
  name: 'fwTaskList',
  mixins: [mixinUtils],
  props: {
    dataSource: [Array],
    fullPage: {
      type: String,
      default: '87vh'
    }
  },
  components: {
    NoFind
  },
  filters: {
    // 货物名称过滤
    filterGoodInfo: function (name, number) {
      let tranStringName = name.split('/').join('、')
      return `${number}件/${tranStringName}`
    },
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
            companyName: info.receiptCompany || '', // 收货人公司名称
            name: info.receiptUser || '', // 收货人姓名
            phone: info.receiptConsignorMobleNo || '', // 收货人电话号码
            isActive: info.receiptConsignorMobleNo && info.receiptUser && info.receiptAddress ? true : false, // 是否显示在开单主页面中
            region: info.receiptProvName + info.receiptCityName + info.receiptDistrictName + info.receiptStreetName, // 发货人所在地区
            region_2: info.receiptAddress || '', // 收货人详细地址
            address: info.receiptFullAddress || '', // 收货人完整地址
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
    handleEvent(from, item) {
      if (from === 1) { // 进入详情
        this.$router.push(`/extractDetails?id=${item.id}`)
      } else if (from === 2) { // 拨打电话
        this.$webViewTools.handleNativeFun(handleNativeFunNames.PHONECALL, {"value": item.invoiceUserMobile})
      } else if (from === 3) { // 触发按钮
        if (item.status === 6) { // 接单
          this._receiptBill(item.id)
        }
        if (item.status === 3) { // 补录运单
          // 先获取运单详情 (派车单id, 派车单详情id, 操作类型(执行任务类型), 运单id)
          this._getWayBillDetails(item.dispatcherId, item.dispatcherDetailId, item.executeTaskType, item.waybillId, item.orderCode)
        }
      }
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
