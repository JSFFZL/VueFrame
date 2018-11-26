<template>
<div class="m-goods_info">
  <fw-cell-title title="货物信息" subTitle="添加" @handle="showPopup(-1)"></fw-cell-title>
  <div class="receive-deliver_public_cell" @click="jumpGoodsInfo">
    <div>货物信息</div>
    <div class="public-cell_default">
      <div class="space" v-html="goodsList.length > 0 ? getGoodListAggregate : '必填'"></div>
    </div>
    <div>
      <span></span>
    </div>
  </div>

  <!-- 第一层 主要 popup start -->
  <div v-transfer-dom>
    <popup v-model="isShowQuickPopupMain" position="bottom" :hide-on-blur="false">
      <div class="quick-popup_public quick-popup_main" :popup-style="{zIndex: 502}">
        <div class="quick-popup_header">
          <div class="quick-popup_header_left" @click="hidePopup(-1)">取消</div>
          <div class="quick-popup_header_center">添加货物</div>
          <div
            class="quick-popup_header_right_default"
            :class="quickResultList[0].value && quickResultList[1].value && quickResultList[2].value ? 'quick-popup_header_right_sure' : ''"
            @click="confirmMainPopup"
          >确定</div>
        </div>

        <div class="quick-popup_list">
          <div class="quick-popup_item" v-for="(item, index) in quickResultList" :key="index" @click="showPopup(index)">
            <div class="quick-popup_item_name">{{item.key}}</div>
            <div class="quick-popup_item_result" :class="item.value ? 'quick-popup_item_result_active' : ''">{{item.value ? item.value : item.placeholder}}</div>
            <div class="quick-popup_item_icon"></div>
          </div>
        </div>
      </div>
    </popup>
  </div>
  <!-- 第一层 主要 popup end -->

  <!-- 第二层 名称 popup start -->
  <m-good-name-popup :isShow.sync="isShowQuickPopupName" :clear.sync="clearName" @result="confirmGoodNamePopup"></m-good-name-popup>
  <!-- 第二层 名称 popup end -->


  <!-- 第二层 包装 popup start -->
  <m-packing-popup :isShow.sync="isShowQuickPopupPacking" :clear.sync="clearPacking" @result="getPackingSelectedData"></m-packing-popup>
  <!-- 第二层 包装 popup end -->

  <!-- 第二层 基本信息 popup start -->
  <div v-transfer-dom>
    <popup v-model="isShowQuickPopupBaseInfo" position="bottom" :hide-on-blur="false">
      <div class="quick-popup_public quick-popup_base_info" :popup-style="{zIndex: 502}">
        <div class="quick-popup_header">
          <div class="quick-popup_header_left" @click="hidePopup(2)">取消</div>
          <div class="quick-popup_header_center">基本信息</div>
          <div
            class="quick-popup_header_right_default"
            :class="baseInfo.number? 'quick-popup_header_right_sure' : ''"
            @click="confirmBaseInfoPopup"
          >确定</div>
        </div>
        <div class="quick-popup_list">
          <!-- 件数 -->
          <div class="quick-popup_item number">
            <div class="quick-popup_item_name">件数</div>
            <div>
              <fw-number :number.sync="baseInfo.number"></fw-number>
            </div>
          </div>

          <!-- 重量 && 体积 start -->
          <div>
            <fw-gird :weight.sync="baseInfo.weight" :volume.sync="baseInfo.volume" ></fw-gird>
          </div>
          <!-- 重量 && 体积 end -->

          <!-- 货物类型 start -->
          <div>
            <fw-type @result="getGoodsType" :weight="baseInfo.weight" :volume="baseInfo.volume"></fw-type>
          </div>
          <!-- 货物类型 start -->
        </div>
      </div>
    </popup>
  </div>
  <!-- 第二层 基本信息 popup end -->

</div>
</template>

<script>
/**
 * @class 商品详情模块 开单页模块
*/

import {Popup, TransferDom} from 'vux'
// cellTitle 组件
import FwCellTitle from '@/components/public/fw-cell-title'
// picker 组件
import FwPciker from '@/components/public/fw-picker'
// number 组件
import FwNumber from '@/components/public/fw-number'
// 栅格
import FwGird from '@/components/public/fw-gird'
// 类型
import FwType from '@/components/public/fw-type'

