<template>
  <div class="fw-btns">
    <fw-button
      v-for="(item, index) in items"
      :index="index"
      :lenth="items.length"
      :checkedIndex="checkedIndex"
      @changeChecked="changeChecked"
      :key="item.itemCode">
      {{item.itemName}}
    </fw-button>
	</div>
</template>
<script>
/**
 * @param {Array} items 按钮组 [{name: '自提',value: 1},{name: '送货',value: 2}]
 * @param {Number} checkedIndex 双向绑定 当前选中的按钮索引，根据索引获取
*/
import FwButton from '@/components/common/fw-buttons/fw-button'
export default {
  name: 'fw-buttons',
  components: {
    FwButton
  },
	props: {
    items: {
      type: Array,
      required: true
    },
    checkedIndex: {
      type: Number,
      required: true
    }
  },
	methods: {
    // 传递选中的按钮索引到父组件
		changeChecked (index) {
      // handle sync
      this.$emit('update:checkedIndex', index)
    }
	}
}
</script>
<style lang="less" scoped>
  .fw-btns {
    width: 170px;
  }
</style>
