<template>
  <div class="signfor-delivery-wrap">
    <header @click="goSearch">
      <FwSearch placeholder="运单号/收货人/发货人" isDisabled ></FwSearch>
      <div class="scan" @click.stop="scan"><img src="../../../assets/images/scan_icon.png" alt=""></div>
    </header>
    <div class="delivery-warp"  ref="deliveryWarp">
      <div class="content">
        <div v-for="(item,index) in signforData" :key="index" :slot="index" class="dataSource-item">
          <signforItem  :signforRecord="signforRecord" v-on:refresh="getSignRecordList" :signforArr='item'></signforItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
  import BScroll from 'better-scroll'
  import FwSearch from '@/components/public/fw-search'
  import signforItem from '@/components/common/signfor-item'
  import * as API from '@/http/common/api'
  import mixinUtils from '@/mixins/common/public.js'
  export default {
    name: 'deliverySignfor',
    mixins: [mixinUtils],
    components: {
      FwSearch,
      signforItem
    },
    data () {
      return {
        getSignData: {},
        signforData: [],
        signforRecord: '',
        userInfo: {},
        current: 1
      }
    },
    mounted () {
      this.userInfo = JSON.parse(window.localStorage.userInfo)
      this.getSignRecordList()
      this.initBetterScroll()
    },
    methods: {
      goSearch () {
        this.$router.push({path: '/searchSignfor', query: {page: 2, first: 1}})
      },
      getSignRecordList () {
        this.getSignData = {
          "companyId": this.userInfo.carrierGlobalId,
          "currentPage": this.current,
          "driverId": this.userInfo.driverId,
          "pageSize": 10
        }
        this.$http(API.GET_NOTSIGN_LIST, {type: 'POST', params: this.getSignData, withCredentials: true})
          .then(res => {
            this.__isSuccess(res, function (data) {
              if (data.result.totalNum / 10 >= this.getSignData.currentPage || data.result.totalNum < 10) {
                this.signforData = this.signforData.concat(data.result.list)
              }
              console.log('送货签收列表-----', this.signforData)
            }.bind(this))
          })
          .catch(err => {
            this.$toast.show('网络错误，请重试')
          })
      },
      initBetterScroll () {
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.deliveryWarp, {
            // 是否回弹效果
            bounce: false,
            // 是否可以点击
            click: true,
            // 为3时才可on scroll事件
            probeType: 3,
            pullUpLoad: {
              threshold: 20  // 当上拉到超过底部 70px 时，
            }
          })
          this.scroll.on('pullingUp', () => {
            this.current = this.current + 1
            this.getSignRecordList()
            this.scroll.finishPullUp()
            this.scroll.refresh()
          })
        })
      },
      scan () {
        this.$webViewTools.handleNativeFun(handleNativeFunNames.SCANORCODE, {'length': ''}).then(function (result) {
          let res = JSON.parse(result)
          window.alert(res.value)
          this.$router.push({path: '/searchSignfor',
            query: {
              'deliverCode': res.value,
              'page': 0
            }})
        }.bind(this))
      }
    }

  }
</script>
<style scoped  lang="less">
  .signfor-delivery-wrap{
    position: relative;
    display: flex;
    flex-direction: column;
    .delivery-warp{
      position: absolute;
      left: 0;
      top: 0;

      bottom: 0; //必须设置，可以固定这个盒子在从头部到浏览器底部的高度
      overflow: hidden;
      width: 100%;
      height: 100%;
      flex-grow: 1;
    }
    .content{
      padding-top: 100px;
    }
  }

  header{
    padding: 16px 28px;
    background: #f2f1f6;
    z-index: 2;
    position: relative;
    .fw-search{
      height: 60px;
      margin: 0;
      border-radius:8px;
      font-size: 28px;
    }
    .scan{
      position: absolute;
      right: 50px;
      top: 30px;
    }
  }
  .dataSource-item{
    border-bottom: 12px solid #f2f1f6;
  }
  .dataSource-item:last-child{
    border-bottom: none;
  }

</style>
<style>
  .fw-search{
    height: 60px!important;
    margin: 0;
    border-radius:8px;
    font-size: 28px;
  }
</style>
