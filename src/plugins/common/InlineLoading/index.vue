<template>
    <div class="inline-loading_wrap" v-show="isShow">
      <div class="inline-loading_content"></div>
      <span>{{text}}</span>
    </div>
</template>

<script>
/**
 @class {props}
 *
 @param {Boolean} isShow 是否显示
 *
 @param {String} text 提示文字
*/
export default {
  name: 'pInlineLoading',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
