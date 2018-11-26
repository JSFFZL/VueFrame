<template>
<div class="page-target_dot">
  <fw-search
    placeholder="请输入查询网点"
    v-model="searchKey"
  ></fw-search>
  <div class="page-target_result">

    <!-- 无数据 start -->
    <fw-no-find info="未找到目的网点，可尝试修改够重试" v-show="dotList.length === 0"></fw-no-find>
    <!-- 无数据 end -->

    <!-- 有数据 start -->
    <div class="page-target_result_data" v-show="dotList.length > 0">
      <ul class="page-target_result_list">
      <li class="page-target_result_item" v-for="(item, index) in dotList" :key="index" @click="selectedItem(item)">{{item.networkName}}</li>
    </ul>
    </div>
    <!-- 有数据 end -->
  </div>
</div>
</template>

<script>
/**
 * @class 目的地网点页
*/

import * as API from '@/http/common/api'
import * as mutationTypes from '@/vuex/mutations/types'
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
import FwSearch from '@/components/public/fw-search'
import FwNoFind from '@/components/public/fw-nofind'
// 继承 mixins
import mixinUtils from '@/mixins/common/public.js'

export default {
  name: 'pageTargetDot',
  mixins: [mixinUtils],
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.targetData = to.params.targetData
      vm._initData()
    })
  },
  data() {
    return {
      targetData: [], // 目的地Id列表  省市区街道id 最少2级
      dotList: [], // 网点列表
      searchKey: ''
    }
  },
  components: {
    FwSearch,
    FwNoFind
  },
  methods: {
    ...mapMutations('openBill', {
      _setDot: mutationTypes.SET_DOT
    }),
    _initData() {
      // 集团ID
      let {groupId} = JSON.parse(this.$localStorage.get('userInfo'))
      const params = {
        groupId: groupId,
        provCode: this.targetData[0] ? this.targetData[0].id : '',
        cityCode: this.targetData[1] ? this.targetData[1].id : '',
        disCode: this.targetData[2] ? this.targetData[2].id : '',
        streetCode: this.targetData[3] ? this.targetData[3].id : ''
      }
      // 根据目的地ID 获取目的网点
      this.$http(API.GET_TARGET_DOT, {
        type: 'POST',
        params
      })
        .then(res => {
          this.__isSuccess(res, function (result) { // 成功
            this.dotList = result.result
          }.bind(this))
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查询接口
    _searchData(key) {
      // 集团ID
      let {groupId} = JSON.parse(this.$localStorage.get('userInfo'))
      const params = {
        groupId: groupId,
        provCode: this.targetData[0] ? this.targetData[0].id : '',
        cityCode: this.targetData[1] ? this.targetData[1].id : '',
        disCode: this.targetData[2] ? this.targetData[2].id : '',
        netWorkName: key
      }
      this.$http(API.SEARCH_TARGET_DOT, {
        type: 'POST',
        params
      })
        .then(res => {
          this.__isSuccess(res, function (result) { // 成功
            console.log(result)
            this.dotList = result.result
          }.bind(this))
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择网点
    selectedItem(item) {
      this._setDot(item)
      this.$router.go(-1)
    }
  },
  watch: {
    // 搜索
    searchKey(newValue) {
      console.log('获取搜索值:', newValue)
      this._searchData(newValue)
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
