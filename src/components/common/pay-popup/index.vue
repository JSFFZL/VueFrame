<template>
<!-- v-transfer-dom 解决ios fixed样式问题 -->
  <div v-transfer-dom class="pay-popup_content-wrap">
    <popup v-model="isShow" position="bottom" :hide-on-blur="false">
      <div class="transport-popup_content">
        <div class="transport-popup_title">选择收款方式</div>
        <div class="transport-popup_item"  @click="selectedTransportItem('现金收款',1)">
          <div class="cash"><img src="../../../assets/images/cash_icon.png" alt=""></div>
          <div>现金收款</div>
        </div>
        <div class="transport-popup_item"  @click="selectedTransportItem('微信收款',2)">
          <div><img src="../../../assets/images/wx_icon.png" alt=""></div>
          <div>微信收款</div>
        </div>
        <div class="transport-popup_item transport-popup_item_cancel" @click="selectedTransportItem('取消',0)">取消</div>
      </div>
    </popup>
  </div>
</template>

<script>
  /**
   * @module <payPopup> 收款方式
   * @param  {Boolean} isShow 是否显示弹窗
   * @emit   {pay} 定义父级方法 关闭弹窗
   * @emit   {showPopup} 返回值 {'name': 微信收款, 'index': 2}
   */
  import {Popup, TransferDom} from 'vux'
  export default {
    name: 'payPopup',
    components: {
      Popup
    },
    directives: {
      TransferDom
    },
    data () {
      return {
      }
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      // 是否手动触发隐藏，某些需求可能要求点击的时候再请求数据，再做处理
      manualShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectedTransportItem (item, index) {
        this.$emit('pay', {'name': item, 'index': index})
        if (!this.manualShow) {
          this.$emit('update:isShow', false)
        }
      }
    }
  }
</script>

<style  lang="less" src="./index.less">

</style>
