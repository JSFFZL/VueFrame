<template>
  <div class="page-receivedeliver">

    <fw-search
      placeholder="输入公司名称/姓名/手机号搜索"
      v-model="searchKey"
    ></fw-search>

    <!-- 默认展示 start -->
    <div class="page-receivedeliver_result" v-show="isShowSearchResult">
      <div class="page-receivedeliver_result_default">
        <div class="result-default_content">
          <div class="result-default_item" v-for="(item, index) in defaultInputValue" :key="index">
            <div class="default-item_key">{{item.key}}</div>
            <div class="default-item_input" v-show="index !== 3">
              <input v-show="index === 2" type="tel" :value="item.value" @input="verificationPhone" :placeholder="item.placeholder" @click="__scrollIntoViewIfNeededInput($event)">
              <input v-show="index !== 2" type="text" maxlength="50" v-model="item.value" :placeholder="item.placeholder" @click="__scrollIntoViewIfNeededInput($event)">
            </div>
            <!-- 所在地区 -->
            <div
              class="default-item_address"
              :class="item.result === '请选择省市区街道' || !item.result ? '' : 'default-item_address_active'"
              v-show="index === 3"
              @click="showLinkagePopup"
            >{{item.result ? item.result : '请选择省市区街道' }}</div>
          </div>
        </div>
        <div class="result-default_text">搜索结果如果与运单不符，可进行修改</div>
      </div>
    </div>
    <!-- 默认展示 end -->

    <!-- nofind start -->
    <div class="page-receivedeliver_nofind" v-show="!isShowSearchResult">
      <fw-no-find info="暂无数据" v-show="invoiceDataList.length === 0"></fw-no-find>

      <div class="page-receivedeliver_result_list" v-show="true">
        <div class="page-receivedeliver_result_item" v-for="(item, index) in invoiceDataList" :key="index" @click="selectedItem(item)">
          <div class="result-item_icon_wrap">
            <div class="result-item_icon"></div>
          </div>
          <div class="result-item_info">
            <div>{{item.invoiceCustomerName || item.invoiceUserName+'/'+item.invoiceUserMobleNo}}</div>
            <div><span>{{item.invoiceUserName}}</span><span>{{item.invoiceUserMobleNo}}</span></div>
            <div>{{
              (item.invoiceProvCodeName ? item.invoiceProvCodeName : '')
                +
              (item.invoiceCityCodeName ? item.invoiceCityCodeName : '')
                +
              (item.invoiceDistrictCodeName ? item.invoiceDistrictCodeName : '')
                +
              (item.invoiceStreetCodeName ? item.invoiceStreetCodeName: '')
            }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- nofind end -->

    <!-- 确定按钮 start -->
    <div class="page-receivedeliver_button">
      <div
        class="page-receivedeliver_button_btn_default"
        :class="isBtn ? 'page-receivedeliver_button_btn_yes' : ''"
        @click="confirmSubmit"
      >确定</div>
    </div>
     <!-- 确定按钮 end -->

    <Linkage
      :isShow.sync="isShowLinkagePopup"
      @result="getResult"
    ></Linkage>
  </div>
</template>

<script>
/**
 * 发货人信息
*/

import {mapState, mapActions, mapMutations} from 'vuex'
import * as API from '@/http/common/api'
import * as mutationTypes from '@/vuex/mutations/types'
import * as actionTypes from '@/vuex/actions/types'
// 省市区街道四级联动
import Linkage from '@/components/common/linkage'
import FwSearch from '@/components/public/fw-search'
import FwNoFind from '@/components/public/fw-nofind'
// 继承 mixins
import mixinUtils from '@/mixins/common/public.js'

const INDEX = 0

export default {
  name: 'pageReceivedeliver',
  mixins: [mixinUtils],
  data () {
    return {
      isShowSearchResult: true, // 是否显示联想结果 (包含列表和nofind)
      isShowLinkagePopup: false, // 显示/隐藏省区市街道四级联动popup
      timeOut: null, // 定时器
      idList: [], // 当前选中地址ID
      isMonthly: 0, // 是否支持月结 1支持  0不支持
      defaultInputValue: [ // 初始化可输入字段
        {
          key: '发货公司',
          value: '',
          placeholder: '请输入发货公司'
        },
        {
          key: '姓名',
          value: '',
          placeholder: '请输入姓名'
        },
        {
          key: '手机',
          value: '',
          placeholder: '请输入手机号'
        },
        {
          key: '所在地区',
          value: '',
          result: '' // 省市区街道四级联动回传数据
        },
        {
          key: '详细地址',
          value: '',
          placeholder: '请填写详细地址'
        },
      ],
      invoiceDataList: [], // 发货人数据列表
      searchKey: ''
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      for (let i of Object.keys(vm.receiveDeliverData[INDEX])) {
        vm.idList = vm.receiveDeliverData[INDEX].idList || vm.idList
        vm.invoiceCompanyId = vm.receiveDeliverData[INDEX].invoiceCompanyId || vm.invoiceCompanyId
        vm.defaultInputValue[0].value = vm.receiveDeliverData[INDEX].companyName || ''
        vm.defaultInputValue[1].value = vm.receiveDeliverData[INDEX].name || ''
        vm.defaultInputValue[2].value = vm.receiveDeliverData[INDEX].phone || ''
        vm.defaultInputValue[3].result = vm.receiveDeliverData[INDEX].region || '请选择省市区街道'
        vm.defaultInputValue[4].value = vm.receiveDeliverData[INDEX].region_2 || ''
      }
    })
  },
  computed: {
    ...mapState('openBill', ['receiveDeliverData', 'selectedDot']),
    isBtn() {
      if (this.defaultInputValue[1].value && this.defaultInputValue[2].value && this.defaultInputValue[2].value.length === 11 && this.defaultInputValue[3].result !== '请选择省市区街道') {
        if (!this.defaultInputValue[3].result) {
          return false
        } else {
          return true
        }

      } else {
        return false
      }
    }
  },
  components: {
    Linkage,
    FwSearch,
    FwNoFind
  },
  methods: {
    ...mapMutations('openBill', {
      _setReceiveDeliverData: mutationTypes.SET_RECEIVEDELIVER_INFO,
      _setReceiveDeliverDataSelected: mutationTypes.SET_RECEIVEDELIVER_INFO_SELECTED
    }),
    // 获取发货人数据列表
    _getInvoiceData(searchKey) {
      let userInfo = JSON.parse(this.$localStorage.get('userInfo'))
      const params = {
        queryCondition: searchKey, // 网点ID
        consignType: '', // 托运类型，保留
        currentPage: 0,
        pageSize: 20,
        orgId: userInfo.orgId // 发货网点ID
      }
      this.$http(API.GET_SEND_LIST_INFO, {
        type: 'POST',
        params
      })
        .then(res => {
          this.__isSuccess(res, function (result) {
            this.invoiceDataList = result.result
          }.bind(this))
        })
    },
    // 选择搜索列表item
    selectedItem(item) {
      // 选中省市区街道
      let classA = item.invoiceProvCodeName || ''
      let classB = item.invoiceCityCodeName || ''
      let classC = item.invoiceDistrictCodeName || ''
      let classD = item.invoiceStreetCodeName || ''
      // 省市区街道ID及名称
      this.idList = []
      this.idList[0] = {
        id: item.invoiceProvCode || '',
        name: item.invoiceProvCodeName || ''
      }
      this.idList[1] = {
        id: item.invoiceCityCode || '',
        name: item.invoiceCityCodeName || ''
      }
      this.idList[2] = {
        id: item.invoiceDistrictCode || '',
        name: item.invoiceDistrictCodeName || ''
      }
      this.idList[3] = {
        id: item.invoiceStreetCode || '',
        name: item.invoiceStreetCodeName || ''
      }
      // 设置是否支持月结
      this.isMonthly = item.isMonthly

      // 设置当前选中客商信息
      this._setReceiveDeliverDataSelected({
        invoiceCompanyId: item.invoiceCustomerId,  // 客商ID
        companyName: item.invoiceCustomerName || item.invoiceUserName + '/' + item.invoiceUserMobleNo // 客商公司名称
      })

      this.defaultInputValue[0].value = item.invoiceCustomerName || item.invoiceUserName + '/' + item.invoiceUserMobleNo
      this.defaultInputValue[1].value = item.invoiceUserName || ''
      this.defaultInputValue[2].value = item.invoiceUserMobleNo || item.invoiceUserTelNo || ''
      this.defaultInputValue[3].result = classA + classB + classC + classD
      this.defaultInputValue[4].value = item.invoiceAddress || ''

      this.searchKey = ''
    },
    // 显示省市区街道popup
    showLinkagePopup() {
      this.isShowLinkagePopup = true
    },
    // 接收透传省市区四级联动选中数据
    getResult(result) {
      console.log(result)
      this.idList = result
      this.defaultInputValue[3].result = ''
      result.forEach((item, index) => {
        this.defaultInputValue[3].result += item.name
      })
    },
    // 校验 phone
    verificationPhone(el) {
      // 只允许输入包含.的数字
      el.target.value = el.target.value.replace(/[^\d || \.]/ig, '')
      if (el.target.value.charAt(0) !== '1') {
        el.target.value = null
      } else {
        el.target.value = el.target.value.substring(0, 11)
      }
      this.defaultInputValue[2].value = el.target.value
    },
    // 确定
    confirmSubmit() {
      const selectedResult = this.defaultInputValue

      if (!selectedResult[1].value) {
        this.$toast.show('姓名不能为空')
        return
      }else if (!selectedResult[2].value || selectedResult[2].value.length !== 11) {
        this.$toast.show('请输入正确的手机号')
        return
      }else if (selectedResult[3].result === '请选择省市区街道' || !selectedResult[3].result) {
        this.$toast.show('请输入所在地区')
        return
      }

      this._setReceiveDeliverData({
        index: INDEX,
        data: {
          isMonthly: this.isMonthly, // 是否支持月结 1支持  0不支持
          idList: this.idList, // 所在地区ID列表
          invoiceCompanyId: this.defaultInputValue[0].value === this.receiveDeliverData[2].companyName ? this.receiveDeliverData[2].invoiceCompanyId : '', // 客商ID
          companyName: selectedResult[0].value,
          name: selectedResult[1].value,
          phone: selectedResult[2].value,
          region: selectedResult[3].result, // 所在地区
          region_2: selectedResult[4].value, // 详细地址
          address: selectedResult[3].result + selectedResult[4].value, // 所在地区 + 详细地址
          isActive: true
        }
      })
      // 通知月结状态
      if (this.receiveDeliverData[0].invoiceCompanyId === '') {
        this.$root.Bus.$emit(this.$root.busTypes._HANDLE_MONTHLY, 0)
      } else {
        this.$root.Bus.$emit(this.$root.busTypes._HANDLE_MONTHLY, this.isMonthly)
      }

      this.$router.go(-1)
    }
  },
  watch: {
    searchKey(newValue) {
      this.invoiceDataList = []
      this.isShowSearchResult = newValue.length === 0 ? true : false
      if (newValue.length === 0) return

      window.clearTimeout(this.timeOut)
      this.timeOut = setTimeout(function () {
        // 半秒请求一次数据
        this._getInvoiceData(newValue)
      }.bind(this), 500)
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
