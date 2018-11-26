
<template>
  <div class="fw-start-end-date-wrapper">
    <!-- <div @click="triggerCustomDate()" style="text-align: center; line-height: 50px;">选择时间{{isShowPopup}}</div> -->
    <!-- v-transfer-dom 解决ios fixed样式问题 -->
    <div v-transfer-dom class="fw-start-end-date-wrapper-popup">
      <popup v-model="isShowPopup" position="top" :hide-on-blur="false">
        <div class="items">
          <div class="item" :class="{actived : curTimeItemValue === 1}" @click="changeTime(1)">今天</div>
          <div class="item" :class="{actived : curTimeItemValue === -1}" @click="changeTime(-1)">昨天</div>
          <div class="item" :class="{actived : curTimeItemValue === 7}" @click="changeTime(7)">最近7天</div>
          <div class="item" :class="{actived : curTimeItemValue === 30}" @click="changeTime(30)">最近30天</div>
          <div class="item last-item" :class="{actived : curTimeItemValue === 'custom'}"  @click="changeTime('custom')">自定义时间<span>{{curTimeItemValue === 'custom' ? resultTime : ''}}</span></div>
        </div>
      </popup>
      <div class="fwStartEndDate-mask" v-show="isShowCustom"></div>
      <div class="no-fw-start-end-date-data"  v-show="isShowCustom">
        <div class="inline-loading_wrap">
          <div class="inline-loading_content"></div>
        </div>
      </div>
    <!-- 自定义顶部 -->
      <header class="fw-start-end-date-header" v-if="isShowCustom">
        <div class="top-box">
          <div class="cancle" @click="cancle">
            取消
          </div>
          <div class="intro">
            自定义时间
          </div>
          <div class="confim" @click="confimTime()">
            确定
          </div>
        </div>
        <div class="bottom-box">
          <tab>
            <tab-item selected @on-item-click="changeTimeType('startTime')">开始：{{startTime ? startTime : '---- -- --'}}</tab-item>
            <tab-item  @on-item-click="changeTimeType('endTime')">结束：{{endTime ? endTime : '---- -- --'}}</tab-item>
          </tab>
        </div>
      </header>
    </div>
    <!-- <div class="fw-selected-item"></div> -->
    <group>
      <datetime
        ref="fwStartEndDate"
        v-model="value"
        format="YYYY-MM-DD"
        @on-change="change"
        year-row="{value}年"
        month-row="{value}月"
        day-row="{value}日"
        :show="isShowCustom"
        v-if="isShowCustom"
        >
        <span></span>
      </datetime>
    </group>
  </div>
</template>
<script>
import { Group, Tab, TabItem, Popup ,TransferDom} from 'vux'
import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
import Datetime from '@/components/common/vux-datetime/index.vue'
import dateFormat from '../vux-datetime/dateFormat'

