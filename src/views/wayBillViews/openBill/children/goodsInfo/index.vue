<template>
<div>
  <div class="page-goods_info">
    <!-- <div @click="addTemplate">模拟添加货物</div> -->
    <!-- 主体内容部分 start -->
    <div class="page-goods_info_content">
      <!-- 货物新增模板 start -->
        <!-- <div class="add-template animated bounceInDown faster" v-show="isShowTemplate" @click="seceltItemIndex(666)">
          <div class="template-item template-name">
            <div class="template-item_key">货物名称</div>
            <div
              class="template-item_value"
              :class="templateData.activeGoodsName ? '' : 'template-item_value_default'"
              @click="showPopup(0)"
            >{{templateData.activeGoodsName ? templateData.activeGoodsName : '请选择货物名称(必填)'}}</div>
            <div class="template-item_icon"></div>
          </div>
          <div class="template-item template-Packing">
            <div class="template-item_key">货物包装</div>
            <div
              class="template-item_value"
              :class="templateData.activePacking.itemName ? '' : 'template-item_value_default'"
              @click="showPopup(1)"
            >{{templateData.activePacking.itemName ? templateData.activePacking.itemName : '选择包装'}}</div>
            <div class="template-item_icon"></div>
          </div>
          <div class="template-item template-number">
            <div class="template-item_key">件数</div>
            <div>
              <fw-number :number.sync="templateData.number"></fw-number>
            </div>
          </div>
          <div>
            <fw-gird :weight.sync="templateData.weight" :volume.sync="templateData.volume" ></fw-gird>
          </div>
          <div>
            <fw-type @result="getGoodsType" :activeIndex="666" :weight="templateData.weight" :volume="templateData.volume"></fw-type>
          </div>
        </div> -->
      <!-- 货物新增模板 end -->


      <!-- 渲已编辑货物 start -->
      <div class="render-template animated bounceInDown faster" v-for="(item, index) in renderTemplateData" :key="index" @click="seceltItemIndex(item, index)">
        <div class="template-item template-name">
          <div class="template-item_key">货物名称</div>
          <div
            class="template-item_value"
            :class="item.goodName ? '' : 'template-item_value_default'"
            @click="showPopup(0)"
          >{{item.goodName ? item.goodName : '请选择货物名称(必填)'}}</div>
          <div class="delete-ele" @click="deleteGoodInfo(index)" v-show="renderTemplateData.length !== 1">
            <div class="delete-ele_icon"></div>
          </div>
          <div class="template-item_icon"></div>
        </div>
        <div class="template-item template-Packing">
          <div class="template-item_key">货物包装</div>
          <div
            class="template-item_value"
            :class="item.packingObj.itemName ? '' : 'template-item_value_default'"
            @click="showPopup(1)"
          >{{item.packingObj.itemName ? item.packingObj.itemName : '选择包装'}}</div>
          <div class="template-item_icon"></div>
        </div>
        <div class="template-item template-number">
          <div class="template-item_key">件数</div>
          <div>
            <fw-number :number.sync="item.number"></fw-number>
          </div>
        </div>
        <div>
          <fw-gird :weight.sync="item.weight" :volume.sync="item.volume" ></fw-gird>
        </div>
        <div>
          <fw-type @result="getGoodsType" :activeIndex="index" :weight="item.weight" :volume="item.volume"></fw-type>
        </div>
      </div>
      <!-- 渲已编辑货物 end -->

    </div>
    <!-- 主体内容部分 start -->

    <!-- 底部按钮 statr -->
    <div class="page-goods_info_button_default" :class="isActiveBtn ? 'page-goods_info_button_yes' : ''">
      <div class="info_button" @click="confirmSubmit">确定</div>
    </div>
    <!-- 底部按钮 statr -->

    <!--名称 popup start -->
    <div>
      <m-good-name-popup :isShow.sync="isShowQuickPopupName" :activeName="activePopupName" @result="resultActiveGoodsName"></m-good-name-popup>
    </div>
    <!--名称 popup end -->

    <!--包装 popup start -->
    <div>
      <m-packing-popup :isShow.sync="isShowQuickPopupPacking" :activeName="activePopupPackageName" @result="resultPackingitem"></m-packing-popup>
    </div>
    <!--包装 popup end -->

  </div>
</div>
</template>

<script>
/**
 * 货物信息页面
*/

import * as handleNativeFunNames from '@/_lib/jsbridge/handleNativeFunNames' // 触发native方法名称集合
import * as registerGlobalFunNames from '@/_lib/jsbridge/registerGlobalFunNames.js' // 注册window下方法名称集合 (供native调用)
// 货物名称弹层模块
import MGoodNamePopup from '@/modules/goodNamePopup'
// 货物包装弹层模块
import MPackingPopup from '@/modules/packingPopup'
import {
  mapState,
  mapMutations
} from 'vuex'
import * as mutationTypes from '@/vuex/mutations/types'
import * as actionTypes from '@/vuex/actions/types'
import {Popup, TransferDom} from 'vux'
// number 组件
import FwNumber from '@/components/public/fw-number'
// 栅格
import FwGird from '@/components/public/fw-gird'
// 类型
import FwType from '@/components/public/fw-type'

