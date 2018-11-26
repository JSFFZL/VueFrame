<template>
<div class="page-extract_search_result">
  <fw-task-list :dataSource="dataList" fullPage="100vh"></fw-task-list>
</div>
</template>

<script>
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
import * as API from '@/http/common/api'
import mixinUtils from '@/mixins/common/public.js'
import FwTaskList from '@/components/common/task-list'

export default {
  name: 'extractSearchResult',
  mixins: [mixinUtils],
  data () {
    return {
      dataList: []
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      // vm._getSearchResultData()
    })
  },
  mounted() {
    this.$webViewTools.registerGlobalFun(registerGlobalFunNames.GETORDERSEARCHINPUT, function (params) {
      if (!params.value) return
      this._getSearchResultData(params.value)
    }.bind(this))
  },
  components: {
    FwTaskList
  },
  methods: {
    _getSearchResultData (searchKey) {
      const userInfo = JSON.parse(this.$localStorage.get('userInfo'))
      let params = {
        dateStart: this.$route.query.startTime || null,
        dateEnd: this.$route.query.endTime || null,
        pageNumber: 1,
        pageSize: 20,
        generalField: searchKey, // 搜索字段
        userId: userInfo.id,
        status: this.$route.query.from || null
      }

      this.$http(API.GET_TASK_LIST, {
        type: 'POST',
        params
      })
      .then(res => {
        this.__isSuccess(res, function (result) {
          this.dataList = result.result.dtoList
          console.log(result.result.dtoList)
        }.bind(this))
      })
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
