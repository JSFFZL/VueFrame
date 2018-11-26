<template>
  <div class="order-wrap">
    <div class="order-detail-send-more" v-if="isShowResult">
      <order-cell>
        <span slot="left">回单要求</span>
        <span slot="right">{{wayBillData.backType}}</span>
      </order-cell>
      <order-cell>
        <span slot="left">回单编号</span>
        <span slot="right">{{wayBillData.backCode}}</span>
      </order-cell>
      <order-cell isBottomCell>
        <span slot="left">回单份数</span>
        <span slot="right">{{wayBillData.backNum?`${wayBillData.backNum}&nbsp;份`:''}}</span>
      </order-cell>
      <div class="cells-space"></div>
      <order-cell>
        <span slot="left">特殊要求</span>
        <span slot="right">{{wayBillData.specialRequire}}</span>
      </order-cell>
      <order-cell isBottomCell class="other-require-box">
        <span slot="left">其他要求</span>
        <span slot="right" class="other-require-list">
          <span v-if="wayBillData.iwaitNotice">等通知</span
          ><span v-if="wayBillData.ibill">开票</span
          ><span v-if="wayBillData.itruckLoad">整车</span
          ><span v-if="wayBillData.iemergency">加急</span
          ><span v-if="wayBillData.intoWarehouse">入仓</span
          ><span v-if="wayBillData.unLoaded">卸货</span
          ><span v-if="wayBillData.upStairs">上楼</span
          ><span v-if="wayBillData.noticeChianCustoms">报关</span>
        </span>
      </order-cell>
      <div class="cells-space"></div>
      <order-cell isBottomCell>
        <span slot="left">备注</span>
        <span slot="right">{{wayBillData.remark}}</span>
      </order-cell>
    </div>

  </div>
</template>
<script>
import orderCell from '@/components/common/order-cell'
import * as API from '@/http/common/api'
import mixinUtils from '@/mixins/common/public.js'
export default {
  name: "orderDetailSendMore",
  mixins: [mixinUtils],
  components: {
    orderCell
  },
  data () {
    return {
      wayBillData: {},
      isShowResult: false
    }
  },
  mounted() {
    this.getWatBillDetail(this.$route.params.id)
  },
  methods: {
    getWatBillDetail (id) {
      this.$http(`${API.GET_WAY_BILL_DETAIL}/${id}`, {
        type: 'GET'
      })
        .then(res => {
          this.__isSuccess(res, function (result) { // 成功
            this.wayBillData = result.result
            this.isShowResult = true
          }.bind(this))
          // if (res && res.status && res.status.statusCode === 0) {
          //   this.wayBillData = res.result
          //   this.isShowResult = true
          // } else {
          //   this.$toast.show('请求错误，请重试')
          // }
        })
        .catch(err => {
          console.log(err)
          this.isShowResult = true
          this.$toast.show('网络错误，请重试')
        })
    }
  }
}
</script>
<style lang="less" src="@/less/common/order.less"></style>
<style lang="less" scoped>
.order-detail-send-more{
  background: #fff;
  .cells-space{
    height: 16px;
    width: 100%;
    background: #f1f2f6;
  }
}
</style>
