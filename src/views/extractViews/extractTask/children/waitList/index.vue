<template>
<div class="page-wait_list">
  <fw-task-list :dataSource="dataList"></fw-task-list>
</div>
</template>

<script>
/**
 * @class 待接单
*/
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
import * as API from '@/http/common/api'
import FwTaskList from '@/components/common/task-list'
import mixinUtils from '@/mixins/common/public.js'

export default {
  name: 'pageWaitList',
  mixins: [mixinUtils],
  data () {
    return {
      dataList: []
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      // 获取任务列表数据
      vm._getTaskListData()
    })
  },
  components: {
    FwTaskList
  },
  methods: {
    // 获取当天待接单列表
    _getTaskListData () {
      const userInfo = JSON.parse(this.$localStorage.get('userInfo'))
      let startTime = +new Date(new Date(new Date().toLocaleDateString()).getTime()); // 当天0点
      let endTime = +new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 -1)  // 当天23.59点

      let params = {
        // 1541347200000 近七天
        dateStart: startTime,
        dateEnd: endTime,
        pageNumber: 1,
        pageSize: 20,
        userId: userInfo.id,
        status: 6 // 6 未接单 3 未提货
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
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
