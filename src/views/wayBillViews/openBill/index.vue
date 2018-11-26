<template>
  <div class="page-open_bill" @click="occupy">
    <!-- 二级路由 start -->
    <transition name="lr">
      <router-view class="sub-view_content"></router-view>
    </transition>
    <!-- 二级路由 end -->

  <!-- 开单页主体内容 start -->
  <div class="page-open_bill_content">

    <!-- 运单号 start -->
    <fw-cell>
      <div class="page-wayBill_title">运单号</div>
      <div class="page-wayBill_number">
        <!-- 是自动编号，并且不支持手工录入显示 -->
        <input
          v-show="wayBillInfo.orderCodeType === 1 && !wayBillInfo.orderCodeEditable"
          type="text"
          disabled
          placeholder="自动生成"
        />
        <!-- 是自动编号,并且支持手工录入，或者单据领用的时候显示 -->
        <input
          v-show="wayBillInfo.orderCodeType === 1 && wayBillInfo.orderCodeEditable || wayBillInfo.orderCodeType === 2"
          type="text"
          v-model="wayBillnumber"
          placeholder="输入或扫描运单号"
          :maxlength="wayBillInfo.orderCodeType === 2 ? 20 : wayBillInfo.orderCodeLength"
        />
        <!-- 扫描icon start (非自动生成，可编辑时显示icon) -->
        <div v-show="wayBillInfo.orderCodeType === 1 && wayBillInfo.orderCodeEditable || wayBillInfo.orderCodeType === 2" class="page-wayBill_scan" @click="handleScan">
          <div class="page-wayBill_scan_icon"></div>
        </div>
        <!-- 扫描icon end -->
      </div>
    </fw-cell>
    <!-- 运单号 end -->

    <!-- 目的地 && 目的网点 start -->
    <div class="page-wayBill_target">
      <div class="page-wayBill_target_place">
        <div>目的地</div>
        <div @click="showLinkagePopup">
          <p
            :class="targetValue[targetValue.length - 1].name === '请选择' && targetValue.length <= 2 ? '': 'hasChoose'"
          >{{targetValue[targetValue.length - 1].name === '请选择' && targetValue.length >=2 ? targetValue[targetValue.length - 2].name : targetValue[targetValue.length - 1].name}}</p>
          <!-- {{targetValue.length}} -->
        </div>
        <div><span></span></div>
      </div>
      <div class="page-wayBill_target_dot" :class="selectedDot.networkName ? 'page-wayBill_target_dot_active' : ''">
        <div class="page-wayBill_target_dot_unit">目的网点</div>
        <div class="page-wayBill_target_dot_text" @click="jumpTatgetDot">
          <div>{{selectedDot.networkName ? selectedDot.networkName : '请选择'}}</div>
        </div>
        <div><span></span></div>
      </div>
    </div>
    <!-- 目的地 && 目的网点 end -->

    <!-- 发货 && 收货 start -->
    <div class="page-wayBill_receive_deliver">
      <div class="receive-deliver_item" v-for="(item, index) in receiveDeliverData" :key="index" @click="jumpReceiveDeliver(index)" v-if="index !== 2">
        <div class="receive-deliver_item_main_icon"></div>
        <!-- 默认展示 -->
        <div class="receive-deliver_item_default" v-show="!item.isActive">{{item.placeholder}}</div>
        <!-- 选中展示 -->
        <div class="receive-deliver_item_active" v-show="item.isActive">
          <div>
            <span>{{item.name}}</span>
            <span>{{item.phone}}</span>
          </div>
          <div>{{item.address}}</div>
        </div>
        <div class="receive-deliver_item_right_icon"></div>
      </div>
      <div class="receive-deliver_line"></div>
    </div>
     <!-- 发货 && 收货 end -->

     <!-- 更多要求 start -->
     <fw-cell-title title="发货要求" subTitle="更多" @handle="addMoreRequir"></fw-cell-title>
     <!-- 更多要求 end -->

     <!-- 配送方式 - 等通知 - 运输方式 start -->
     <div class="receive-deliver_public_cell" v-for="(item, index) in requirementData" :key="index">
       <!-- title -->
       <div>{{item.key}}</div>
       <!-- content -->
       <div @click="handleTransportPopup(item)">
         <!-- 配送方式 button -->
         <div v-if="!item.isIcon && index === 0">
           <fw-buttons :items="dataDictionaries.psfs" :checkedIndex.sync="item.value"></fw-buttons>
         </div>
         <!-- 等通知 switch -->
         <div v-if="!item.isIcon && index === 1">
           <inline-x-switch v-model="item.value"></inline-x-switch>
         </div>
         <!-- 运输方式 popup value -->
         <div v-if="item.isIcon && dataDictionaries.ysfs[1]">{{item.result.itemName}}</div>
       </div>
       <!-- right icon -->
       <div v-show="item.isIcon">
         <span></span>
       </div>
     </div>
     <!-- 配送方式 - 等通知 - 运输方式 end -->

     <!-- 货物信息模块 start -->
     <m-goods-info-module v-if="dataDictionaries.hwbz.length > 1"></m-goods-info-module>
     <!-- 货物信息 end -->

     <!-- 费用信息 start -->
     <fw-cell-title title="费用信息" subTitle="更多" @handle="jumpCostInfo"></fw-cell-title>
     <div class="cost-info_list">
       <div class="cost-info_public_cell" v-for="(item, index) in costInfoData" :key="item.id">
         <div class="public-cell_type" v-if="index === 0">
           <div>{{item.key}}</div>
           <div class="selected-val" v-if="dataDictionaries.fkfs[1]" @click="handleCostType">{{item.result.itemName}}</div>
           <div class="is-icon"></div>
         </div>
         <div></div>
        <!-- 送货费 && 基本运费 -->
        <div v-if="index === 1">
          <p>
            <span>送货费</span>
            <input
              type="number"
              placeholder="选填"
              :value="costInfo.delivery || costInfoData[1].children[0].value"
              @input="setCost($event, 0)"
              @click="__scrollIntoViewIfNeededInput($event)"
            /><span>元</span>
          </p>
          <p>
            <span>基本运费</span>
            <input
              type="number"
              placeholder="请填写"
              :value="costInfo.base === 0 ? '' : costInfo.base"
              @input="setCost($event, 1)"
              @click="__scrollIntoViewIfNeededInput($event)"
            />
            <span>元</span>
          </p>
        </div>
        <!-- 代收货款 -->
        <div v-if="index === 2">
          <div>{{item.key}}</div>
          <input
            type="number"
            :value="costInfo.additional[2] ? costInfo.additional[2] : item.value"
            :placeholder="item.placeholder"
            @input="changedCollection"
            @click="__scrollIntoViewIfNeededInput($event)"
          /><span>元</span>
        </div>

      </div>
     </div>
     <!-- 费用信息 end -->

     <!-- 备注 start -->
     <div class="remarks">
       <div>备注</div>
       <input
        type="text"
        v-model="remark"
        placeholder="最多输入50个汉字"
        maxlength="50"
        @click="__scrollIntoViewIfNeededInput($event)"
      />
     </div>
     <!-- 备注 end -->

  </div>
  <!-- 开单页主体内容 end -->

  <!-- 底部固定按钮 start -->
  <div class="page-open_bill_footer">
    <div class="footer-cost_info" @click="showCostPopup">
      <div>总费用:</div>
      <div>{{getTotalCost}}</div>
      <div>元</div>
      <div :class="isShowCostPopup ? 'transRoute' : ''"></div>
    </div>
    <div class="footer-submit" @click="submit">确认开单</div>
    <div class="footer-mask animated fadeIn faster" v-show="isShowCostPopup" @click="showCostPopup"></div>
    <div
      class="cost-popup"
      :style="{height: isShowCostPopup ? 12 * getTotalListData.length + 'vw' : '0px', maxheight: '48vw'}"
    >
      <div class="page-cost_info_list">
        <div class="page-cost_info_item" v-for="(item, index) in getTotalListData" :key="index">
          <div class="cost-key">{{item.key}}</div>
          <div class="cost-number">{{item.value}}</div>
          <div class="cost-unit">元</div>
        </div>
      </div>
    </div>
  </div>
  <!-- 底部固定按钮 end -->

    <!-- 省市区街道四级联动 start -->
    <Linkage
      :isShow.sync="isShowLinkagePopup"
      @result="getResult"
      title="目的地"
      :onlyCancel="false"
    ></Linkage>
    <!-- 省市区街道四级联动 end -->

    <!-- 运输方式 popup start -->
    <popup v-model="requirementData[2].isShowPopup" position="bottom" :hide-on-blur="false">
      <div class="transport-popup_content">
        <div class="transport-popup_title">选择运输方式</div>
        <div class="transport-popup_item" v-for="(item, index) in dataDictionaries.ysfs" :key="index" @click="selectedTransportItem(item, index)">{{item.itemName}}</div>
        <div class="transport-popup_item transport-popup_item_cancel" @click="selectedTransportItem('cancel')">取消</div>
      </div>
    </popup>
    <!-- 运输方式 popup end -->

    <!-- 付款方式 popup start -->
    <popup v-model="costInfoData[0].isShowPopup" position="bottom" :hide-on-blur="false">
      <div class="transport-popup_content">
        <div class="transport-popup_title">选择付款方式</div>
        <div
          class="transport-popup_item"
          v-for="(item, index) in dataDictionaries.fkfs"
          :key="index"
          @click="selectedCostType(item, index)"
          v-show="item.itemCode !== 5 && item.itemCode !== 6"
        >{{item.itemName}}</div>
        <div class="transport-popup_item transport-popup_item_cancel" @click="selectedCostType('cancel')">取消</div>
      </div>
    </popup>
    <!-- 付款方式 popup end -->

    <!-- 对话框 start -->
    <fw-dialog
      :isShow.sync="isShowDiaLog"
      @confirm="confirmDialog"
      :costType="costInfoData[0].result ? costInfoData[0].result.itemName : ''"
      :total="getTotalCost"
    ></fw-dialog>
    <!-- 对话框 end -->

    <!-- 付款方式 popup statr -->
    <pay-popup :isShow.sync="isShowPayPopup" @pay="getPayPopupResult"></pay-popup>
    <!-- 付款方式 popup statr -->
  </div>
