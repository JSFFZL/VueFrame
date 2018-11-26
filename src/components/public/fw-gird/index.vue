<template>
<div class="fw-gird">
  <div class="volume-weight_left">
    <div class="key">重量</div>
    <input type="number" :value="weight === 0 ? '' : weight" @input="changWeight" placeholder="请输入" />
    <div class="nuit">㎏</div>
  </div>
  <div class="volume-weight_right">
    <div class="key">体积</div>
    <input type="number" :value="volume === 0 ? '' : volume" @input="changVolume"  placeholder="请输入" />
    <div class="nuit">m³</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'fwGird',
  data() {
    return {
      baseInfo: { // info
        weight: 0, // 重量
        volume: 0 // 体积
      }
    }
  },
  props: {
    weight: [String, Number, Object],
    volume: [String, Number, Object]
  },
  methods: {
    changWeight(el) {
      this._calcWeightLength(el, function (targetValue) {
        el.target.value = targetValue
      })
      this.$emit('update:weight', el.target.value || 0)
    },
    changVolume(el) {
      this._calcDigitLength(el, function (targetValue) {
        el.target.value = targetValue
      })
      this.$emit('update:volume', el.target.value || 0)
    },
    // 体积
    _calcDigitLength(el, cb) {
      // 只允许输入包含.的三位小数数字
      let reg = /([0-9]+\.[0-9]{3})[0-9]*/
      el.target.value = el.target.value.replace(reg, '$1')

      if (parseFloat(el.target.value) > 999999) {
        el.target.value = 999999
        cb(el.target.value)
        return
      }
      let digitLength = 0
      if (el.target.value.split('.')[1]) {
        if (el.target.value.split('.')[1].length === 0) {
          digitLength = 0
        }
        if (el.target.value.split('.')[1].length <= 3 && el.target.value.split('.')[1].length > 0) {
          digitLength = el.target.value.split('.')[1].length
        }
        if (el.target.value.split('.')[1].length > 3) {
          digitLength = 3
        }
        cb(el.target.value.slice(0, el.target.value.indexOf('.') + digitLength + 1))
      }
    },
    // 重量
    _calcWeightLength(el, cb) {
      // 只允许输入包含.的一位小数数字
      let reg = /([0-9]+\.[0-9]{1})[0-9]*/
      el.target.value = el.target.value.replace(reg, '$1')

      if (parseFloat(el.target.value) > 999999) {
        el.target.value = 999999
        cb(el.target.value)
        return
      }
      let digitLength = 0
      if (el.target.value.split('.')[1]) {
        if (el.target.value.split('.')[1].length === 0) {
          digitLength = 0
        }
        if (el.target.value.split('.')[1].length <= 1 && el.target.value.split('.')[1].length > 0) {
          digitLength = el.target.value.split('.')[1].length
        }
        if (el.target.value.split('.')[1].length > 1) {
          digitLength = 1
        }
        cb(el.target.value.slice(0, el.target.value.indexOf('.') + digitLength + 1))
      }
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
