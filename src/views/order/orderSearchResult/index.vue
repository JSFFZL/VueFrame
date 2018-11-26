<template>
  <div class="order-wrap order-search-result-wrap routerScrollWrapper" ref="routerScrollWrapper">
    <fw-start-end-date @getSearchTime="getSearchTime" v-if="isUseCustomTime"></fw-start-end-date>
    <scroll-wrapper 
      :data="searchDataList"
      @pulldown="pulldown"
      @scrollToEnd="scrollToEnd"
      :showResult="showResult"
      ref="scrollWrapper"
      >
      <order-item v-if="searchDataList.length" v-for="item in  searchDataList" :key="item.id" :wayBillData="item"></order-item>
    </scroll-wrapper>
  </div>
</template>
<script>
import OrderItem from '@/components/common/order-item'
import fwStartEndDate from '@/components/common/fw-start-end-date'
import scrollWrapper from '@/views/order/scrollWrapper'
import * as API from '@/http/common/api'
import mixinUtils from '@/mixins/common/public.js'
export default {
  name: "orderSearchResult",
  mixins: [mixinUtils],
  components: {
    OrderItem,
    fwStartEndDate,
    scrollWrapper
  },
  props: {
    // 是否需要知道搜索结果
    isNeedResultStatus: {
      type: Boolean,
      default: false
    },
    // 是否使用日期筛选
    isUseCustomTime: {
      type: Boolean,
      default: false
    },
    // 无数据时展示的文案
    noFindInfo: {
      type: String,
      default: '暂无数据'
    }
  },
  data () {
    return {
      searchDataList: [],
      beginTime: '',
      endTime: '',
      showResult: false,
      messager: '',
      // 当前页
      currentPage: 1,
      // 每页数据
      pageSize: 30
    };
  },
  mounted () {
    // this.searchData()
    
  },
  methods: {
    // 下拉刷新
    pulldown () {
      this.currentPage = 1
      this.searchData(this.messager, this.beginTime, this.endTime)
    },
    // 获取时间
    getSearchTime (params) {
      this.beginTime = params.startTime
      this.endTime = params.endTime
      this.showResult = false
      this.searchDataList = []
      this.currentPage = 1
      this.searchData()
      // 历史页选择时间时，滚动到顶部
      this.$refs.routerScrollWrapper.scrollTop = 0

    },
    // 搜索页面
    searchMessager (messager) {
      this.showResult = false
      this.searchDataList = []
      this.currentPage = 1
      this.searchData(messager)
      // 历史页选择时间时，滚动到顶部
      this.$refs.routerScrollWrapper.scrollTop = 0
    },
    // 上拉加载
    scrollToEnd () {
      this.searchData(this.messager, this.beginTime, this.endTime, true)
    },
    searchData (messager='', beginTime=this.beginTime, endTime=this.endTime, isPullUp=false) {
      this.messager = messager
      this.beginTime = beginTime
      this.endTime = endTime
      // if (this.currentPage === 1) {
      //   this.showResult = false
      //   this.searchDataList = []
      // } 
      let params = {
        invoiceOrgIds: JSON.parse(this.$localStorage.get("userInfo")).orgId,
        messager: messager,
        beginTime: beginTime,
        endTime: endTime,
        // 为了防止下拉加载请求失败还要处理各种情况页数-1，这里先临时加1
        currentPage: !isPullUp ? this.currentPage : this.currentPage + 1,
        pageSize: this.pageSize
      }
      this.$http(API.GET_WAY_BILL_LIST, {
        type: 'POST',
        params
      })
        .then(res => {
          this.__isSuccess(res, function (result) { // 成功
            if (this.currentPage > 1 || isPullUp) {
              this.searchDataList = this.searchDataList.concat(result.result.waybillList)
            } else {
              this.searchDataList = result.result.waybillList
            }
            if (result.result.waybillList.length > 0 && isPullUp) {
              // 上拉刷新获取到新数据后才加1
              this.currentPage += 1
            }
            let bottomTipText
            if (result.result.waybillList.length < this.pageSize ) {
              bottomTipText = "没有更多数据了"
            } else{
              bottomTipText = "查看更多"
            }
            setTimeout(() => {
              this.$refs.scrollWrapper.bottomTipText = bottomTipText
            }, 100);
          }.bind(this))
          this.showResult = true
          // if (res) {

          // }
        })
        .catch(err => {
          if (this.currentPage == 1) {
            this.searchDataList = []
          }
          console.log(err)
          this.showResult = true
          this.$toast.show('网络错误，请重试')
        })
    },
    // 通知父组件请求结果
    setParentResultStatus (value) {
      if (!this.isNeedResultStatus) return
      this.$emit('setResultStatus', value)
    }
  }
}
</script>
<style lang="less" scoped>
.order-search-result-wrap{
  height: 100%;
  z-index: -1;
}
</style>

