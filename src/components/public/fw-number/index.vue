<template>
<div class="fw-number">
  <div class="fw-number_reduce" @click="reduce">
    <span></span>
  </div>
  <input class="fw-number_input" type="tel" :value="number === 0 ? '' : number" @input="changValue1"/>
  <div class="fw-number_add" @click="add">
    <span></span>
  </div>
</div>
</template>

<script>
/**
 * @class number组件
*/
export default {
  name: 'fwNumber',
  props: {
    number: Number
  },
  methods: {
    changValue1(el) {
      el.target.value = el.target.value.replace(/[^0-9]/ig, '')
      if (el.target.value === '') {
        el.target.value = 0
      } else if (el.target.value === '0') {
        el.target.value = 1
      } else {
        el.target.value = el.target.value.replace(/[^0-9]/ig,'')
      }
      this.$emit('update:number', el.target.value === '0' ? 0 : parseInt(el.target.value))
    },
    add() {
      let number = this.number
      this.$emit('update:number', number += 1)
    },
    reduce() {
      let number = this.number
      if (number === 0 || number === 1 || number === '') return
      this.$emit('update:number', number -= 1)
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
