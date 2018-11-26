<template>
<div class="fw-search">
  <div class="fw-search_icon"><span></span></div>
  <div class="fw-search_contet">
    <input v-model="_answer" class="fw-search_input" type="text" :placeholder="placeholder" :disabled="isDisabled"/>
    <div class="fw-search_close" @click="emptyValue" v-show="isShowEmpty">
      <div class="fw-search_close_icon"></div>
    </div>
  </div>
</div>
</template>

<script>
/**
 * @class 搜索组件
 * @param {String} placeholder 提示文字
 * @param {String} value 双向绑定
*/

export default {
  name: 'fwSearch',
  data() {
    return {
      isShowEmpty: false
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '查询'
    },
    value: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _answer: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    emptyValue() {
      this._answer = ''
    }
  },
  watch: {
    value (newValue) {
      this.isShowEmpty = newValue.length === 0 ? false : true
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
