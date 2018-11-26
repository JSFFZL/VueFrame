<template>
<div class="page-extract">
  <tab-swiper
    :dataSource="list"
  >
  <div class="page-extract_search" slot="search">
    <fw-search-static textInfo="请输入订单号/发货人手机号/地址" @handleSearch="search"></fw-search-static>
  </div>
  </tab-swiper>
</div>
</template>

<script>
import TabSwiper from '@/components/common/tab-swiper'
import FwSearchStatic from '@/components/public/fw-search-static'

export default {
  name: 'pageExtractTask',
  data () {
    return {
      searchStatus: 3, // 搜索状态
      list: [
        {
          name: '待接单',
          routerPath: '/extractTask/list',
          routerViewName: 'task-view_'
        },
        {
          name: '待提货',
          routerPath: '/extractTask/extract',
          routerViewName: 'task-view_'
        }
      ]
    }
  },
  components: {
    TabSwiper,
    FwSearchStatic
  },
  methods: {
    search () {
      let startTime = +new Date(new Date(new Date().toLocaleDateString()).getTime()); // 当天0点
      let endTime = +new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 -1)  // 当天23.59点

      // 跳转搜索结果页
      this.$router.push(`/extractSearchResult?from=${this.searchStatus}&startTime=${startTime}&endTime=${endTime}`)
    }
  },
  watch: {
    '$route': {
      handler: function (to, from, next) {
         this.searchStatus = to.meta.index === 0 ? 6 : 3
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
