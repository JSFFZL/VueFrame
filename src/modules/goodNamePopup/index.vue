<template>
  <div v-transfer-dom>
    <popup class="quick-popup_public quick-popup_name" v-model="isShow" position="bottom" :hide-on-blur="false">
      <div class="quick-popup_public quick-popup_name" :popup-style="{zIndex: 502}">
        <div class="quick-popup_header">
          <div class="quick-popup_header_left" @click="hidePopup">取消</div>
          <div class="quick-popup_header_center">货物名称</div>
          <div
            class="quick-popup_header_right_default"
            :class="staticData.value || staticData.inputValue? 'quick-popup_header_right_sure' : ''"
            @click="confirmGoodNamePopup"
          >确定</div>
        </div>

        <div class="quick-popup_list">
          <div
            class="quick-popup_item"
            :class="staticData.activeIndex === index ? 'quick-popup_item_active' : ''"
            v-for="(item, index) in staticData.goodLists"
            :key="index"
            @click="selectedNameItem(index)"
          >{{item}}</div>
        </div>

        <div class="quick-popup_input">
          <input type="text" placeholder="请输入其他货物名称" maxlength="20" v-model="staticData.inputValue"/>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
/**
 * 货物名称弹层
 * @param {Boolean} clear 是否清空默认选中
 * @param {String} activeName 默认值
*/
import {Popup, TransferDom} from 'vux'

export default {
  name: 'goodNamePopup',
  directives: {
    TransferDom
  },
  data() {
    return {
      staticData: {
        goodLists: ['日用品', '设备', '配件', '原料','建材', '饮料', '食品', '家具', '服装', '五金', '机器', '药品'], // 名称列表
        activeIndex: null, // 商品名称索引
        value: '',
        inputValue: ''
      }
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
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
    Popup
  },
  directives: {
    TransferDom
  },
  methods: {
    hidePopup() {
      this.$emit('update:isShow', false)
    },
    // 选择商品名称item
    selectedNameItem(index) {
      this.staticData.activeIndex = index
      this.staticData.value = this.staticData.goodLists[index]
      this.staticData.inputValue = ''
      this.$emit('result', this.staticData.value)
      this.$emit('update:isShow', false)
    },
    // 商品名称确定选择
    confirmGoodNamePopup() {
      if (this.staticData.inputValue === '' && this.staticData.value === '') {
        this.$toast.show('请选择货物名称')
        return
      }
      this.$emit('result', this.staticData.inputValue || this.staticData.value)
      // 隐藏货物名称popup
      this.hidePopup(0)
    },
  },
  watch: {
    // 监听商品名称input
    'staticData.inputValue'(newValue) {
      if (newValue) {
        this.staticData.activeIndex = null
        this.staticData.value = ''
      }
    },
    clear(isClear) {
      if (isClear) {
        this.staticData.activeIndex = null
        this.staticData.value = ''
        this.staticData.inputValue = ''
      }
    },
    isShow(isShow) {
      if (!isShow) {
        this.$emit('update:clear', false)
      } else {
        if (this.activeName === null) return
        // 货物详情页使用逻辑
        if (this.activeName === '') {
          this.staticData.activeIndex = null
          this.staticData.value = ''
          this.staticData.inputValue = ''
          return
        }
        if (this.staticData.goodLists.includes(this.activeName)) {
          this.staticData.goodLists.forEach((item, index) => {
            if (this.activeName === item) {
              this.staticData.activeIndex = index
              this.staticData.value = ''
              this.staticData.inputValue = ''
            }
          })
        } else {
          this.staticData.activeIndex = null
          this.staticData.value = this.activeName
          this.staticData.inputValue = this.activeName
        }



      }
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
