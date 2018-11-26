<template>
    <div class="signforAll-wrap">
      <div v-for="(item,index) in signforData" :key="index" :slot="index" class="dataSource-item">
        <signforItem v-on:refresh="getSignRecordList" :signforArr='signforData[index]'></signforItem>
      </div>
    </div>
</template>

<script>
  import tabSwiper from '@/components/common/tab-swiper'
  import FwSearch from '@/components/public/fw-search'
  import signforItem from '@/components/common/signfor-item'
  import * as API from '@/http/common/api'
  import mixinUtils from '@/mixins/common/public.js'
  export default {
    name: 'demo3',
    mixins: [mixinUtils],
    components: {
      FwSearch,
      tabSwiper,
      signforItem
    },
    data () {
      return {
        signforData: [],           //  签收数组
        signData: {
          'companyId': '11111111111111',
          'driverId': '',
          'pageSize': 10,
          'currentPage': 1,
          'signStatus': 1      // 签收状态【1：全部签收、2：部分签收、1：全部拒签、5：派送失败】
        }
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next((vm) => {
        vm.$nextTick(() => {
          vm.getSignRecordList()
        })
      })
    },
    methods: {
      // 签收记录接口查询【全部签收】【部分签收】【全部拒签】
      getSignRecordList () {
        this.$http(API.SIGN_RECOURD_LIST, {type: 'POST', params: this.signData, withCredentials: true})
          .then(res => {
            this.__isSuccess(res, function (data) {
              this.signforData = data.result.list
            }.bind(this))
          })
          .catch(err => {
            console.log(err)
          })
      },
      tabIndex (val) {
        this.signData.signStatus = val.idx + 1
        this.getSignRecordList()
      }
    }
  }
</script>
