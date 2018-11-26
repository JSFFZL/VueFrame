<template>
<div class="fw-cell-title">
  <div class="fw-cell-title_icon"></div>
  <div class="fw-cell-title_title">{{title}}<span class="fw-cell-title_describe">{{describe}}</span></div>
  <div class="fw-cell-title_subtitle" @click="handleSubTitle">{{subTitle}}</div>
</div>
</template>

<script>
/**
 * @class fe-cell-title 组件
 * @param {String} title 主标题
 * @param {String} describe 描述
 * @param {String} subTitle 富标题
*/
export default {
  name: 'fwCellTitle',
  props: {
    title: String,
    describe: String,
    subTitle: String
  },
  methods: {
    handleSubTitle() {
      this.$emit('handle')
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
