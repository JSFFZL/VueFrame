<template>
  <div class="signAll_wrap">
    <div v-for="(item,index) in signforData" :key="index" :slot="index" class="dataSource-item">
      <signforItem v-on:refresh="getSignRecordList" :signforRecord="signforRecord" :signforArr='item'></signforItem>
    </div>
  </div>
</template>

<script>
  import signforItem from '@/components/common/signfor-item'
  import * as API from '@/http/common/api'
  import mixinUtils from '@/mixins/common/public.js'
  export default {
    name: 'signRefusal',
    mixins: [mixinUtils],
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        console.log('signRefusal')
      })
    },
    components: {
      signforItem
    },
    data () {
      return {
        signforData: []
      }
    },
    mounted () {
      this.userInfo = JSON.parse(window.localStorage.userInfo)
      this.getSignRecordList()
    },
    methods: {
      // 签收记录接口查询【全部签收】【部分签收】【全部拒签】
      getSignRecordList () {
        let signData = {
          'companyId': this.userInfo.carrierGlobalId,
          'userId': this.userInfo.id,
          'pageSize': 500,
          'currentPage': 1,
          'signStatus': 3
        }
        this.$http(API.SIGN_RECOURD_LIST, {type: 'POST', params: signData, withCredentials: true})
          .then(res => {
            console.log(res)
            this.__isSuccess(res, function (data) {
              this.signforData = data.result.list
              console.log('全部签收====', this.signforData)
            }.bind(this))
          })
          .catch(err => {
            console.log(err)
            this.$toast.show('网络错误，请重试')
          })
      },
    }
  }
</script>
<style lang="less" scoped src="./index.less"></style>
