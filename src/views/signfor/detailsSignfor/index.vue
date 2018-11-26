<template>
    <div  >
      123
      <div class="tabs" ref="tabBox">
        <tab>
          <tab-item :selected="'orderBox' === curTab" @on-item-click="changeTab('orderBox')">运单</tab-item>
          <tab-item :selected="'goodsBox' === curTab" @on-item-click="changeTab('goodsBox')">货物</tab-item>
          <tab-item :selected="'signforBox' === curTab" @on-item-click="changeTab('signforBox')">签收</tab-item>
        </tab>
      </div>
      <div class="orderDetailwrapper" ref="orderDetailwrapper">
        <div class="content">
          <header ref="orderBox">
            <div class="order-wrap">
              <div class="orderCode"  v-if="signBaseInfo">
                <div class="orderText">签收单号: {{signforData.signWaybillInfo.orderCode}}</div>
                <div class="log" v-if="signforData.signBaseInfo.signStatus==1" ><div>全部签收</div></div>
                <div class="log" v-if="signforData.signBaseInfo.signStatus==2" ><div>部分签收</div></div>
                <div class="log" v-if="signforData.signBaseInfo.signStatus==3"  ><div>全部拒签</div></div>
                <div class="log" v-if="signforData.signBaseInfo.cashierStatus==0" ><div>未收银</div></div>
                <div class="log" v-if="signforData.signBaseInfo.cashierStatus==1"><div>已收银</div></div>
              </div>
              <div class="deliveryCode">运单号: {{signforData.signWaybillInfo.waybillCode}}</div>
            </div>
            <div class="address-wrap">
              <div class="address">{{signforData.signWaybillInfo.invoiceCityName}}</div>
              <div class="arrow"></div>
              <div class="address right">{{signforData.signWaybillInfo.receiptCityName}}</div>
            </div>
            <div class="call-wrap">
              <div class="sender">
                <div class="send-icon">发</div>
                <div class="send-icon receive">收</div>
                <div class="line">&nbsp;</div>
                <div>{{signforData.signWaybillInfo.invoiceUser}} ({{signforData.signWaybillInfo.invoiceMobileNo}})</div>
                <div class="phone" @click="call(signforData.signWaybillInfo.invoiceMobileNo)"></div>
              </div>
              <div class="receiver">
                <div>{{signforData.signWaybillInfo.receiptUser}} ({{signforData.signWaybillInfo.receiptMobileNo}})</div>
                <div class="phone" @click="call(signforData.signWaybillInfo.receiptMobileNo)"></div>
              </div>
            </div>
          </header>
          <div class="money-wrap-title">
            <div class="title">应收金额</div>
            <div><span>{{signforData.signWaybillInfo.totalReceivable}}</span> 元</div>
          </div>
          <div class="money-wrap">
            <div class="pay" >
              <div>收款方式</div>
              <div class="choosePay" v-if="!signBaseInfo">
                <div  @click="openPayBtn"    :class="isShowPopupResult=='请选择'?please:''"  v-show="payIndex" >{{isShowPopupResult}}</div>
                <div   v-show="!payIndex" >{{isShowPopupResult}}</div>
                <div class="right-icon"></div>
              </div>
              <div v-if="!signBaseInfo&&signforData.signWaybillInfo.totalReceivable==null">无</div>
              <div v-if="signBaseInfo">
                <div>{{signforData.signWaybillInfo.totalReceivable==0?'无':signforData.signBaseInfo.settlementMethodNmae}}</div>
              </div>
            </div>
            <div class="money">
              <div>到付</div>
              <div class="price"><span>{{signforData.signWaybillInfo.toPay?signforData.signWaybillInfo.toPay:0}}</span>元</div>
            </div>
            <div class="money">
              <div>收货方付</div>
              <div class="price"><span>{{signforData.signWaybillInfo.receiptPay}}</span>元</div>
            </div>
            <div class="money">
              <div>代收货款</div>
              <div class="price"><span>{{signforData.signWaybillInfo.collectPayment}}</span>元</div>
            </div>
          </div>
          <div class="money-wrap-title" ref="goodsBox">
            <div class="title">货物详情</div>
            <div>送货</div>
          </div>
          <div class="cargo-wrap">
            <div  v-for="(item , index) in signforData.signGoodsInfo" :key="index" >
              <div class="cargo-wrap-content">
                <div class="cargoName">{{item.goodsName}}</div>
                <div v-if="!signBaseInfo" class="cargoNumber" @click="openPrice(item , index)">
                  签收<span>{{item.signNum}}</span>件
                </div>
                <div class="cargoNumber" v-if="signBaseInfo">
                  签收 <span class="spaned">{{item.signNum}}</span>件
                </div>
              </div>
              <div class="cause" v-show="item.refuseCauseName!=''&&item.refuseCauseName!=null" >拒因：{{item.refuseCauseName}}</div>
            </div>
          </div>
          <div class="money-wrap-title" ref="signforBox">
            <div class="title">签收信息</div>
            <div> </div>
          </div>
          <div class="signfor-message-warp">
            <div class="message-user">
              <div class="userTitle">姓名</div>
              <input v-if="!signBaseInfo" type="text" @click="__scrollIntoViewIfNeededInput($event)" placeholder="请输入"  v-model="userName">
              <div v-if="!signBaseInfo" class="checxbox" @click="syncName">
                <div class="checxbox-default" v-show="!checkName"><img src="../../../assets/images/checkbox_default_ic.png" alt=""></div>
                <div class="checxboxed" v-show="checkName"><img src="../../../assets/images/mark_ic.png" alt=""></div>
              </div>
              <div v-if="!signBaseInfo" @click="syncName">同收货人</div>
              <div v-if="signBaseInfo">{{signforData.signBaseInfo.signUser}}</div>
            </div>
            <div class="message-phone">
              <div>手机</div>
              <div v-if="!signBaseInfo"><input type="text" @click="__scrollIntoViewIfNeededInput($event)" v-model="userPhone" placeholder="请输入手机号" maxlength="11"></div>
              <div v-if="signBaseInfo">{{signforData.signBaseInfo.signUserMobileNo}}</div>
            </div>
            <div class="message-phone">
              <div >身份证号</div>
              <div v-if="!signBaseInfo"><input type="text" @click="__scrollIntoViewIfNeededInput($event)" placeholder="请输入身份证"  v-model="userIdCard" maxlength="18"></div>
              <div v-if="signBaseInfo">{{signforData.signBaseInfo.signUserIdCard}}</div>
            </div>
          </div>
          <div class="money-wrap-title">
            <div class="title">签收说明</div>
            <div> </div>
          </div>
          <div class="singfor-explain-warp" v-if="!signBaseInfo">
            <textarea name="" id="" @input="descArea" maxlength="100" v-model="introduct"  cols="49" rows="5"></textarea>
            <div class='number'>{{introductLength}}/100</div>
          </div>
          <div class="singfor-explain-warp" v-if="signBaseInfo">
            <div class="explainContent">{{signforData.signBaseInfo.signInstructions}}</div>
          </div>
          <div class="money-wrap-title">
            <div class="title">上传签收照片</div>
            <div> </div>
          </div>
          <div class="photo-wrap">
            <div class="uploadinged" @click="prePhoto(index,1)" v-for="(item, index) in photoData" :key="index">
              <img :src="item" style="width: 100%;height: 100%" alt="">
              <div  v-if="!signBaseInfo"><img @click.stop="delPhoto(index,1)" src="../../../assets/images/empty_icon.png" alt=""></div>
            </div>
            <div class="uploading" @click="addPhoto(1)" v-show="photoData.length<3&&!signBaseInfo">
              <div class="add"></div>
              <div class="content">添加照片</div>
            </div>
          </div>
          <div class="money-wrap-title" >
            <div class="title">收回单</div>
            <div>
              <div v-if="!signBaseInfo"><x-switch @on-change="openOrder"  title="" v-model="value"></x-switch></div>
            </div>
          </div>
          <!--v-show="orderPhont||signBaseInfo" 收回单部分 先隐藏-->
          <div class="photo-wrap" v-if="false">
            <div class="uploadinged" @click="prePhoto(index,2)"  v-for="(item, index) in photoData2" :key="index">
              <img :src="item" alt="">
              <div v-if="!signBaseInfo" @click.stop="delPhoto(index,2)"><img src="../../../assets/images/empty_icon.png" alt=""></div>
            </div>
            <div class="uploading" @click="addPhoto(2)" v-show="photoData2.length<3&&!signBaseInfo">
              <div class="add"></div>
              <div class="content">添加照片</div>
            </div>
          </div>
          <footer v-if="!signBaseInfo">
            <div class="signBtn" @click="signforBtn">签收确认</div>
          </footer>
          <div class="footered" v-if="signBaseInfo">
            <div style="border: none"></div>
            <div @click="changeSignBtn" v-if="signforData.signBaseInfo.cashierStatus==0">取消签收</div>
            <div  class="default" v-if="signforData.signBaseInfo.cashierStatus==1">取消签收</div>
          </div>
        </div>
      </div>
      <payPopup :isShow.sync="isShow" v-on:pay="getPopupData"></payPopup>
      <popup v-model="priceShow" position="bottom" :hide-on-blur="false">
        <!--价格修改-->
        <div class="change-price-wrap" >
          <div class="price-box">
            <div class="box-content">
              <div class="box-title">
                <div class="box-title-change" @click="closePrice">取消</div>
                <div>修改签收数量</div>
                <div class="box-title-ok"  @click="changePrice">确定</div>
              </div>
              <div class="box-message">
                <div class="goodsName">{{signforName}}</div>
                <div class="goodsNumber">{{signforNumber}}件</div>
              </div>
              <div class="box-number">
                <div>签收数量</div>
                <input type="number" v-on:input="watchSignNum" onkeyup="value=value.replace(/^(-1+,-10)|[^\d]+/g,'')"  v-model="rejectNumber" :min="signforNumber" :max="signforNumber" v-on:blur="signforNumberBlur" >
                <div class="reject">拒签数量 <span>{{signforNumber - rejectNumber}}</span></div>
              </div>
              <div class="box-cause">
                <div class="text">拒收原因</div>
                <div class="base" @click.stop="base" v-show="isBase"> </div>
                <Checker :selected-item-class="causeBtned"  v-model="causeData"  @on-change="changeCause(causeData)">
                  <CheckerItem class="causeBtn" value="货物破损" >货物破损</CheckerItem>
                  <CheckerItem class="causeBtn" value="过期" >过期</CheckerItem>
                  <CheckerItem class="causeBtn" value="其他" >其他</CheckerItem>
                </Checker>
              </div>
              <input type="text" placeholder="请输入其他原因" :disabled="disabledCause" v-model="causeInpval">
            </div>
          </div>
        </div>
        <!--价格修改结束-->
      </popup>
    </div>
