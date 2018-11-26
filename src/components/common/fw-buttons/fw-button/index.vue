<template>
  <div class="fw-btn" :class="classes" @click="setActived">
		<slot>{{ text }}</slot>
	</div>
</template>
<script>
export default {
	name: 'fw-button',
	props: {
		text: String,
		index: Number,
		lenth: Number,
		checkedIndex: Number
	},
	data () {
		return {
			isActived: false
		}
	},
	computed: {
		classes () {
			return [
				this.index === this.checkedIndex ? 'actived' : '',
				this.lenth === 1 ? 'left right' : this.index === 0 ? 'left' : this.index === this.lenth - 1 ? 'right' : 'middle'
			]
		}
	},
	methods: {
		setActived () {
			if (this.index !== this.checkedIndex ) {
				this.$emit('changeChecked', this.index)
			}
		}
	}
}
</script>
<style lang="less" scoped src="./index.less" scoped></style>
