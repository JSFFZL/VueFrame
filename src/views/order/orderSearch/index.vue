<template>
  <div class="order-wrap order-search-wrap">
    <!-- <fw-search placeholder="运单号/收货人/发货人/手机" v-model="value" @keyup.native.enter="searchData(value)"></fw-search> -->
    <div v-show="messager" class="order-search-result-wrap"> 
      <order-search-result ref="orderSearchResult" noFindInfo="没有找到相关内容"></order-search-result>
    </div>
    <div v-if="!messager" class="order-search-history-wrap">
      <order-cell>
        <span slot="left">历史记录</span>
        <span slot="right">
          <span class="del-search-history" @click="delSearchHistory"></span>
        </span>
      </order-cell>
      <div class="search-history-list">
        <div class="search-history-item" v-for="(item, index) in searchHistoryList" :key="index" @click="searchData(item.value, true)">
          {{item.value}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import orderCell from '@/components/common/order-cell'
import orderSearchResult  from '@/views/order/orderSearchResult'
import Vue from "vue"
import FwSearch from '@/components/public/fw-search'
import  { ConfirmPlugin } from 'vux'
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
Vue.use(ConfirmPlugin)
export default {
  name: "orderSearch",
  components: {
    orderCell,
    orderSearchResult,
    FwSearch
  },
  data () {
    return {
      searchDataList: [],
      beginTime: '',
      endTime: '',
      messager: '',
      searchHistoryList: [],
      value: ''
    };
  },
  watch: {
    value () {
      if (!this.value) this.messager = ''
    }
  },
  mounted () {
    // let searchHistoryList = [
    //   {
    //     value: '5305'
    //   },
    //   {
    //     value: '15809891021'
    //   },
    //   {
    //     value: '15910663340'
    //   },
    //   {
    //     value: '我是搜索记录我是搜索记录'
    //   }
    // ]
     // let stringResult = JSON.stringify(searchHistoryList)
    // this.$localStorage.set("searchHistoryList", stringResult)
    // 注册输入框监听事件
    let that = this
    this.$webViewTools.registerGlobalFun(registerGlobalFunNames.GETORDERSEARCHINPUT, function (params) {
      // if (!params) {
      //   params = ''
      // } else {
      //   params += ''
      // }
      // console.log(params)
      // params = JSON.parse(params)
      that.searchData(params.value)
    })
    if (!this.$localStorage.get("searchHistoryList")) {
      this.$localStorage.set("searchHistoryList", "[]")
    }
    let arrayResult = JSON.parse(this.$localStorage.get("searchHistoryList"))
    this.searchHistoryList = arrayResult
  },
  methods: {
    setHistoryList (value) {
      if (!this.$localStorage.get("searchHistoryList")) {
        this.$localStorage.set("searchHistoryList", "[]")
      }
      let arrayResult = JSON.parse(this.$localStorage.get("searchHistoryList"))
      let isForward = false
      // 如果历史记录有数据，将这个数据提前
      arrayResult.forEach((item, index) => {
        if (item.value === value) {
          let temp = arrayResult.splice(index, 1)
          arrayResult.unshift(...temp)
          isForward = true
        }
      })
      let tempObejct = {
        value: value
      }
      if (arrayResult.length > 5 &&!isForward) {
        // 大于6时，删除最后一个，头部加入最新的
        arrayResult.pop()
        arrayResult.unshift(tempObejct)
      } else if(!isForward) {
        // 小于6个时，头部加入最新的
        arrayResult.unshift(tempObejct)
      }
      this.$localStorage.set("searchHistoryList", JSON.stringify(arrayResult))
      this.searchHistoryList = arrayResult
    },
    searchData (value, ONHISTORYTAGCLICK = false) {
      if (ONHISTORYTAGCLICK) {
        this.$webViewTools.handleNativeFun(handleNativeFunNames.ONHISTORYTAGCLICK, {"value": value})
      }
      if (!value) {
        this.messager = ''
        this.value = value
        return
      }
      this.messager = value
      this.value = value
      this.setHistoryList(value)
      this.$refs.orderSearchResult.searchMessager(value)
    },
    delSearchHistory () {
      const _this = this
      this.$vux.confirm.show({
        content: '确定删除全部历史记录？',
        // 组件除show外的属性
        onCancel () {
          
        },
        onConfirm () {
          _this.$localStorage.clearitem("searchHistoryList")
          _this.searchHistoryList = []
          _this.$toast.show('历史记录已清除')
          _this.$webViewTools.handleNativeFun(handleNativeFunNames.ONHISTORYTAGCLICK, {"value": ''})
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.order-search-wrap{
  position: relative;
  .order-search-result-wrap{
    height: 100%;
  }
  .order-cell{
    font-size: 32px;
    color: #333333;
    .del-search-history{
      display: inline-block;
      width: 32px;
      height: 32px;
      background: url(../../../assets/images/clear_icon.png);
      background-size: cover;
      position: absolute;
      right: 0;
      top: 28px;
    }
  }
  .order-search-history-wrap{
    height: 100%;
    background: #fff;
    .search-history-list{
      .search-history-item{
        display: inline-block;
        color: #666666;
        height: 60px;
        line-height: 60px;
        background: #F2F1F6;
        border-radius: 24px;
        padding: 0 20px;
        margin: 28px 0 0 28px;
      }
    }
  }
  
}
</style>
<style lang="less">
.weui-dialog{
  max-width: 80%!important;
  width: 80%!important;
}
.weui-dialog{
  border-radius: 12px;
  width: 72%;
}
.weui-dialog__bd:first-child{
  color: #030303;
}
.weui-dialog__ft{
  font-size: 16px;
}
.weui-dialog__btn_default{
  color:#666 ;
}
.weui-dialog__btn_primary{
  color: #317CC3;
}
</style>
