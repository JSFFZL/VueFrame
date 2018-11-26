<template>
<div v-transfer-dom>
  <popup v-model="isShow" position="bottom" :hide-on-blur="false">
    <div class="quick-popup_public quick-popup_packing" :popup-style="{zIndex: 502}">
      <div class="quick-popup_header">
        <div class="quick-popup_header_left" @click="hidePopup(1)">取消</div>
        <div class="quick-popup_header_center">货物包装</div>
        <div class="quick-popup_header_right_sure" @click="confirmPackingPopup">确定</div>
      </div>

      <div class="quick-popup_list">
        <fw-picker :isShow="isShow" :ativeIndex.sync="ativeIndex" :dataSource="dataDictionaries.hwbz" @result="getPackingSelectedData" ></fw-picker>
      </div>
    </div>
  </popup>
</div>
</template>

<script>
/**
 * 货物包装popup
 * @param {Boolean} clear 是否清空默认选中
 * @param {String} activeName 默认值
*/
import {Popup, TransferDom} from 'vux'
import {
  mapState,
  mapGetters,
  mapMutations
} from 'vuex'
import * as mutationTypes from '@/vuex/mutations/types'
import * as actionTypes from '@/vuex/actions/types'
// picker 组件
import FwPicker from '@/components/public/fw-picker'

export default {
  name: 'packingPopup',
  directives: {
    TransferDom
  },
  data() {
    return {
      ativeIndex: 0, // picker 索引
      selectedItem: {}
    }
  },
  computed: {
    ...mapState('openBill', ['dataDictionaries'])
  },
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    clear: {
      type: Boolean,
      default: false
    },
    activeName: {
      type: [String, Object],
      default: null
    }
  },
  components: {
    Popup,
    FwPicker
  },
  methods: {
    hidePopup() {
      this.$emit('update:isShow', false)
    },
    // 确定
    confirmPackingPopup() {
      if (this.selectedItem === undefined) {
        this.$emit('result', this.dataDictionaries.hwbz[0])
        this.$emit('update:isShow', false)
        return
      }
      this.$emit('result', this.selectedItem)
      this.$emit('update:isShow', false)
    },
    // 实时获取picker组件选取内容
    getPackingSelectedData(resultItem) {
      this.selectedItem = resultItem
    }
  },
  watch: {
    isShow(isShow) {
      if (!isShow) {
        this.$emit('update:clear', false)
      } else {
        if (this.activeName === null){ // 快捷选择逻辑
          if (this.clear) {
            this.ativeIndex = 0
          }
        } else { // 货物详情页面信息
          if (this.activeName === '') {
            this.ativeIndex = 0
          } else {
            let activeIndex =  this.dataDictionaries.hwbz.findIndex((item, index) => {
              return this.activeName === item.itemName
            })
            this.ativeIndex = activeIndex
          }
        }
      }
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
