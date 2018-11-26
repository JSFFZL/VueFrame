<template>
<div class="fw-nofind">
  <div class="fw-nofind_content">
    <div class="fw-nofind_content_icno"></div>
    <div class="fw-nofind_content_text">{{info}}</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'noFind',
  props: {
    info: {
      type: String,
      default: '未找到目的网点，可尝试修改重试'
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
