<template>
<div class="fw-dialog" v-show="isShow">
  <Masker v-show="isShow" :fullscreen="true"></Masker>

  <div class="fw-dialog_content animated zoomInDown faster" v-show="isShow">
    <div class="dialog-content_text">
      <!-- 开单金额确认 -->
      <p v-show="isDefault">
        <span>{{costType}}</span><span>{{total}}</span><span>元,</span><span>确定提交运单?</span>
      </p>
      <p v-show="!isDefault">
        <span>{{costType}}</span>
      </p>

    </div>
    <div class="dialog-content_footer">
      <div class="dialog-content_footer_item dialog-content_footer_left" @click="cancel">取消</div>
      <div class="dialog-content_footer_item dialog-content_footer_right" @click="confirm">确定</div>
    </div>
  </div>
</div>
</template>

<script>
import {Masker} from 'vux'

export default {
  name: 'fwDialog',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isDefault: {
      type: Boolean,
      default: true
    },
    costType: {
      type: String,
      default: ''
    },
    total: {
      type: [String, Number],
      default: ''
    }
  },
  components: {
    Masker
  },
  methods: {
    cancel() {
      this.$emit('update:isShow', false)
    },
    confirm() {
      this.$emit('confirm')
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
