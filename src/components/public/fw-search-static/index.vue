<template>
<div class="fw-search_static">
  <div class="fw-search_static_content">
    <p class="fw-search_static_content_text" @click="handleSearch">{{textInfo}}</p>
    <p class="fw-search_static_content_scan" v-show="isShowScan" @click="handleScan">
      <span></span>
    </p>
  </div>
</div>
</template>

<script>
/**
 * @class 静态搜索
 * @param {String} textInfo 文字信息
 * @param {Boolean} isShowScan 是否显示扫描
 * @function handleSearch 触发搜索
 * @function handleScan 触发扫描
*/

export default {
  name: 'FwSearchStatic',
  props: {
    textInfo: [String],
    isShowScan: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSearch() {
      this.$emit('handleSearch')
    },
    handleScan () {
      this.$emit('handleScan')
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
