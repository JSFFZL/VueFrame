<template>
    <div class="signforAll-wrap" ref="deliveryWarp" >
      <tabSwiper :dataSource="dataSource"   v-on:tabindex="tabIndex"   >
        <div slot="search" class="order-history" @click.stop.prevent="showAppSearch">
          <div class="order-search-wrap">
            <FwSearch placeholder="运单号/收货人/发货人" :isDisabled="isDisabled"></FwSearch>
            <div class="scan" @click.stop="scan"><img src="../../../assets/images/scan_icon.png" alt=""></div>
          </div>
        </div>
      </tabSwiper>
    </div>
</template>

<script>
  import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
  import BScroll from 'better-scroll'
  import tabSwiper from '@/components/common/tab-swiper'
  import FwSearch from '@/components/public/fw-search'
  import signforItem from '@/components/common/signfor-item'
  import * as API from '@/http/common/api'
  import mixinUtils from '@/mixins/common/public.js'
  export default {
    name: 'signforALL',
    mixins: [mixinUtils],   
    components: {
      FwSearch,
      tabSwiper,
      signforItem
    },
    data () {
      return {
        idx: 0,
        isDisabled: true,
        signforRecord: 'qqqq0',
        dataSource: [
          {
            name: '全部签收',
            routerPath: '/signforAll/signAll',
            routerViewName: 'sign-view_'
          },
          {
            name: '部分签收',
            routerPath: '/signforAll/signPortion',
            routerViewName: 'sign-view_'
          },
          {
            name: '全部拒签',
            routerPath: '/signforAll/signRefusal',
            routerViewName: 'sign-view_'
          }
        ],
        signforData: [],           //  签收数组
      }
    },
    mounted () {
    },
    methods: {
      // 跳转搜索
      showAppSearch () {
        this.$router.push({path: '/searchSignfor', query: {page: 1, first: 1}})
      },
      tabIndex (val) {
        console.log(val)
        this.signData.signStatus = val.idx + 1
      },
      scan () {
        this.$webViewTools.handleNativeFun(handleNativeFunNames.SCANORCODE, {'length': ''}).then(function (result) {
          let res = JSON.parse(result)
          this.$router.push({path: '/searchSignfor',
            query: {
              'code': res.value,
              'page': 1
            }})
        }.bind(this))
      }
    }
  }
</script>
<style lang="less" scoped src="./index.less"></style>
<style>
  .fw-tab{
    background: #fff;
  }
</style>
