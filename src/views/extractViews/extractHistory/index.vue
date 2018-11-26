<template>
<div class="page-extract_history">
  <fw-search-static v-show="dataList.length > 0" textInfo="请输入订单号/发货人手机号/地址" @handleSearch="search"></fw-search-static>
  <div class="extract-history_search">
    <fw-task-list :dataSource="dataList" fullPage="100vh"></fw-task-list>
  </div>
  <fw-start-end-date @getSearchTime="getSearchTime"></fw-start-end-date>
</div>
</template>

<script>
/**
 * @class 历史记录页
*/
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
import * as API from '@/http/common/api'
import FwTaskList from '@/components/common/task-list'
import FwSearchStatic from '@/components/public/fw-search-static'
import fwStartEndDate from '@/components/common/fw-start-end-date'
import mixinUtils from '@/mixins/common/public.js'

export default {
  name: 'pageEextractHistory',
  mixins: [mixinUtils],
  data() {
    return {
      dataList: [],
      startTime: null,
      endTime: null
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm._getTaskListData(vm.startTime, vm.endTime)
    })
  },
  components: {
    FwTaskList,
    FwSearchStatic,
    fwStartEndDate
  },
  methods: {
    _getTaskListData (startTime, endTime) {
      const userInfo = JSON.parse(this.$localStorage.get('userInfo'))
      let params = {
        dateStart: startTime,
        dateEnd: endTime,
        pageNumber: 1,
        pageSize: 20,
        userId: userInfo.id,
      }

      this.$http(API.GET_TASK_LIST, {
        type: 'POST',
        params
      })
      .then(res => {
        this.__isSuccess(res, function (result) {
          this.dataList = result.result.dtoList
        }.bind(this))
      })
    },
    getSearchTime(params) {
      this.startTime = params.startTime
      this.endTime = params.endTime
      let currentYear =  new Date(this.startTime).getFullYear()
      let currentMonth =  new Date(this.startTime).getMonth() + 1
      let currentDate =  new Date(this.startTime).getDate()
      let currentHours =  new Date(this.startTime).getHours()
      let currentMinutes =  new Date(this.startTime).getMinutes()
      this._getTaskListData(this.startTime, this.endTime)
    },
    search() {
      // 跳转搜索结果页
      this.$router.push('/extractSearchResult')
    }
  }
}

</script>
<style lang="less" src="./index.less" scoped></style>