export default {
  name: 'pageGoodsInfo',
  directives: {
    TransferDom
  },
  mounted() {
    // window全局监听添加货物
    this.$webViewTools.registerGlobalFun(registerGlobalFunNames.ADD_GOODS_ITEM, function (params) {
      // 添加货物
      this.addTemplate()
    }.bind(this))
  },
  data () {
    return {
      isShowQuickPopupName: false, // 名称popup
      isShowQuickPopupPacking: false, //包装popup
      activePopupName: '', // 当前选中item 所属货物名称
      activePopupPackageName: '', // 当前选中item 所属货物包装
      isActiveBtn: true, // 是否显示默认置灰按钮样式
      itemIndex: null, // 当前选中item
      templateData: {
        activeGoodsName: '', // 选中的货物名称
        activePacking: {}, // 选中的货物包装
        number: 1, // 选中的件数
        weight: 0, // 重量
        volume: 0, // 体积
        goodType: '' // 获得计算后货物所属类型
      },
      renderTemplateData: [] // 渲染数据 来源vuex
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (vm.renderTemplateData.length === 0) {
        vm.renderTemplateData.unshift({
          goodName: '',
          goodType: {},
          number: 1,
          packingObj: {},
          volume: 0,
          weight: 0
        })
      }
    })
  },
  computed: {
    ...mapState('openBill', ['goodsList', 'dataDictionaries']),
    isBtn() {
      let templateData = this.templateData
      if (this.goodsList.length > 0 && !this.isShowTemplate) {
        return true
      }
      if (this.isShowTemplate && templateData.activeGoodsName && templateData.number) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    Popup,
    FwNumber,
    FwGird,
    FwType,
    MGoodNamePopup,
    MPackingPopup
  },
  methods: {
    ...mapMutations('openBill', {
      _addGoodsInfoItem: mutationTypes.ADD_GOODS_ITEM, // vuex 添加货物信息
      _updateGoodsInfoItem: mutationTypes.UPDATE_GOODS_LIST, // vuex 更新所有货物信息
      _deleteGoodsInfoItem: mutationTypes.DELETE_GOODS_ITEM // vuex 删除货物信息
    }),
    // 选择item 元素索引
    seceltItemIndex(item, index) {
      this.activePopupName = item.goodName ? item.goodName : ''
      this.activePopupPackageName = item.packingObj.itemName ? item.packingObj.itemName : ''
      this.itemIndex = index
    },
    showPopup(index) {
      this._handlePopup(index, true)
    },
    hidePopup(index) {
      this._handlePopup(index, false)
    },
    // 触发popup
    _handlePopup(index, isShow) {
      const task = {
        0: () => {this.isShowQuickPopupName = isShow},
        1: () => {this.isShowQuickPopupPacking = isShow}
      }[index]()
    },
    // 返回选中 || 输入的商品名称
    resultActiveGoodsName(activeName) {
      if (this.itemIndex === 666) {
        this.templateData.activeGoodsName = activeName
      } else {
        this.renderTemplateData[this.itemIndex].goodName = activeName
      }
    },
    // 返回选中的货物包装
    resultPackingitem(activeItem) {
      if (this.itemIndex === 666) {
        this.templateData.activePacking = activeItem
      } else {
        this.renderTemplateData[this.itemIndex].packingObj = activeItem
      }
    },
    // 获取货物类型
    getGoodsType(activeItem, itemIndex) {
      if (itemIndex === 666) {
        this.templateData.goodType = activeItem
      } else {
        this.renderTemplateData[itemIndex].goodType = activeItem
      }
    },

    // 获取货物包装选中数据
    getPackingSelectedData(result) {
      this.templateData.activePacking = result.itemName
      this.templateData.packing.result = result
    },
    // 删除货物信息
    deleteGoodInfo(index) {
      console.log(index)
      if (this.renderTemplateData.length === 1) {
        this.$toast.show
      }
      this.renderTemplateData.splice(index, 1)
      // this._deleteGoodsInfoItem(index)
      // this.isShowTemplate = false
    },
    // 确定提交
    confirmSubmit() {
        // 是否执行
        let isNumber = true
        let isName = true
        let isPackage = true

        this.renderTemplateData.forEach((item) => {
          if (!item.goodName) {
            isName = false
          }
          if (!item.packingObj.itemCode) {
            isPackage = false
          }
          if (!item.number) {
            isNumber = false
          }
        })

        if (!isName) {
          this.$toast.show('请选择货物名称')
          return
        } else if (!isPackage) {
          this.$toast.show('请选择货物包装')
          return
        } else if (!isNumber) {
          this.$toast.show('件数为大于0的整数')
          return
        }

        this._updateGoodListData()
        this.$router.go(-1)
    },
    // 更新vuex中商品列表数据
    _updateGoodListData() {
      this._updateGoodsInfoItem(this.renderTemplateData)
    },
    // 添加货物模板
    addTemplate() {
      // this.isShowTemplate = false
      // if (this.goodsList.length === 3) {
      //   this.$toast.show('最多添加3条货物')
      // } else {
      //   this.isShowTemplate = true
      // }

      if (this.renderTemplateData.length === 3) {
        this.$toast.show('最多添加3条货物')
        return
      }

      this.renderTemplateData.unshift({
        goodName: '',
        goodType: {},
        number: 1,
        packingObj: {},
        volume: 0,
        weight: 0
      })
    }
  },
  watch: {
    goodsList: {
      handler: function (newData) {
        this.renderTemplateData = this.$deepCopy(newData)
        console.log(newData)
      },
      deep: true,
      immediate: true
    },
    renderTemplateData: { // 监听数据number
      handler: function (newData) {
        let isActive = true
        if (newData.length > 0) {
          newData.forEach(item => {
            if (!item.number || !item.goodName || !item.packingObj.itemCode) {
              isActive = false
            }
          })
        }

        this.isActiveBtn = isActive
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
