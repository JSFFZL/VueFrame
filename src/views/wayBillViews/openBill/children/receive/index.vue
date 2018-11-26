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
      <fw-no-find info="暂无数据" v-show="receiveDataList.length === 0"></fw-no-find>

      <div class="page-receivedeliver_result_list" v-show="true">
        <div class="page-receivedeliver_result_item" v-for="(item, index) in receiveDataList" :key="index" @click="selectedItem(item)">
          <div class="result-item_icon_wrap">
            <div class="result-item_icon"></div>
          </div>
          <div class="result-item_info">
            <div>{{item.receiptCustomerName || item.receiptUserName+'/'+item.receiptUserMobleNo}}</div>
            <div><span>{{item.receiptUserName}}</span><span>{{item.receiptUserMobleNo}}</span></div>
            <div>{{
              (item.receiptProvCodeName ? item.receiptProvCodeName : '')
                +
              (item.receiptCityCodeName ? item.receiptCityCodeName : '')
                +
              (item.receiptDistrictCodeName ? item.receiptDistrictCodeName : '')
                +
              (item.receiptStreetCodeName ? item.receiptStreetCodeName : '')
            }}
            </div>
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
 * 收货人信息
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

const INDEX = 1

export default {
  name: 'pageReceivedeliver',
  mixins: [mixinUtils],
  data () {
    return {
      isShowSearchResult: true, // 是否显示联想结果 (包含列表和nofind)
      isShowLinkagePopup: false, // 显示/隐藏省区市街道四级联动popup
      timeOut: null, // 定时器
      idList: [], // 当前选中地址ID
      defaultInputValue: [ // 初始化可输入字段
        {
          key: '收货公司',
          value: '',
          placeholder: '请输入收货公司'
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
      receiveDataList: [], // 发货人数据列表
      searchKey: ''
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      for (let i of Object.keys(vm.receiveDeliverData[INDEX])) {
        vm.idList = vm.receiveDeliverData[INDEX].idList || vm.idList
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
      _setReceiveDeliverData: mutationTypes.SET_RECEIVEDELIVER_INFO
    }),
    // 获取收货人数据列表
    _getInvoiceData(searchKey) {
      let userInfo = JSON.parse(this.$localStorage.get('userInfo'))
      const params = {
        currentPage: 0,
        pageSize: 20,
        consignType: '', // 托运类型，保留
        queryCondition: searchKey,
        invoiceCompanyId: this.receiveDeliverData[0].invoiceCompanyId || '',
        orgId: userInfo.orgId // 发货网点ID
      }
      this.$http(API.GET_RECEIVE_LIST_INFO, {
        type: 'POST',
        params
      })
        .then(res => {
          this.__isSuccess(res, function (result) {
            this.receiveDataList = result.result
          }.bind(this))
        })
    },
    // 选择收货人搜索列表item
    selectedItem(item) {
      // 选中省市区街道
      let classA = item.receiptProvCodeName || ''
      let classB = item.receiptCityCodeName || ''
      let classC = item.receiptDistrictCodeName || ''
      let classD = item.receiptStreetCodeName || ''

      // 省市区街道ID及名称
      this.idList = []
      this.idList[0] = {
        id: item.receiptProvCode || '',
        name: item.receiptProvCodeName || ''
      }
      this.idList[1] = {
        id: item.receiptCityCode || '',
        name: item.receiptCityCodeName || ''
      }
      this.idList[2] = {
        id: item.receiptDistrictCode || '',
        name: item.receiptDistrictCodeName || ''
      }
      this.idList[3] = {
        id: item.receiptStreetCode || '',
        name: item.receiptStreetCodeName || ''
      }

      this.defaultInputValue[0].value = item.receiptCustomerName || item.receiptUserName + '/' + item.receiptUserTelNo
      this.defaultInputValue[1].value = item.receiptUserName || ''
      this.defaultInputValue[2].value = item.receiptUserMobleNo || item.receiptUserTelNo || ''
      this.defaultInputValue[3].result = classA + classB + classC + classD
      this.defaultInputValue[4].value = item.receiptAddress || ''

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
          idList: this.idList, // 所在地区ID列表
          companyName: selectedResult[0].value,
          name: selectedResult[1].value,
          phone: selectedResult[2].value,
          region: selectedResult[3].result, // 所在地区
          region_2: selectedResult[4].value, // 详细地址
          address: selectedResult[3].result + selectedResult[4].value, // 所在地区 + 详细地址
          isActive: true
        }
      })
      this.$router.go(-1)
    }
  },
  watch: {
    searchKey(newValue) {
      this.receiveDataList = []
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