export default {
  name: "fwStartEndDate",
  components: {
    Datetime,
    Group,
    Tab,
    TabItem,
    Popup
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      value: '',
      startTime: '',
      endTime: '',
      timeType: 'startTime',
      // 底部自定义日期选择
      isShowCustom: false,
      resultTime: '',
      loadding: false,
      // 顶部日期选中
      isShowPopup: false,
      // 默认选中最近7天
      curTimeItemValue: 7,
      // 当前日期
      todayDate: ''
    }
  },
  mounted () {
    // 注册调起筛选时间事件
    let that = this
    this.$webViewTools.registerGlobalFun(registerGlobalFunNames.TRIGGERCUSTOMDATE, function (params) {
      that.isShowPopup = true
    })
    // 获取当前日期
    this.todayDate = this.startTime = dateFormat(new Date(), 'YYYY-MM-DD')
    this.endTime = this.startTime
    this.getSearchTime(7)
  },
  methods: {
    triggerCustomDate () {
      window.triggerCustomDate()
    },
    changeTime (value) {
      this.curTimeItemValue = value
      this.isShowPopup = false
      if (value === 'custom') {
        this.showCustomDate()
      } else {
        this.getSearchTime(value)
      }
    },
    getSearchTime (value) {
      let startTime, endTime, todayDate
      if (value === 'custom') {
        startTime = new Date(this.startTime + 'T00:00:00').getTime()
        endTime = new Date(this.endTime + 'T00:00:00').getTime() + 24*60*60*1000 - 1
      } else if (value > 0){
        endTime = new Date(this.todayDate + 'T00:00:00').getTime() + 24*60*60*1000 - 1
        startTime = endTime - 24*60*60*1000*value + 1
      } else{
        endTime = new Date(this.todayDate + 'T00:00:00').getTime() - 1
        startTime = endTime - 24*60*60*1000 + 1
      }
      let params = {
        startTime: startTime,
        endTime: endTime
      }
      this.$emit('getSearchTime', params)
      let result
      switch (value + '') {
        case '1':
          result = '今天'
          break
        case '-1':
          result = '昨天'
          break
        case '7':
          result = '最近7天'
          break
        case '30':
          result = '最近30天'
          break
        default:
          result = '自定义'
      }
      this.$webViewTools.handleNativeFun(handleNativeFunNames.ONORDERDATALIMIT, {"value": result})
    },
    change (value) {
      if (this.timeType === 'startTime') {
        this.startTime = value
      } else {
        this.endTime = value
      }
    },
    // 日期组件
    changeTimeType (type) {
      if (this.timeType === type) return
      this.timeType = type
      // this.loadding = true
      // this.$loading.show({text: ''})
      if (this.timeType === 'startTime') {
        this.value = this.startTime
      } else {
        this.value = this.endTime
      }
      // 重新渲染日期组件
      this.$refs.fwStartEndDate.fwRender()
      setTimeout(() => {
        // this.loadding = false
        // this.$loading.hide()
      }, 10);
    },
    cancle () {
      this.isShowCustom = false
      if (!this.resultTime) {
        this.isShowPopup = true
      }
    },
    showCustomDate () {
      this.resultTime = ''
      this.timeType = 'startTime'
      this.value = this.startTime
      this.isShowCustom = true
    },
    confimTime () {
      let start = new Date(this.startTime).getTime()
      let end =  new Date(this.endTime).getTime()
      if (start > end) {
        this.$toast.show('结束时间不可早于开始时间')
        return
      }
      this.resultTime =' (' + this.startTime + ' 至 ' + this.endTime + ')'
      this.isShowCustom = false
      this.getSearchTime('custom')
    }
  }
}
</script>
<style lang="less">
.fw-start-end-date-wrapper{
  .vux-no-group-title{
    margin-top: 0;
  }
}
.fwStartEndDate-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  opacity: 0.3;
  background-color: #000;
  z-index: 99;
}
.no-fw-start-end-date-data{
  position: fixed;
  width: 100%;
  height: 92px*4;
  bottom: 0;
  background-color: #fff;
  z-index: 99;
  .inline-loading_wrap {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    font-size: 24px;
    .inline-loading_content {
      width: 70px;
      height: 70px;
      margin-right: -10px;
      background: url("../../../assets/images/inline-loading-icon.gif") no-repeat center center;
      background-size: cover;
    }
  }
}
.fw-start-end-date-header{
  position: fixed;
  width: 100%;
  height: 183px;
  background: white;
  z-index: 101;
  bottom: 180.5px*2;
  .top-box{
    height: 89px;
    line-height: 89px;
    display: flex;
    font-size: 32px;
    justify-content: space-between;
    border-bottom: 1px solid #F2F1F6;
    .cancle{
      padding-left: 28px;
      text-align: left;
    }
    .intro{
     color: #999999;
     font-size: 28px;
    }
    .confim{
      text-align: right;
      padding-right: 28px;
      color: #317CC3;
    }
  }
  .bottom-box{
    color: #999999;
    font-size: 28px;
    .vux-tab-ink-bar {
      background-image: linear-gradient(-55deg, #CAA5FF 0%, #4F8FFF 100%);
    }
    .vux-tab .vux-tab-item.vux-tab-selected{
      color: #333333;
    }
    .selected-item {
      width: 100%;
      height: 136px;
    }
  }
}
.v-transfer-dom.fw-start-end-date-wrapper-popup{
  .vux-popup-dialog{
    background: #fff;
    height: 456px;
    .items{
      font-size: 28px;
      color: #333333;
      .item{
        line-height: 89px;
        border-bottom: 2px solid #F2F1F6;
        padding-left: 28px;
        position: relative;
        &.last-item{
          border-bottom: 0;
          span{
            font-size: 28px;
            color: #333333;
            padding: 7px;
          }
        }
        &.actived{
          font-size: 32px;
          color: #317CC3;
          &::after{
            content: ' ';
            position: absolute;
            right: 28px;
            top: calc(50% - 11px);
            width: 32px;
            height: 22px;
            // background-image: linear-gradient(-55deg, #CAA5FF 0%, #4F8FFF 100%);
            background: url(../../../assets/images/yes_icon.png) no-repeat;
            background-size: cover;
          }
        }
      }
    }
  }
}

</style>
