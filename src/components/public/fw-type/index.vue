<template>
<div class="fw-type">
  <span v-if="isShowCalc">{{calcQuality}}</span>
  <div class="type_key">货物类型</div>
  <ul class="type_list">
    <li
      class="type_item"
      :class="baseInfo.typeActiveIndex === index ? 'type_item_active' : ''"
      v-for="(item, index) in baseInfo.staticTypeList"
      :key="index"
      @click="selectedItem(index)"
    >{{item.name}}</li>
  </ul>
</div>
</template>

<script>
/**
 * @class 货物类型
 * @param {Object} weight 重量
 * @param {Object} volume 体积
 * @param {Object | Number} activeIndex 当前调用者索引
*/

export default {
  name: 'fwType',
  data () {
    return {
      isShowCalc: true, // 是否计算
      baseInfo: {
        typeActiveIndex: 0, // type 索引
        staticTypeList: [
          {name: '轻泡货', id: 2},
          {name: '轻货', id: 1},
          {name: '重泡货', id: 4},
          {name: '重货', id: 3},
          {name: '纯重货', id: 5}
        ]
      }
    }
  },
  props: {
    weight: null,
    volume: null,
    activeIndex: null
  },
  computed: {
    calcQuality() {
      if (isNaN(this.weight) || isNaN(this.volume)) {
        this.baseInfo.typeActiveIndex = null
        return
      }
      let quality = Number.parseFloat(this.$calc('/', Number.parseFloat(this.weight) , Number.parseFloat(this.volume)))

      if (Number.parseFloat(this.weight) > 0 && Number.parseFloat(this.volume) === 0) { // 重货
        this.baseInfo.typeActiveIndex = 3
      }else if (Number.parseFloat(this.weight) === 0 && Number.parseFloat(this.volume) > 0) { // 轻货
        this.baseInfo.typeActiveIndex = 1
      }else if (quality > 0 && quality <= 200) { // 轻泡货
        this.baseInfo.typeActiveIndex = 0
      }else if (quality > 200 && quality <= 280) { // 轻货
        this.baseInfo.typeActiveIndex = 1
      }else if (quality > 280 && quality <= 340) { // 重泡货
        this.baseInfo.typeActiveIndex = 2
      }else if (quality > 340 && quality <= 1000) { // 重货
        this.baseInfo.typeActiveIndex = 3
      }else if (quality > 1000) { // 纯重货
        this.baseInfo.typeActiveIndex = 4
      }
      this.$emit('result', this.baseInfo.staticTypeList[this.baseInfo.typeActiveIndex], this.activeIndex)
    }
  },
  methods: {
    selectedItem(index) {
      this.isShowCalc = false
      this.baseInfo.typeActiveIndex = index
      this.$emit('result', this.baseInfo.staticTypeList[this.baseInfo.typeActiveIndex], this.activeIndex)
    }
  },
  watch: {
    weight() {
      this.isShowCalc = true
    },
    volume() {
      this.isShowCalc = true
    }
    // 'baseInfo.typeActiveIndex': {
    //   handler: function (newIndex) {
    //     if (newIndex === null) {
    //       this.$emit('result', '')
    //       return
    //     }
    //     this.$emit('result', this.baseInfo.staticTypeList[newIndex])
    //   },
    //   immediate: true
    // }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
