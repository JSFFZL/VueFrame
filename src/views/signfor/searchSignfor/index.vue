<template>
  <div class="signfor-delivery-wrap" >
    <div class="delivery-warp" ref="deliveryWarp">
      <div class="content" v-show="fruitless">
        <div v-for="(item,index) in signforData" :key="index" :slot="index" class="dataSource-item">
          <signforItem :signforRecord="signforRecord" :signforArr="signforData[index]"></signforItem>
        </div>
      </div>
      <div v-show="!fruitless" class="fruitless">
        <div><img src="../../../assets/images/noinfo_icon.png" alt=""></div>
        <div>没有找到相关内容</div>
      </div>
    </div>
  </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import FwSearch from '@/components/public/fw-search'
    import signforItem from '@/components/common/signfor-item'
    import * as API from '@/http/common/api'
    import mixinUtils from '@/mixins/common/public.js'
    import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
    import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
    export default {
      name: 'searchSignfor',
      mixins: [mixinUtils],
      components: {
        signforItem,
        FwSearch
      },
      data () {
        return {
          _answer: '',
          inputValue: '',
          signforRecord: '',
          signforData: [],
          userInfo: '',
          fruitless: true,
          firstEnter: false,
          currentPage: 1,
          like: {
            value: ''
          },
          IsScan: false
        }
      },
      created () {
        if (this.$route.query.first) {
          if (this.$route.query.page == 2) {
            this.getDeliveryList()
          } else {
            this.getSignRecordList()
          }
        }
      },
      mounted () {
        this.userInfo = JSON.parse(window.localStorage.userInfo)
        this.getRouterData()
        this.initBetterScroll()
        this.signforData = []
        this.IsScan = false
        this.like.value = ''

        if (this.$route.query.deliverCode) {
          this.IsScan = true
          this.like.value = this.$route.query.deliverCode
          this.getDeliveryList()
        }
        if (this.$route.query.code) {
          this.IsScan = true
          this.like.value = this.$route.query.code
          this.getSignRecordList()
        }
        this.$webViewTools.registerGlobalFun(registerGlobalFunNames.GETORDERSEARCHINPUT, function (params) {
          if (!params.value) return
          this.like.value = params.value
          this.signforData = []
          if (this.$route.query.page == 2) {
            this.getDeliveryList()
          } else {
            this.getSignRecordList()
          }
        }.bind(this))
      },
      methods: {
        getRouterData () {
          if (this.$route.query.page) {
            if (this.$route.query.page == 2) {
              this.signforRecord = ''
            } else {
              this.signforRecord = 'signforRecord'
            }
          } else {
            console.log(this.$route.query.page)
            this.signforRecord = 'signforRecord'
          }
        },
        // 搜索签收记录
        getSignRecordList () {
          let signData = {
            'companyId': this.userInfo.carrierGlobalId,
            'userId': this.userInfo.id,
            'pageSize': 10,
            'currentPage': this.currentPage,
            'like': this.like.value
          }
          this.$http(API.SIGN_RECOURD_LIST, {type: 'POST', params: signData, withCredentials: true})
            .then(res => {
              this.__isSuccess(res, function (data) {
                this.signforData = this.signforData.concat(data.result.list)
                if (this.IsScan && this.signforData.length == 1) {
                  this.$router.push({path: '/detailsSignfor',
                    query: {
                      'dispatcherDetailId': this.signforData[0].dispatcherDetailId,
                      'pageIndex': 0
                    }})
                }
                console.log('送货签收列表-----', this.signforData)
                if (this.signforData.length == 0) {
                  this.fruitless = false
                } else {
                  this.fruitless = true
                  this.firstEnter =true
                }
              }.bind(this))
            })
            .catch(err => {
              console.log(err)
              this.$toast.show('网络错误，请重试')
            })
        },
        getDeliveryList () {
          let deliverySignData = {
            "companyId": this.userInfo.carrierGlobalId,
            "currentPage": this.currentPage,
            "driverId": this.userInfo.driverId,
            "like": this.like.value,
            "pageSize": 10
          }
          this.$http(API.GET_NOTSIGN_LIST, {type: 'POST', params: deliverySignData, withCredentials: true})
            .then(res => {
              this.__isSuccess(res, function (data) {
                this.signforData = this.signforData.concat(data.result.list)
                if (this.IsScan && this.signforData.length == 0) {
                  this.$toast.show('查不到此运单')
                }
                if (this.IsScan && this.signforData.length == 1) {
                  this.$router.push({path: '/detailsSignfor',
                    query: {
                      'dispatcherDetailId':this.signforData[0].dispatcherDetailId,
                      'pageIndex': 1
                    }})
                }
                console.log('送货签收列表-----', this.signforData)
                if (this.signforData.length == 0) {
                  this.fruitless = false
                } else {
                  this.fruitless = true
                  this.firstEnter =true
                }
              }.bind(this))
            })
            .catch(err => {
              console.log(err)
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
            // tab滚动结束，isClickTabScroll改为false
            this.scroll.on('scrollEnd' ,() => {
              this.isClickTabScroll = false
            })
            this.scroll.on('pullingUp', () => {
              this.currentPage = this.currentPage + 1
              if (this.$route.query.page == 1) {
                this.getSignRecordList()
              } else {
                this.getDeliveryList()
              }
              this.scroll.finishPullUp()
              this.scroll.refresh()
            })
          })
        }
      },
      watch: {

      }
    }
</script>
<style lang="less" scoped src="./index.less"></style>