</template>

<script>
/**
 * @class 开单页面
*/

import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
import {Popup, TransferDom, InlineXSwitch} from 'vux'
import * as API from '@/http/common/api'
import * as mutationTypes from '@/vuex/mutations/types'
import * as actionTypes from '@/vuex/actions/types'
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
import mixinUtils from '@/mixins/common/public.js'

// 货物详情模块
import MGoodsInfoModule from '@/modules/goodsInfo'
// cell 组件
import FwCell from '@/components/public/fw-cell'
// cellTitle 组件
import FwCellTitle from '@/components/public/fw-cell-title'
// 省市区街道四级联动
import Linkage from '@/components/common/linkage'
// button 组件
import FwButtons from '@/components/common/fw-buttons/fw-buttons'
// dialog 组件
import FwDialog from '@/components/public/fw-dialog'
// 付款方式弹层
import payPopup from '@/components/common/pay-popup'


export default {
  name: 'pageOpenBill',
  mixins: [mixinUtils],
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      // 来自 待提货列表页面 与 待提货详情页面
      if (vm.$route.params.fromTask) {
        let { // 提货任务携带订单数据
          waybillId, // 运单id
          waybillType, // 订单来源类型
          waybillTypeName, // 订单来源名称
          orderCode, // 订单号
          fromTask, // 来源 提货任务
          dispathId,  // 派车单id
          dispathDetailsId, // 派车单详情id
          executeTaskType, // 操作类型(执行任务类型) 转换后 1 提货入库 2 补录运单
          wayBill, // 运单号
          targetAddressList, // 目的地地址列表
          selectedDot, // 目的网点
          sendInfo, // 发货人信息
          getInfo, // 收货人信息
          checkList, // 其他要求列表 是否加急 (列表)
          checked, // 是否加急 (选中加急结果)
          distributionType, // 配送方式，派送方式
          iwaitNotice, // 是否等通知
          goodsList, // 商品列表
          payWay, // 付款方式 itemCode
          shippingType, // 运输方式，派送方式 itemCode
          additional, // 附加费用列表
          baseCost, // 基本运费
          backCode, // 回单编号
          backNumber, // 回单数量
          backName, // 回单类型 itemName
          remark // 备注
        } = vm.$route.params

        // 设置来源
        vm.fromTask = fromTask
        // 设置派车单id
        vm.dispathId = dispathId
        // 设置派车单详情id
        vm.dispathDetailsId = dispathDetailsId
        // 设置执行任务类型 1 提货入库 2 补录运单 (补录运单所需)
        vm.type = executeTaskType
        // 设置运单id
        vm.waybillId = waybillId
        // 设置订单id
        vm.orderCode = orderCode
        // 设置运单号
        vm.wayBillnumber = wayBill
        // 设置订单来源类型
        vm.waybillType = waybillType
        // 设置订单来源名称
        vm.waybillTypeName = waybillTypeName
        // 设置目的地地址列表
        vm.targetValue = targetAddressList
        vm._setTargetAddressList(targetAddressList)
        // 设置目的网点
        vm._setDot(selectedDot)
        // 设置发货人数据
        vm._setReceiveDeliverData({
          index: 0,
          data: sendInfo
        })
        // 设置收货人数据
        vm._setReceiveDeliverData({
          index: 1,
          data: getInfo
        })
        // 设置其他要求列表 是否加急 (列表)
        vm._setMoreRequire(Object.assign(vm.moreRequire, {
          checkList: checkList
        }))
        // 设置是否加急 (选中加急结果)
        vm._setMoreRequire(Object.assign(vm.moreRequire, {
          checked: checked
        }))
        // 设置配送方式
        vm.requirementData[0].value = distributionType
        // 设置是否等通知
        vm.requirementData[1].value = iwaitNotice
        // 设置货物信息
        vm._updateGoodsInfoItem(goodsList)
        // 设置基本运费
        vm._setBaseCost(baseCost)
        // 设置备注
        vm.remark = remark
      } else { // 来自 非待提货列表页面 与 非待提货详情页面
        // 来自运单管理页面
        if (from.path === '/orderlist') {
          // 刷新
          vm.$webViewTools.handleNativeFun(handleNativeFunNames.RELOAD)
        }
      }
      vm.initData()
    })
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      fromTask: false, // 是否来源提货任务(补录运单)
      waybillId: '', // 运单id 来源提货任务携带
      orderCode: '', // 订单号 来源提货任务携带
      waybillType: '', // 订单来源类型 来源提货任务携带
      waybillTypeName: '', // 订单来源名称 来源提货任务携带
      dispatcherId: '', // 派车单id (补录运单所需)
      dispatcherDetailId: '', // 派车单详情id (补录运单所需)
      type: '', // 执行任务类型 1 提货入库 2 补录运单 (补录运单所需)
      isShowLinkagePopup: false, // 是否显示省市区街道四级联动
      isShowCostPopup: false, // 是否显示费用详popup
      isShowDiaLog: false, // 显示隐藏dialog
      isShowPayPopup: false, // 付款方式 现金 || 微信
      wayBillnumber: '', // 非自动编号时输入的单号
      targetValue: [{id: null, name: '请选择'}], // 省市区街道选中结果
      requirementData: [ // 发货要求以下数据
        {key: '配送方式', value: 1, isIcon: false}, // 0: 自提 1：送货
        {key: '等通知', value: false, isIcon: false}, // 是否等通知
        {key: '运输方式', isIcon: true, isShowPopup: false, result: {}}
      ],
      costInfoData: [ // 费用信息数据
        {id: 11,key: '付款方式', isIcon: true, isShowPopup: false, result: {}},
        {id: 22,isIcon: false,children: [
            {id: 111,key: '送货费', value: '', placeholder: '选填'},
            {id: 222,key: '基本运费', value: '', placeholder: '请填写'}
          ]
        },
        {id: 33,key: '代收货款',value: null,placeholder: '选填',isIcon: false}
      ],
      remark: '' // 备注
    }
  },
  computed: {
    ...mapState('openBill', ['wayBillInfo', 'dataDictionaries', 'receiveDeliverData', 'selectedDot', 'costInfo', 'targetAddressList', 'totalList', 'moreRequire', 'goodsList']),
    ...mapGetters('openBill', ['getTotalCost', 'GoodListItemTotalSum', 'getTotalListData'])
  },
  components: {
    MGoodsInfoModule,
    Popup,
    InlineXSwitch,
    FwCell,
    Linkage,
    FwCellTitle,
    FwButtons,
    FwDialog,
    payPopup
  },
  mounted() {
    // 监听是否月结状态
    this.$root.Bus.$on(this.$root.busTypes._HANDLE_MONTHLY, function (isMonthly) {
      if (isMonthly === 0) { // 不支持月结
        // 重置付款方式为现付
        this.costInfoData[0].result = this.dataDictionaries.fkfs[0]
      }else {
        // 重置付款方式为月结
        this.costInfoData[0].result = this.dataDictionaries.fkfs[1]
      }
    }.bind(this))
  },
  methods: {
    ...mapMutations('openBill', {
      // 初始化设置数据字典
      _setDataDictionaries: mutationTypes.SET_DICTIONARIES_DATA,
      // 初始化设置运单信息 包含费率
      _setWayBillInfo: mutationTypes.SET_WAYBILL_INFO,
      // 选择目的地后设置第一个目的地网点
      _setDot: mutationTypes.SET_DOT,
      // 设置目的地选择的四级地址列表
      _setTargetAddressList: mutationTypes.SET_TARGET_ADDRESS_LIST,
      // 设置发货人或者收货人数据 0 发货人 1收货人
      _setReceiveDeliverData: mutationTypes.SET_RECEIVEDELIVER_INFO,
      // 设置其他要求列表 是否加急 (列表)
      _setMoreRequire: mutationTypes.SET_MORE_REQUIRE,
      // vuex 更新所有货物信息
      _updateGoodsInfoItem: mutationTypes.UPDATE_GOODS_LIST,
      // 同步附加费用信息
      _syncCostInfo: mutationTypes.SYNC_COST_INFO,
      // 设置基本运费
      _setBaseCost: mutationTypes.SET_BASE_COST,
      // 设置送货费
      _setDeliveryCost: mutationTypes.SET_DELIVERY_COST,
      // 设置代收货款选项及手续费
      _setCollectionOfGoods: mutationTypes.SET_COLLECTION_OF_GOODS
    }),
    ...mapActions('openBill', {
      // 初始化 action 获取 省级列表
      getProvinceAddressData: actionTypes.GET_PROVINCE_ADDRESS
    }),
    // ios 兼容 全局事件
    occupy() {},
    // 初始化数据
    initData() {
      // 初始化 action 获取 省级列表
      this.getProvinceAddressData()
      // 初始化获取运单号规则，费率, 数据字典
      this._initData()
    },
    // 初始化数据
    _initData() {
      const task = [
        this.$http(API.GET_WAY_BILL_RULE),
        this.$http(`${API.GET_DICCTIONARIES}?dicCode=tms-hdyq,tms-ysfs,tms-psfs,tms-bz,tms-fkfs`)
      ]
      Promise.all(task)
        .then(res => {
          // [编码规则(包含费率), 数据字典(回单要求 运输方式 配送方式 货物包装 付款方式)]
          const [codeInfo, dictionariesInfo] = res.map(item => {
            return item
          })

          // 设置编码规则,费率
          this.__isSuccess(codeInfo, function (result) {
            this._setWayBillInfo({...result.result})
            if (this.fromTask) { // 来源提货任务
              // 同步附加费用信息
              let additional = []
              if (this.$route.params.additional[2]) {
                let rate = this.$calc('*', this.wayBillInfo.coDeliveryFeeRate, 0.001)
                let baseRate = parseFloat(parseFloat(this.$calc('*', this.$route.params.additional[2], rate)).toFixed(2)) || ''
                this.$route.params.additional[3] = baseRate
                additional = this.$route.params.additional
              }
              this._syncCostInfo(additional)
            }
          }.bind(this))
          // 设置数据字典 (回单要求 运输方式 配送方式 货物包装 付款方式)
          this.__isSuccess(dictionariesInfo, function (result) {
            this._setDataDictionaries({
              hwbz: result.result['tms-bz'],
              hdyq: result.result['tms-hdyq'],
              ysfs: result.result['tms-ysfs'],
              psfs: result.result['tms-psfs'],
              fkfs: result.result['tms-fkfs']
            })
            // 来源提货任务
            if (this.fromTask) {
              // 初始化回单要求
              let returnRequireed = {itemName: '请选择回单类型'}
              // 如果存在回单要求
              if (this.$route.params.backName) {
                result.result['tms-hdyq'].forEach((item, index) => {
                  if (item.itemName === this.$route.params.backName) {
                    returnRequireed = item
                  }
                })
              }
              // 设置回单要求
              this._setMoreRequire(Object.assign({}, this.moreRequire, {
                isShowCodeAndNumber: this.$route.params.backName ? true : false,
                returnCodeed: this.$route.params.backCode || null,
                returnNumbered: this.$route.params.backNumber || null,
                returnRequireed
              }))
              // 重置特殊要求
              this._setMoreRequire(Object.assign({}, this.moreRequire, {
                singleActiveIndex: null
              }))
              // 重置送货费
              this._setDeliveryCost(0)

              // 初始化付款方式
              if (this.$route.params.payWay === 2 || this.$route.params.payWay === 6 || this.$route.params.payWay === 5 || !this.$route.params.payWay) { // 如果是月结 || 免费 || 多笔付 || 不选择
                this.costInfoData[0].result = result.result['tms-fkfs'][0]
              } else {
                result.result['tms-fkfs'].forEach((item, index) => {
                  if (item.itemCode === this.$route.params.payWay) {
                    this.costInfoData[0].result = result.result['tms-fkfs'][index]
                  }
                })
              }
              // 初始化运输方式 shippingType
              if (this.$route.params.shippingType) {
                result.result['tms-ysfs'].forEach((item, index) => {
                  if (item.itemCode === this.$route.params.shippingType) {
                    this.requirementData[2].result = result.result['tms-ysfs'][index]
                  }
                })
              }else {

                this.requirementData[2].result = result.result['tms-ysfs'][0]
              }
            } else { // 来源非提货任务
              // 初始化运输方式
              this.requirementData[2].result = result.result['tms-ysfs'][0]
              // 初始化付款方式
              this.costInfoData[0].result = result.result['tms-fkfs'][0]
            }
          }.bind(this))
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击扫码
    handleScan() {
      // 唤起native 扫描二维码
      this.$webViewTools.handleNativeFun(handleNativeFunNames.SCANORCODE, {"length": this.wayBillInfo.orderCodeLength || ''}).then(function (result) {
          let res = JSON.parse(result)
          if (res.value === 'error') {
            this.$toast.show('运单号错误')
          } else {
             this.wayBillnumber = res.value
          }
      }.bind(this))
    },
    // 四级联动回显结果
    getResult(result) {
      this.targetValue = []
      result.forEach((item, index) => {
        if (item.id) {
          this.targetValue.push(item)
        }
      })
      console.log('目的地回显结果:', this.targetValue)
      // 设置目的地选择四级地址列表
      this._setTargetAddressList(this.targetValue)

      // 集团ID
      let {groupId} = JSON.parse(this.$localStorage.get('userInfo'))
      const params = {
        groupId: groupId,
        provCode: this.targetValue[0] ? this.targetValue[0].id : '',
        cityCode: this.targetValue[1] ? this.targetValue[1].id : '',
        disCode: this.targetValue[2] ? this.targetValue[2].id : '',
        streetCode: this.targetValue[3] ? this.targetValue[3].id : ''
      }
      // 根据目的地ID 获取目的网点
      this.$http(API.GET_TARGET_DOT, {
        type: 'POST',
        params
      })
        .then(res => {
          this.__isSuccess(res, function (result) { // 成功
          if (result.result.length > 0) {
            if (result.result[0].isDefault === '1') {
              // 设置默认网点
              this._setDot(result.result[0])
            } else {
              this._setDot({})
            }
          }
          }.bind(this))
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击显示 四级联动 popup
    showLinkagePopup() {
      this.isShowLinkagePopup = true
    },
    // 显示隐藏费用信息popup
    showCostPopup() {
      if (this.getTotalListData.length === 0) return
      this.isShowCostPopup = !this.isShowCostPopup
    },
    // 跳转目的地网点页
    jumpTatgetDot() {
      // 未输入目的地，toast提示
      if (this.targetValue[0].name === '请选择') {
        this.$toast.show('请输入目的地')
        return
      }
      // 跳转目的地网点页
      this.$router.push({name: 'targetdot', params: {targetData: this.targetValue}})
    },
    // 跳转发货人&&收货人
    jumpReceiveDeliver(index) {
      if (index === 0) { // 发货人
        this.$router.push('/openbill/deliver')
        return
      }
      // 收货人
      this.$router.push('/openbill/receive')
    },
    // 跳转更多要求页
    addMoreRequir() {
      this.$router.push('/openbill/morelimit')
    },
    // 运输方式 popup
    handleTransportPopup(item) {
      if (!item.isIcon) return
      this.requirementData[2].isShowPopup = true
    },
    // 选择运输方式item
    selectedTransportItem(item, index) {
      if (item === 'cancel') {
        // 点击取消
        this.requirementData[2].isShowPopup = false
        return
      }
      this.requirementData[2].index = index
      this.requirementData[2].result = item
      this.requirementData[2].isShowPopup = false
      console.log(item)
    },
    // 付款方式 popup
    handleCostType() {
      this.costInfoData[0].isShowPopup = true
    },
    // 选择付款方式
    selectedCostType(item, index) {
      if (item === 'cancel') {
        // 点击取消
        this.costInfoData[0].isShowPopup = false
        return
      }

      // 是否支持月结 0 否 1 是
      if (this.receiveDeliverData[0].isMonthly === 0 && item.itemCode === 2) {
        this.$toast.show('该客户不是月结客户,不能选择月结')
        return
      }
      // 拥有垫付运费，只可选择到付
      if (this.costInfo.additional[8] && item.itemCode !== 4) {
        this.$toast.show('有垫付运费只能到付')
        return
      }

      this.costInfoData[0].index = index
      this.costInfoData[0].result = item
      this.costInfoData[0].isShowPopup = false
    },
    // 跳转费用信息页
    jumpCostInfo() {
      this.$router.push('/openbill/costinfo')
    },
    // 校验 && 设置 送货费 基本运费
    setCost(el, index) {
      // 只允许输入包含.的二位小数数字
      let reg = /([0-9]+\.[0-9]{2})[0-9]*/
      el.target.value = el.target.value.replace(reg, '$1')
      // 最大 999999
      el.target.value = Number.parseFloat(el.target.value) > 999999 ? 999999 : el.target.value
      if (index === 0) { // 送货费
        this._setDeliveryCost(el.target.value || 0)
        this.costInfoData[1].children[0].value = el.target.value
      }else { // 基本运费
        this._setBaseCost(el.target.value || 0)
      }
    },
    // 代收货款校验
    changedCollection(el) {
      // 只允许输入包含.的二位小数数字
      let reg = /([0-9]+\.[0-9]{2})[0-9]*/
      el.target.value = el.target.value.replace(reg, '$1')

      if (this.costInfo.additional.length > 0) {
        let rate = this.$calc('*', this.wayBillInfo.coDeliveryFeeRate, 0.001)
        let baseRate = parseFloat(parseFloat(this.$calc('*', el.target.value, rate)).toFixed(2)) || ''
        // 设置 vuex 代收货款及代收货款费率
        this._setCollectionOfGoods({
          base: el.target.value,
          baseRate: baseRate
        })
      } else {
        this.costInfoData[2].value = el.target.value
      }
    },
    // 获取付款方式结果 (现付 || 微信)
    getPayPopupResult(result) {
      console.log('被扫', result)
      let waybillId = this.waybillId + ''
      // 取消 || 现金
      if (result.index === 0 || result.index === 1) {
        this.isShowPayPopup = false
        this.$webViewTools.handleNativeFun(handleNativeFunNames.RELOAD)
        return
      }

      // 唤起被扫 receiptPhase 1 开单 2 签收。 wayBillId 运单id
      this.$webViewTools.handleNativeFun(handleNativeFunNames.WECHATPAY, {'receiptPhase': '1', 'wayBillId': waybillId})
      // 刷新
      this.$webViewTools.handleNativeFun(handleNativeFunNames.RELOAD)
    },
    // 点击开单按钮
    submit() {
      // 配送方式结果: this.dataDictionaries.psfs[this.requirementData[0].value]
      // 等通知结果: this.requirementData[1].value
      // 运输方式: this.requirementData[2].result
      // 代收货款: this.costInfo.additional[2] || this.costInfoData[2].value = el.target.value (vuex || data)
      // 付款方式 this.costInfoData[0].result
      // console.log(this.costInfoData[0].result)

      // 是自动编号,并且支持手工录入，或者单据领用时校验运单号
      if (this.wayBillInfo.orderCodeType === 2 && !this.wayBillnumber) {
        this.$toast.show('请填写运单号')
        return
      } else if (this.targetAddressList.length === 0 || this.targetAddressList[this.targetAddressList.length -1].name === '请选择') { // 校验目的地
        this.$toast.show('请选择目的地')
        return
      } else if (!this.selectedDot.networkCode) { // 校验目的网点
        this.$toast.show('请选择目的网点')
        return
      } else if (!this.receiveDeliverData[0].phone) { // 校验发货人
        this.$toast.show('请填写发货人信息')
        return
      } else if (!this.receiveDeliverData[1].phone) { // 校验收货人
        this.$toast.show('请填写收货人信息')
        return
      }else if (this.goodsList.length === 0) { // 校验货物信息
        this.$toast.show('请输入货物信息')
        return
      }

      // dialog 显示
      this.isShowDiaLog = true
    },
    // 调取 native 打印信息
    _printTag(wayBillId) {
      // 唤起native打印面单和标签
      this.$webViewTools.handleNativeFun(handleNativeFunNames.PRINT_TAG_ORDER, {"value": wayBillId})
    },
    // 校验单号是否重复
    wayBillReplace() {
      this.$http(`${API.WAY_BILL_PEPEAT}?waybillCode=${this.wayBillnumber}`)
        .then(res => {
          this.__isSuccess(res, function (result) {
            // 单号重复
            if (!result.result) {
              this.$toast.show('运单号已存在，请重新输入')
              return
            }
            // 获取运输线路 -> 成功后获取开单接口
            this.getTransportLine()
          }.bind(this))
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取运输线路
    getTransportLine() {
      // 用户信息
      const userInfo = JSON.parse(this.$localStorage.get('userInfo'))
      let startOrgId = userInfo.orgId || ''
      let arriveOrgId = this.selectedDot.networkCode || ''

      this.$http(`${API.GET_TRANSPORT_LINE}/${startOrgId}/${arriveOrgId}`)
        .then(res => {
          this.__isSuccess(res, function (result) {
            // 开单接口
            this.openBillInterface(result.result)
          }.bind(this))
        })
        .catch(err => {
          console.log(err)
        })
    },
    // dialog 确认
    confirmDialog() {
      // 是自动编号,并且支持手工录入，或者单据领用时校验运单号是否重复
      if (this.wayBillInfo.orderCodeType === 2) {
        this.wayBillReplace()
        return
      } else if (!this.wayBillInfo.orderCodeType) {
        this.$toast.show('运单规则错误')
        return
      }

      // 获取运输线路 -> 成功后获取开单接口
      this.getTransportLine()
    },
    // 新开单接口 && 补录运单接口 lineList: 线路列表[]
    openBillInterface(lineList) {
      // 用户信息
      const userInfo = JSON.parse(this.$localStorage.get('userInfo'))
      // 货物列表详情
      let waybillGoodsEsDtos = []
      this.goodsList.forEach((item, index) => {
        waybillGoodsEsDtos.push({
          companyId: this.wayBillInfo.companyId || '', // 公司ID
          companyName: this.wayBillInfo.companyName || '', // 公司名称
          createTime: +new Date(), // 创建时间
          createUser: userInfo.createUser || '', // 创建人 => 取登录人ID
          createUserName: userInfo.userName || '', // 创建人姓名 => 取登录人姓名
          freight: Number.parseFloat(this.totalList[index].amountWithTax), // 当前货物运费
          unitPrice: Number.parseFloat(this.totalList[index].price), // 当前货物单价
          goodsName: item.goodName || '', // 货物名称
          goodsType: item.goodType.id || '', // 货物类型ID
          goodsTypeName: item.goodType.name || '', // 货物类型名称
          packingName: item.packingObj.itemName || '', // 包装名称
          packingType: item.packingObj.itemCode || '', // 包装类型
          packageNum: item.number || '', // 包装件数
          waybillId: '', // 运单ID 保留字段
          weight: Number.parseFloat(item.weight) || 0, // 总重量
          volume: Number.parseFloat(item.volume) || 0, // 总体积
        })
      })
      console.log('货物列表', waybillGoodsEsDtos)

      // 费用枚举
      let task = []
      let waybillFeeEsDtos = []
      const costEnumeration = [
        {id: 52, name: '提货费'},
        {id: 55, name: '包装费'},
        {id: 57, name: '代收货款'},
        {id: 58, name: '代收货款手续费'},
        {id: 68, name: '声明价值'},
        {id: 59, name: '保价费'},
        {id: 60, name: '加急费'},
        {id: 56, name: '信息费'},
        {id: 66, name: '垫付运费'},
        {id: 70, name: '其他费用'},
        {id: 69, name: '业务费'},
        {id: 61, name: '税费'},
        {id: 53, name: '送货费'},
        {id: 51, name: '基本运费'}
      ]
      task = this.$deepCopy(this.costInfo.additional)
      task.push(this.costInfo.delivery)
      task.push(this.costInfo.base)
      task.forEach((item, index) => {
        if (item) {
          waybillFeeEsDtos.push({
            attrId: costEnumeration[index].id, // 属性ID
            attrName: costEnumeration[index].name, // 属性name
            companyId: userInfo.groupId || '', // 公司ID
            companyName: userInfo.groupName || '', // 公司名称
            createTime: +new Date(), // 创建时间
            createUser: userInfo.createUser || '', // 创建人 => 取登录人ID
            createUserName: userInfo.userName || '', // 创建人姓名 => 取登录人姓名
            fee: Number.parseFloat(item) // 费用
          })
        }
      })
      console.log('费用列表', waybillFeeEsDtos)

      // 开单接口基本请求参数
      const params = {
          groupId: userInfo.groupId || '', // 集团ID
          userName: userInfo.realName || '', // 录单员姓名 => 取登录人姓名
          id: this.fromTask ? this.waybillId || '' : '', // 运单ID 暂无 保留字段
          waybillType: 1, // 运单来源 开单默认1
          waybillTypeName: '手动创建', // 开单默认 => 手动创建
          code: this.wayBillnumber || null, // 运单号
          backCode: this.moreRequire.returnCodeed || '', // 回单编号 暂取回单编号字段
          backType: this.moreRequire.returnRequireed.itemCode ? this.moreRequire.returnRequireed.itemName : '', // 回单要求名称
          backTypeValue: this.moreRequire.returnRequireed.itemCode ? 1 : 0, // 回单要求
          backNum: this.moreRequire.returnRequireed.itemCode ? Number.parseFloat(this.moreRequire.returnNumbered) : '', // 回单份数
          codeType: this.wayBillInfo.orderCodeType === 1 ? 2 : 1, // 单据类型 反转赋值
          companyId: userInfo.carrierGlobalId || '', // 公司ID
          companyName: userInfo.carrierGlobalName || '', // 公司名称
          carrierGlobalId: userInfo.carrierGlobalId || '', // 公司ID
          carrierGlobalName: userInfo.carrierGlobalName || '', // 公司名称
          createUser: userInfo.createUser || '', // 创建人 => 取登录人ID
          createUserId: userInfo.createUser || '', // 录单员ID => 取登录人ID
          createUserName: userInfo.realName || '', // 创建人姓名 => 取登录人姓名
          destProvId: this.targetAddressList[0].id || '', // 目的地省ID
          destProvName: this.targetAddressList[0].name || '', // 目的地省名称
          destCityId: this.targetAddressList[1] ? this.targetAddressList[1].id : '', // 目的市ID
          destCityName: this.targetAddressList[1] ? this.targetAddressList[1].name : '', // 目的市名称
          destDistrictId: this.targetAddressList[2] ? this.targetAddressList[2].id : '', // 目的地区县ID
          destDistrictName: this.targetAddressList[2] ? this.targetAddressList[2].name : '', // 目的地区县名称
          destId: this.targetAddressList[this.targetAddressList.length - 1].id || '', // 目的地最后一级ID
          destName: this.targetAddressList[this.targetAddressList.length - 1].name || '', // 目的地最后一级名称
          destLevel: this.targetAddressList.length, // 目的地选择或者获取详情层级数
          destOrgId: this.selectedDot.networkCode || '', // 目的网点ID
          destOrgName: this.selectedDot.networkName || '',  // 目的网点名称
          goodsPaymentDeduction: this.costInfo.additional[2] || '', // 货款扣(运费) => 取代收贷款
          invoiceAddress: this.receiveDeliverData[0].region_2 || '', // 发货人详细地址
          invoiceCompany: this.receiveDeliverData[0].companyName ? this.receiveDeliverData[0].companyName : this.receiveDeliverData[0].name + '/' + this.receiveDeliverData[0].phone, // 发货单位 => 取发货人公司名称，拥有则取，否则 发货人名称/电话号
          invoiceProvId: this.receiveDeliverData[0].idList[0] ? this.receiveDeliverData[0].idList[0].id : '', // 发货人省ID
          invoiceProvName: this.receiveDeliverData[0].idList[0] ? this.receiveDeliverData[0].idList[0].name : '', // 发货人省名称
          invoiceCityId: this.receiveDeliverData[0].idList[1] ? this.receiveDeliverData[0].idList[1].id : '', // 发货人市ID
          invoiceCityName: this.receiveDeliverData[0].idList[1] ? this.receiveDeliverData[0].idList[1].name : '', // 发货人市名称
          invoiceDistrictId: this.receiveDeliverData[0].idList[2] ? this.receiveDeliverData[0].idList[2].id : '', // 发货人区县ID
          invoiceDistrictName: this.receiveDeliverData[0].idList[2] ? this.receiveDeliverData[0].idList[2].name : '', // 发货人区县名称
          invoiceStreetId: this.receiveDeliverData[0].idList[3] ? this.receiveDeliverData[0].idList[3].id : '', // 发货人街道ID
          invoiceStreetName: this.receiveDeliverData[0].idList[3] ? this.receiveDeliverData[0].idList[3].name : '', // 发货人街道名称
          invoiceUser: this.receiveDeliverData[0].name, // 发货人名称
          invoiceUserId: this.receiveDeliverData[0].invoiceCompanyId || '', // 发货人ID 保留
          invoiceMobleNo: this.receiveDeliverData[0].phone || '', // 发货人手机号
          invoiceTelNo: '', // 发货人电话 暂无 保留字段
          invoiceOrgId: userInfo.orgId || '', // 发货网点ID
          invoiceOrgName: userInfo.orgName, // 发货网点名称
          receiptAddress: this.receiveDeliverData[1].region_2 || '',// 收货人详细地址
          receiptCompany: this.receiveDeliverData[1].companyName ? this.receiveDeliverData[1].companyName : this.receiveDeliverData[1].name + '/' + this.receiveDeliverData[1].phone, // 收货单位 => 取收货人公司名称，拥有则取，否则 收货人名称/电话号
          receiptProvId: this.receiveDeliverData[1].idList[0] ? this.receiveDeliverData[1].idList[0].id : '', // 收货人省ID
          receiptProvName: this.receiveDeliverData[1].idList[0] ? this.receiveDeliverData[1].idList[0].name : '', // 收货人省名称
          receiptCityId: this.receiveDeliverData[1].idList[1] ? this.receiveDeliverData[1].idList[1].id : '', // 收货人市ID
          receiptCityName: this.receiveDeliverData[1].idList[1] ? this.receiveDeliverData[1].idList[1].name : '', // 收货人市名称
          receiptDistrictId: this.receiveDeliverData[1].idList[2] ? this.receiveDeliverData[1].idList[2].id : '', // 收货人区县ID
          receiptDistrictName: this.receiveDeliverData[1].idList[2] ? this.receiveDeliverData[1].idList[2].name : '', // 收货人区县名称
          receiptStreetId: this.receiveDeliverData[1].idList[3] ? this.receiveDeliverData[1].idList[3].id : '', // 收货人街道ID
          receiptStreetName: this.receiveDeliverData[1].idList[3] ? this.receiveDeliverData[1].idList[3].name : '', // 收货人街道名称
          receiptConsignorMobleNo: this.receiveDeliverData[1].phone || '', // 收货人手机号
          receiptUser: this.receiveDeliverData[1].name, // 收货人名称
          receiptCustomerId: '', // 收货人ID 保留
          payWay: this.costInfoData[0].result.itemCode || '', // 付款方式code
          payWayName: this.costInfoData[0].result.itemName || '', // 付款方式名称
          pcOrApp: 2, // app或是pc端手动开单 1:pc 2:app
          pcOrAppName: 'app开单', // app或是pc端手动开单名称 pc开单 || app开单
          shippingType: this.requirementData[2].result.itemCode || '', // 运输方式type
          shippingTypeName: this.requirementData[2].result.itemName || '', // 运输方式名称
          specialRequire: this.moreRequire.singleed.name || '', // 特殊要求
          totalFee: this.getTotalCost, // 总运费
          remark: this.remark || '', // 备注
          lineId: lineList[0] ? lineList[0].id : '', // 运输线路ID
          timeEfficiency: lineList[0] ? Number.parseFloat(lineList[0].timeEfficiency) : '', // 运输时效
          lineName:  lineList[0] ? lineList[0].lineName : '',// 运输线路名称
          distributionType: this.dataDictionaries.psfs[this.requirementData[0].value].itemCode || '', // 配送方式
          distributionTypeName: this.dataDictionaries.psfs[this.requirementData[0].value].itemName || '', // 配送方式名称
          iwaitNotice: this.requirementData[1].value, // 是否等通知
          ibill: this.moreRequire.checkList[0].isShow || '', // 是否开发票
          itruckLoad: this.moreRequire.checkList[1].isShow || '', // 是否整车
          iemergency: this.moreRequire.checkList[2].isShow || '', // 是否加急
          intoWarehouse: this.moreRequire.checkList[3].isShow || '', // 是否入仓
          unLoaded: this.moreRequire.checkList[4].isShow || '', // 是否卸货
          upStairs: this.moreRequire.checkList[5].isShow || '', // 是否上楼
          noticeChianCustoms: this.moreRequire.checkList[6].isShow || '', // 是否报关
          cashPay: this.costInfoData[0].result.itemCode === 1 ? this.getTotalCost : '', // 选择现付对应的总运费
          cod: this.costInfoData[0].result.itemCode === 4 ? this.getTotalCost : '', // 选择到付对应的总运费
          forfree: this.costInfoData[0].result.itemCode === 6 ? this.getTotalCost : '', // 选择免费对应的总运费
          tardypay: this.costInfoData[0].result.itemCode === 8 ? this.getTotalCost : '', // 选择欠付对应的总运费
          receiptPay: this.costInfoData[0].result.itemCode === 3 ? this.getTotalCost : '', // 选择回单付对应的总运费
          monthlyPay: this.costInfoData[0].result.itemCode === 2 ? this.getTotalCost : '', // 选择月结对应的总运费
          waybillGoodsEsDtos, // 货物列表详情
          waybillFeeEsDtos, // 费用信息
      }


      if (this.fromTask) { // 来自提货任务 补录运单
        // 补录运单
        this.$http(API.OPEN_WAY_BILL_SUPPLEMENT, {
          type: 'POST',
          params: {
            createReqDTO: Object.assign(params, {
              orderCode: this.orderCode, // 订单号
              waybillType: this.waybillType, // 订单来源 来自提货任务传递过来
              waybillTypeName: this.waybillTypeName // 订单来源名称 来自提货任务传递过来
            }),
            dispatcherId: this.fromTask ? this.dispathId || '' : '', // 派车单id 来自提货任务
            dispatcherDetailId: this.fromTask ? this.dispathDetailsId || '' : '', // 派车单详情id 来自提货任务
            type: this.fromTask ? this.type || '' : '' // 执行任务 来自提货任务
          }
        })
          .then(res => {
            this.__isSuccess(res, function (result) {
              this.$toast.show('开单成功')
              // 调取打印功能
              this._printTag(result.result)

              // 付款方式为现付
              if (this.costInfoData[0].result.itemCode === 1) {
                // 唤起支付弹层
                this.isShowPayPopup = true
              // 非现付
              } else {
                // 刷新
                setTimeout(function () {
                  this.$webViewTools.handleNativeFun(handleNativeFunNames.RELOAD)
                }.bind(this), 2000)
              }

            }.bind(this))
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        // 进行开新单
        this.$http(API.OPEN_WAY_BILL,{
          type: 'POST',
          params
        })
          .then(res => {
            this.__isSuccess(res, function (result) {
              this.$toast.show('开单成功')
              // 调取打印功能
              this._printTag(result.result)
              // 设置运单id(被扫所需)
              this.waybillId = result.result
              // 付款方式为现付
              if (this.costInfoData[0].result.itemCode === 1) {
                // 唤起支付弹层
                this.isShowPayPopup = true
              // 非现付
              } else {
                // 刷新
                setTimeout(function () {
                  this.$webViewTools.handleNativeFun(handleNativeFunNames.RELOAD)
                }.bind(this), 2000)
              }
            }.bind(this))
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  watch: {
    costInfo: {
      handler: function (newValue) {
        if (newValue.additional[8]) {
          this.costInfoData[0].result = this.dataDictionaries.fkfs[3]
        } else {
          this.costInfoData[0].result = this.dataDictionaries.fkfs[0]
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" src="./index.less"></style>