</template>

<script>
  import FwDialog from '@/components/public/fw-dialog'
  import payPopup from '@/components/common/pay-popup'
  import Vue from 'vue'
  import { Tab, TabItem, XSwitch, Actionsheet, Popup, Checker, CheckerItem, ToastPlugin, ConfirmPlugin } from 'vux'
  import BScroll from 'better-scroll'
  import * as API from '@/http/common/api'
  import mixinUtils from '@/mixins/common/public.js'
  import mixinReload from '@/mixins/common/reload.js'
  import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
  import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
  Vue.use(ConfirmPlugin)
  // Vue.use(ToastPlugin, {position: 'middle'})
  export default {
    nama: 'detailsSignfor',
    mixins: [mixinUtils , mixinReload],
    components: {
      Tab,
      TabItem,
      XSwitch,
      Actionsheet,
      Checker,
      CheckerItem,
      FwDialog,
      ToastPlugin,
      Popup,
      payPopup
    },
    data () {
      return {
        please: 'please',
        isBase: true,
        scroll: '',
        orderPhont: false,
        introduct: '',
        introductLength: 0,
        curTab: 'orderBox',
        scrollTop: 0,
        goodsBoxTop: 0,
        isClickTabScroll: false,
        payTypes: false,
        openPay: false,
        isShowChangeDialog: true,
        isShowPopup: false,
        // loading: false,
        isShow: false,
        isShowPopupIndex: 0,
        isShowPopupResult: '请选择',
        causeBtned: 'causeBtned',
        causeData: ['货物破损', '过期', '其他'],
        causeIndex: '',
        priceShow: false,
        signforNumber: 0,
        causeInpval: '',
        rejectNumber: 0,
        goodsDataIndex: 0,
        checkName: false,
        payIndex: true,
        userName: '',
        userPhone: '',
        userIdCard: '',
        signforData: {},
        changeName: '',
        photoData: [],
        photoData2: [],
        signforName: '',
        goodsData: [],
        dispatcherDetailId: '',
        userInfo: {},
        payMethods: 0,
        photoIndex: 0,
        signBaseInfo: null,
        disabledCause: true,
        signReceiptStatus: 0
      }
    },
    mounted () {
      console.log('用户信息============', JSON.parse(window.localStorage.userInfo))
      console.log('列表item过来的参数', this.$route.query)
      // this.$webViewTools.registerGlobalFun(registerGlobalFunNames.ADDPHOTOCALLBACK, function (params) {
      //   this.addPhotoCallBack(params.value)
      // }.bind(this))
      this.dispatcherDetailId = this.$route.query.dispatcherDetailId
      this.userInfo = JSON.parse(window.localStorage.userInfo)
      this.getDetailsData()
    },
    methods: {
      getDetailsData () {
        // this.$http(API.GET_SIGN_DETAIL + '/' + 4170535 + '/' + 392, {type: 'GET', withCredentials: true})
        this.$http(API.GET_SIGN_DETAIL + '/' + this.dispatcherDetailId + '/' + this.userInfo.carrierGlobalId, {type: 'GET', withCredentials: true})
          .then(res => {
            this.__isSuccess(res, function (data) {
              this.signBaseInfo = data.result.signBaseInfo
              if (!data.result.signBaseInfo) {
                for (let i = 0; i < data.result.signGoodsInfo.length;i++) {
                  data.result.signGoodsInfo[i].signNum = data.result.signGoodsInfo[i].packageNum;
                }
              }
              if (data.result.signBaseInfo) {
                console.log('签收照片' + data.result.signBaseInfo.signPic)
                if (data.result.signBaseInfo.signPic) {
                  this.photoData = data.result.signBaseInfo.signPic.split(',')
                }
                console.log(this.photoData)
              }
              this.signforData = data.result
              // this.loading = true
              console.log('签收详情数据------', this.signforData)
              this.initBetterScroll()
            }.bind(this))
          })
          .catch(err => {
            console.log(err)
            this.$toast.show('网络错误，请重试')
          })
      },
      // 取消签收 btn
      changeSignBtn () {
        var that = this
        that.$vux.confirm.show({
          content: '确定要取消签收运单吗？',
          onCancel () {
          },
          onConfirm () {
            that.cancelSign()
          }
        })
      },
      watchSignNum () {
        console.log(this.rejectNumber)
        if (this.signforNumber - this.rejectNumber<0) {
          this.rejectNumber = this.signforNumber
        }
        if (this.signforNumber - this.rejectNumber > 0 ) {
          this.isBase = false
        }
      },
      getPopupData (data) {
        if (data.name == '取消') return
        this.isShowPopupResult = data.name
        this.isShowPopupIndex = data.index
        // this.payIndex = false
      },
      // 取消签收
      cancelSign () {
        let changeSignData = {
          'companyId': this.userInfo.carrierGlobalId,
          'signId': this.signforData.signId,
          'curOrgId': this.userInfo.orgId,
          'curOrgName': this.userInfo.orgName,
          'userId': this.userInfo.id,
          'userName': this.userInfo.userName,
          'waybillId': this.signforData.waybillId,
          'dispatcherDetailId': this.signforData.dispatcherDetailId
        }
        let _this = this;
        console.log(changeSignData)
        this.$http(API.CHANCEL_SIGN, {type: 'POST', params: changeSignData, withCredentials: true})
          .then(res => {
            this.__isSuccess(res, function (data) {
              console.log('取消签收成功+刷新页面')
              this.$toast.show('取消签收成功')
              setTimeout(function () {
                _this.$router.push({path: '/signforAll/signAll'})
              }, 1000)
            }.bind(this))
          })
          .catch(err => {
            console.log(err)
            this.$toast.show('网络错误，请重试')
          })
      },
      // 确认签收
      affirmSign () {
        let flag = 0
        for (let i = 0; i < this.signforData.signGoodsInfo.length; i++) {
          if (this.signforData.signGoodsInfo[i].signNum == 0) {
            flag += 1
          }
        }
        if (flag == this.signforData.signGoodsInfo.length){
          this.payMethods = 1
        } else if (0 < flag < this.signforData.signGoodsInfo.length) {
          this.payMethods = 2
        } else if (0 == falg) {
          this.payMethods = 3
        }
        console.log(this.payMethods)

        if (this.isShowPopupIndex == 1) {
          this.cofSign()
        }
        if (this.isShowPopupIndex == 2) {
          this.$webViewTools.handleNativeFun(handleNativeFunNames.WECHATPAY, {'receiptPhase': '2', 'wayBillId': this.signforData.waybillId}).then(function (result) {
            window.alert('微信回调成功' + result)
            let res = JSON.parse(result)
            this.cofSign()
          }.bind(this))
        }
      },
      initData (params) {
        // let data = JSON.parse(params)
        if (params.value == 3) {
          this.cofSign()
        } else {
          this.$toast.show('微信付款失败')
        }
      },
      cofSign () {
        // 确认签收参数
        let signData = {
          "companyId": this.userInfo.carrierGlobalId,
          "companyName": this.userInfo.carrierGlobalName,
          "dispatcherDetailId": this.signforData.dispatcherDetailId,
          "dispatcherId": this.signforData.dispatcherId,
          "settlementMethod": this.isShowPopupIndex,
          "signInstructions": this.introduct,
          "signPic": this.photoData.join(','),
          "signStatus": this.payMethods,                 // 付款方式【1：全部签收 、2：部分签收 3、全部拒签】 ,
          "signUser": this.userName,
          "signUserIdCard": this.userIdCard,
          "signUserMobileNo": this.userPhone,
          "userId":  this.userInfo.id,
          "userName": this.userInfo.realName,
          "waybillId": this.signforData.waybillId,
          "curOrgId":this.userInfo.orgId,
          "curOrgName": this.userInfo.orgName,
          'signGoodsList': this.signforData.signGoodsInfo,
          'signReceiptStatus': this.signReceiptStatus
        }
        this.$http(API.SIGN_DELIVERY_ADD, {type: 'POST', params: signData, withCredentials: true})
          .then(res => {
            this.__isSuccess(res, function (data) {
              if (data.result.result === 0) {
                this.$toast.show(data.result.message)
                setTimeout(function () {
                  this.$router.push({path: '/searchSignfor', query: {page: 2, first: 1}})
                }, 2000)
              } else {
                // 成功原生刷新
                this.$webViewTools.handleNativeFun(handleNativeFunNames.RELOAD)
              }
            }.bind(this))
          })
          .catch(err => {
            console.log(err)
            this.$toast.show('网络错误，请重试')
          })
      },
      openOrder (val) {
        console.log(val)
        this.orderPhont = val
        if (val == true) {
          this.signReceiptStatus = 1
        } else {
          this.signReceiptStatus = 0
        }
      },
      descArea () {
        this.introductLength = this.introduct.length
      },
      initBetterScroll () {
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.orderDetailwrapper, {
            // 是否回弹效果
            bounce: false,
            // 是否可以点击
            click: true,
            // 为3时才可on scroll事件
            probeType: 3
          })
          let that = this
          let tabBoxHeight = this.$refs.tabBox.offsetHeight
          // 减去tab高度
          this.goodsBoxTop = this.$refs.goodsBox.getBoundingClientRect().top - tabBoxHeight
          this.scroll.on('scroll' , (pos) => {
            if (!this.isClickTabScroll) {
              if (pos.y -100< -this.goodsBoxTop) {
                that.curTab = 'goodsBox'
              } else {
                that.curTab = 'orderBox'
              }
            }
          })
          // tab滚动结束，isClickTabScroll改为false
          this.scroll.on('scrollEnd' ,() => {
            this.isClickTabScroll = false
          })
        })
      },
      changeTab (value) {
        this.curTab = value
        // 点击时不触发 this.scroll.on('scroll'的判断tab功能
        this.isClickTabScroll = true
        let goodsBoxTop = this.goodsBoxTop
        console.log(goodsBoxTop)
        if (value !== 'orderBox') {
          // 高度超过太多时回弹效果不好，这里让其只能滚动到最大滚动高度。
          if (-this.scroll.maxScrollY < goodsBoxTop) {
            this.scroll.scrollTo(0, this.scroll.maxScrollY, 300)
          } else {
            if (value === 'goodsBox') {
              this.scroll.scrollTo(0, -goodsBoxTop, 300)
            } else {
              if (this.orderPhont) {
                this.scroll.scrollTo(0, -goodsBoxTop - 330, 300)
              } else {
                this.scroll.scrollTo(0, -goodsBoxTop - 150, 300)
              }
            }
          }
        } else {
          this.scroll.scrollTo(0, 0, 300)
        }
      },
      openPayBtn () {
        // this.$refs.payChildren.openPopup()
        this.isShow = true
      },
      printVal (index, val) {
        console.log(index, val)
        this.payNameed = val.label
        this.payIndex = false
      },
      changeCause (value) {
        console.log(value)
        if (value == '货物破损') {
          this.causeIndex = 1
        }
        if (value == '过期') {
          this.causeIndex = 2
        }
        if (value == '其他') {
          this.causeIndex = 3
        }
        if (value == ''){
          this.causeIndex = 0
        }
        if (value == '其他'){
          this.disabledCause = false
        } else {
          this.disabledCause = true
          this.causeInpval = ''
        }
        console.log(this.causeIndex)
      },
      closePrice () {
        this.priceShow = !this.priceShow
      },
      openPrice (item, index) {
        console.log(item)
        this.causeInpval = ''
        // this.disabledCause = true
        this.isBase = true
        this.changeName = item.signNum
        this.priceShow = !this.priceShow
        this.signforNumber = item.packageNum
        this.signforName = item.goodsName
        this.rejectNumber = item.packageNum
        this.goodsDataIndex = index
      },
      changePrice () {
        if ((this.signforNumber - this.rejectNumber != 0) && this.causeIndex == 0){
          this.$toast.show('请选择拒收原因')
          return
        }
        if ((this.signforNumber - this.rejectNumber != 0) && this.causeIndex == 3 && this.causeInpval == '') {
          this.$toast.show('请输入其他拒收原因')
          return
        }
        // 修改goodsData的签收数量
        this.signforData.signGoodsInfo[this.goodsDataIndex].signNum = this.rejectNumber
        this.signforData.signGoodsInfo[this.goodsDataIndex].refuseNum = this.signforNumber - this.rejectNumber
        // 添加失败原因
        if (this.signforNumber - this.rejectNumber != 0) {
          if (this.causeIndex == 3) {
            this.signforData.signGoodsInfo[this.goodsDataIndex].refuseCauseName = this.causeInpval
          } else if (this.causeIndex == 2) {
            this.signforData.signGoodsInfo[this.goodsDataIndex].refuseCauseName = '过期'
          } else if (this.causeIndex == 1) {
            this.signforData.signGoodsInfo[this.goodsDataIndex].refuseCauseName = '货物破损'
          }
        }
        // 关闭
        this.priceShow = !this.priceShow
      },
      signforNumberBlur () {
        if (this.rejectNumber === '') {
          this.rejectNumber = this.signforNumber
        }
      },
      syncName () {
        this.checkName = !this.checkName
        if (this.checkName) {
          this.userName = this.signforData.signWaybillInfo.receiptUser
          this.userPhone = this.signforData.signWaybillInfo.receiptMobileNo
          if (this.signforData.signWaybillInfo.receiptIdentityCard) {
            this.userIdCard = this.signforData.signWaybillInfo.receiptIdentityCard
          }
        } else {
          this.userName = ''
          this.userPhone = ''
          if (this.signforData.signWaybillInfo.receiptIdentityCard) {
            this.userIdCard = ''
          }
        }
      },
      delPhoto (idx, id) {
        console.log(id)
        var that =this
        this.$vux.confirm.show({
          content: '要删除这张照片吗？',
          onCancel () {
          },
          onConfirm () {
            if (id == 1) {
              that.photoData.splice(idx, 1)
            } else {
              that.photoData2.splice(idx, 1)
            }
          }
        })
      },
      addPhoto (idx) {
        this.photoIndex = idx
        // 唤起native 选择图片
        this.photoData.push('https://s0.2mdn.net/simgad/2068654071612895497')
        // this.$webViewTools.handleNativeFun(handleNativeFunNames.ADDPHOTO, {'limit': 3 - this.photoData.length, 'photoArr': this.photoData, "id": "addPhotoCallBack"}).then(function (result) {
        //   let res = JSON.parse(result)
        //   let resResult = res.value.split(',')
        //   if (idx = 1) {
        //     this.photoData = resResult
        //   } else {
        //     this.photoData2 = resResult
        //   }
        // }.bind(this))
      },
      // 预览图片
      prePhoto (index , idx) {
        let photoDatas = idx === 1 ? this.photoData : this.photoData2
        console.log(photoDatas)
        this.$webViewTools.handleNativeFun(handleNativeFunNames.PREVIEWPHOTO, {
          'index': index,
          'photoArr': photoDatas,
          'id': 'PREVIEWPHOTO'
        }).then(function (result) {
          let res = JSON.parse(result)
          if (res.value === '') {
            this.photoData = []
            return
          }
          let resResult = res.value.split(',')
          if (idx = 1) {
            this.photoData = resResult
          } else {
            this.photoData2 = resResult
          }
        }.bind(this))
      },
      signforBtn () {
        if (this.isShowPopupIndex == 0) {
          this.$toast.show('请选择付款方式')
          return
        }
        if (this.userName == '') {
          this.$toast.show('请填写签收人姓名')
          return
        }
        if (this.userPhone == null) {
          this.userPhone = ''
        }
        if (this.userPhone == '') {
          this.$toast.show('请填写签收人手机号')
          return
        }
        if (this.userPhone.length < 11) {
          this.$toast.show('手机号格式有误')
          return
        }
        if (this.userIdCard&&this.userIdCard.length < 18) {
          this.$toast.show('身份证号格式有误')
        }
        // 目前不做身份证格式校验 11月22号前
        // let isIDCard = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        // if (!isIDCard.test(this.userIdCard)) {
        //   this.$toast.show('身份证号有误')
        //   return
        // }
        this.affirmSign()
      },
      call (num) {
        this.$webViewTools.handleNativeFun(handleNativeFunNames.PHONECALL, {'value': num})
      }
    }
  }
