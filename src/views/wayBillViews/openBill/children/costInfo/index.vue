<template>
<div class="page-cost_info">
  <div class="page-cost_info_list">
    <div class="page-cost_info_item" v-for="(item, index) in dataList" :key="index" @input="verificationInput($event, index)">
      <div>{{item.name}}</div>
      <input type="number" :value="item.value" placeholder="请输入金额" @click="__scrollIntoViewIfNeededInput($event)"/>
      <div>元</div>
    </div>
  </div>
  <div class="page-cost_info_footer">
    <div @click="reset">重置</div>
    <div @click="confirm">确定</div>
  </div>
</div>
</template>

<script>
import * as mutationTypes from '@/vuex/mutations/types'
import {mapState, mapMutations, mapGetters} from 'vuex'
// 继承 mixins
import mixinUtils from '@/mixins/common/public.js'

export default {
  name: 'costInfo',
  mixins: [mixinUtils],
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.costInfo.additional.forEach((item, index) => {
        if (item) {
          vm.dataList[index].value = item
        }
      })
    })
  },
  data() {
    return {
      dataList: [
        {name: '提货费', value: ''},
        {name: '包装费', value: ''},
        {name: '代收货款', value: ''},
        {name: '代收货款手续费', value: ''},
        {name: '声明价值', value: ''},
        {name: '保价费', value: ''},
        {name: '加急费', value: ''},
        {name: '信息费', value: ''},
        {name: '垫付运费', value: ''},
        {name: '其他费用', value: ''},
        {name: '业务费', value: ''},
        {name: '税费', value: ''}
      ]
    }
  },
  computed: {
    ...mapState('openBill', ['costInfo', 'wayBillInfo'])
  },
  methods: {
    ...mapMutations('openBill', {
      _syncCostInfo: mutationTypes.SYNC_COST_INFO // 同步附加费用信息
    }),
    verificationInput(el, index) {
      // 只允许输入包含.的二位小数数字
      let reg = /([0-9]+\.[0-9]{2})[0-9]*/
      el.target.value = el.target.value.replace(reg, '$1')

      // 代收贷款 && 声明价值
      if (index === 2 || index === 4) {
        if (parseFloat(el.target.value) > 99999999) {
          el.target.value = 99999999
          this.dataList[index].value = el.target.value
        } else {
          this.dataList[index].value = el.target.value
        }

        // 代收贷款
        if (index === 2) {
          // 代收贷款费率
          let rate = this.$calc('*', this.wayBillInfo.coDeliveryFeeRate, 0.001)
          this.dataList[3].value = parseFloat(parseFloat(this.$calc('*', this.dataList[2].value, rate)).toFixed(2)) || ''
        }
        // 声明价值费率
        if (index === 4) {
          let rate = this.$calc('*', this.wayBillInfo.insuranceRate, 0.001)
          this.dataList[5].value = parseFloat(parseFloat(this.$calc('*', this.dataList[4].value, rate)).toFixed(2)) || ''
        }
      } else {
        if (parseFloat(el.target.value) > 999999) {
          el.target.value = 999999
          this.dataList[index].value = el.target.value
        } else {
          this.dataList[index].value = el.target.value
        }
      }
    },
    reset() {
      let arr = []
      this.dataList.forEach((item) => {
        item.value = ''
        arr.push(item.value)
      })
      this._syncCostInfo(arr)
    },
    confirm() {
      let arr = []
      this.dataList.forEach((item) => {
        arr.push(item.value)
      })
      this._syncCostInfo(arr)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