// 货物名称弹层模块
import MGoodNamePopup from '@/modules/goodNamePopup'
// 货物包装弹层模块
import MPackingPopup from '@/modules/packingPopup'
import * as API from '@/http/common/api'


import {
  mapState,
  mapGetters,
  mapMutations
} from 'vuex'
import * as mutationTypes from '@/vuex/mutations/types'
import * as actionTypes from '@/vuex/actions/types'

export default {
  name: 'mGoodsInfo',
  directives: {
    TransferDom
  },
  data() {
    return {
      isShowQuickPopupMain: false, // 第一层 主要popup
      isShowQuickPopupName: false, // 第二层 名称popup
      isShowQuickPopupPacking: false, // 第二层 包装popup
      isShowQuickPopupBaseInfo: false, // 第二层 基本信息popup
      clearName: false, // 是否清空货物名称选中
      clearPacking: false, // 是否清空货物类型选中
      baseInfo: { // 基本信息popup部分
        number: 1, // 件数
        weight: 0, // 重量
        volume: 0, // 体积
        activeTypeItem: '', // 获得计算后货物所属类型
      },
      quickResultList: [ // 选择结果
        {key: '货物名称', placeholder: '请选择货物名称(必填)', value: ''},
        {key: '货物包装', placeholder: '选择包装', value: '', result: {}},
        {key: '基本信息', placeholder: '件数(必填) 、数量、体积', value: ''}
      ]
    }
  },
  computed: {
    ...mapState('openBill', ['goodsList', 'dataDictionaries', 'selectedDot', 'receiveDeliverData', 'targetAddressList', 'totalList']),
    ...mapGetters('openBill', ['getGoodListAggregate'])
  },
  components: {
    Popup,
    FwPciker,
    FwNumber,
    FwGird,
    FwType,
    FwCellTitle,
    MGoodNamePopup,
    MPackingPopup
  },
  methods: {
    ...mapMutations('openBill', {
      // vuex 添加货物信息
      _addGoodsInfoItem: mutationTypes.ADD_GOODS_ITEM,
      // 设置每条货物运费列表
      _setGoodItemCost: mutationTypes.SET_GOOD_ITEM_COST,
      // 设置基本运费
      _setBaseCost: mutationTypes.SET_BASE_COST,
    }),
    showPopup(index) {
      // 校验输入目的地
      if (this.targetAddressList.length === 0) {
        this.$toast.show('请选择目的地')
        return
      }
      // 校验输入发货人信息
      if (!this.receiveDeliverData[0].isActive) {
        this.$toast.show('请填写发货人信息')
        return
      }

      if (this.goodsList.length === 3) {
        this.$toast.show('最多只能添加3条货物')
        return
      }
      this._handlePopup(index, true)
    },
    hidePopup(index) {
      if (index === -1) {
        // 清空选中数据
        this.resetData()
      }
      this._handlePopup(index, false)
    },
    // 触发popup
    _handlePopup(index, isShow) {
      const task = {
        0: () => {this.isShowQuickPopupMain = isShow},
        1: () => {this.isShowQuickPopupName = isShow},
        2: () => {this.isShowQuickPopupPacking = isShow},
        3: () => {this.isShowQuickPopupBaseInfo = isShow}
      }[index + 1]()
    },
    // 货物包装确认选择
    getPackingSelectedData(result) {
      this.quickResultList[1].result = result
      this.quickResultList[1].value = this.quickResultList[1].result.itemName
    },
    // 商品名称确定选择
    confirmGoodNamePopup(activeName) {
      this.quickResultList[0].value = activeName
    },
    // 货物基本信息中货物类型
    getGoodsType(activeItem) {
      this.baseInfo.activeTypeItem = activeItem
    },
    // 基本信息确认选择
    confirmBaseInfoPopup() {
      if (this.baseInfo.number === 0 || this.baseInfo.number === '') {
        this.$toast.show('件数为大于0的整数')
        return
      }
      let weight = this.baseInfo.weight ? '/' + this.baseInfo.weight + '㎏' : '/0㎏'
      let volume = this.baseInfo.volume ? '/' + this.baseInfo.volume + 'm³' : '/0m³'
      this.quickResultList[2].value = `${this.baseInfo.number}件${weight}${volume}`
      this.hidePopup(2)
    },
    // 提交快捷添加信息
    confirmMainPopup() {
      if (!this.quickResultList[0].value) {
        this.$toast.show('请选择货物名称')
        return
      }
      if (!this.quickResultList[1].value) {
        this.$toast.show('请选择货物包装')
        return
      }
      if (!this.quickResultList[2].value) {
        this.$toast.show('请选择基本信息')
        return
      }
      this._addGoodsInfoItem({
        goodName: this.quickResultList[0].value, // 货物名称
        packingObj: this.quickResultList[1].result, // 货物包装
        number: this.baseInfo.number, // 件数
        weight: this.baseInfo.weight || 0, // 重量
        volume: this.baseInfo.volume || 0, // 体积
        goodType: this.baseInfo.activeTypeItem // 货物类型
      })
      // 清空选中数据
      this.resetData()
      this.hidePopup(-1)
    },
    // 跳转货物信息页
    jumpGoodsInfo() {
      // 校验输入目的地
      if (this.targetAddressList.length === 0) {
        this.$toast.show('请选择目的地')
        return
      }
      // 校验输入发货人信息
      if (!this.receiveDeliverData[0].isActive) {
        this.$toast.show('请填写发货人信息')
        return
      }
      this.$router.push('/openbill/goodsinfo')
    },
    // 获取 && 更新 运费
    _getFreight(dataSource) {
      // 没有货物 return
      if (dataSource.length === 0) return
      let userInfo = JSON.parse(this.$localStorage.get('userInfo'))
      const waybillFreightDTO = {
        invoiceOrgId: Number.parseInt(userInfo.orgId), // 发货网点ID 登录后返回
        destCityId: this.targetAddressList[1].id || '',  // 目的地城市ID
        destDistrictId: this.targetAddressList[2] ? this.targetAddressList[2].id : '', // 目的地区县ID
        destCityName: this.targetAddressList[1].name || '', // 目的地城市名称

        invoiceCityId: this.receiveDeliverData[0].idList[1].id, // 发货人城市ID
        invoiceCityName: this.receiveDeliverData[0].idList[1].name, // 发货人城市名称
        invoiceDistrictId: this.receiveDeliverData[0].idList[2].id, // 发货人区县ID
        invoiceCompany: this.receiveDeliverData[0].name, // 发货方名称
        invoiceCustomerId: '', // 发货方Id
      }
      let task = []
      dataSource.forEach((item) => {
        task.push(this.$http(API.GET_ITEM_TOTAL, {
          type: 'POST',
          params: {
            waybillFreightDTO,
            goodsFreightDTO: {
              packageNum: Number.parseInt(item.number),
              volume: item.volume ? Number.parseFloat(item.volume) : '',
              weight: item.weight ? Number.parseFloat(item.weight) : '',
              goodsType: item.goodType ? Number.parseInt(item.goodType.id) : ''
            }
          }
        }))
      })

      Promise.all(task)
        .then(res => {
          let [...totalList] = res.map(item => {
            if (item.status.statusCode === 0) {
              return {
                amountWithTax: Number.parseFloat(item.result.amountWithTax),
                price: Number.parseFloat(Number.parseFloat(item.result.itemDetail[0].price).toFixed(2))
              }
            } else {
              return {
                amountWithTax: 0,
                price: 0
              }
            }
          })
          // 设置每条货物运费列表
          this._setGoodItemCost(totalList)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 清空选中数据
    resetData() {
      this.quickResultList[0].value = ''
      this.quickResultList[1].value = ''
      this.quickResultList[2].value = ''
      this.baseInfo.number = 1
      this.baseInfo.weight = ''
      this.baseInfo.volume = ''
      // 清空货物名称选中数据
      this.clearName = true
      // 清空货物包装选中数据
      this.clearPacking = true
    }
  },
  watch: {
    // 监听商品名称input
    'goodNames.goodNameInputValue'(newValue) {
    if (newValue === '') return
      this.goodNames.goodNameIndex = null
      this.quickResultList[0].value = newValue
    },
    // 全局监听vuex中商品列表数据变化，获取最新条数运费
    goodsList: {
      handler: function (newValue) {
        // 获取 && 更新 运费
        this._getFreight(newValue)
      },
      deep: true,
      immediate: true
    },
    totalList(newValue) {
      let total = 0
      newValue.forEach(item => {
        total += item.amountWithTax
      })
      this._setBaseCost(0)
      this._setBaseCost(total)
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