</script>
<style lang="less" scoped src="./index.less"></style>
<style>
  .vux-tab .vux-tab-item.vux-tab-selected{
    color: #317CC3!important;
  }
  .vux-tab-ink-bar{
    background-image: linear-gradient(-55deg, #CAA5FF 0%, #4F8FFF 100%);
  }
  .weui-switch-cp__box:before, .weui-switch:before{
    width: 40px!important;
    height: 17px!important;
  }
  .weui-switch-cp__box:after, .weui-switch:after{
    width: 17px!important;
    height: 17px!important;
    border-radius: 50%!important;
  }
  .weui-switch, .weui-switch-cp__box{
    width:38px!important;
    height: 17px!important;
    border: none!important;
  }
  .weui-cell_switch{
    padding: 0;
  }
  .vux-x-switch.weui-cell_switch{
    padding: 0!important;
  }
  .weui-switch-cp__input:checked~.weui-switch-cp__box, .weui-switch:checked{
    background-image: linear-gradient(-55deg, #CAA5FF 0%, #4F8FFF 100%)!important;
    border-color: #CAA5FF!important;
    border: none;
    background-color:#CAA5FF!important  ;
  }
  .weui-toast__content{
    font-size:16px ;
  }
  .weui-dialog{
    border-radius: 12px;
    width: 72%;
  }
  .weui-dialog__bd:first-child{
    color: #030303;
  }
  .weui-dialog__ft{
    font-size: 16px;
  }
  .weui-dialog__btn_default{
    color:#666 ;
  }
  .weui-dialog__btn_primary{
    color: #317CC3;
  }
</style>
