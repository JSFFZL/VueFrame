<template>
  <div class="page-more_limit">

    <!-- 内容主体 start -->
    <div class="page-more_content">
      <!-- <div>更多要求</div>
      <div @click="jump">返回开单页面</div> -->

      <!-- 回单部分 start -->
      <div class="return-require">
        <div class="page-more_item require" @click="handleReturnListPopup">
          <div class="page-more_item_title">回单要求</div>
          <div class="page-more_item_content" :class="moreRequire.returnRequireed.itemName !== '请选择回单类型' ? 'page-more_item_content_active' : ''">{{moreRequire.returnRequireed.itemName}}</div>
          <div class="page-more_item_icon">
            <span class="icon"></span>
          </div>
        </div>

        <div v-show="moreRequire.isShowCodeAndNumber">
          <div class="page-more_item code">
            <div class="page-more_item_title">回单编号</div>
            <input type="text" :value="moreRequire.returnCodeed" @input="returnCodeed" placeholder="请输入" />
          </div>
          <div class="page-more_item number">
            <div class="page-more_item_title">回单份数</div>
            <input type="number" :value="moreRequire.returnNumbered || ''" @input="returnNumbered" placeholder="请输入回单份数" />
            <div class="unit">份</div>
          </div>
        </div>
      </div>
      <!-- 回单部分 end -->

      <!-- 特殊要求 start -->
      <fw-cell-title title="特殊要求"></fw-cell-title>
      <div class="require-single">
        <div
          class="require-single_item"
          :class="moreRequire.singleActiveIndex === index ? 'require-single_item_active' : ''"
          v-for="(item,index) in moreRequire.singleList"
          :key="index"
          @click="checkedSingleItem(item)"
        >{{item.name}}</div>
      </div>
      <!-- 特殊要求 end -->

      <!-- 其他要求(多选) start -->
      <fw-cell-title title="其他要求" describe="(可多选)"></fw-cell-title>
      <div class="require-check_list">
        <div class="require-check_item" v-for="(item, index) in moreRequire.checkList" :key="index" @click="checkedCheckItem(item)">
          <div class="require-check_item_text" :class="item.isShow ? 'require-check_item_text_active' : ''">{{item.name}}</div>
          <div :class="item.isShow ? 'require-check_item_icon' : ''"></div>
        </div>
      </div>
      <!-- 其他要求(多选) end -->
    </div>
    <!-- 内容主体 end -->
    <!-- 底部 start -->
    <div class="page-more_footer">
      <div @click="reset">重置</div>
      <div @click="confirm">确定</div>
    </div>
    <!-- 底部 end -->


    <!-- 回单类型 popup start -->
    <div v-transfer-dom>
      <popup v-model="isShowReturnListPopup" position="bottom" :hide-on-blur="false">
        <div class="return-popup_content" :popup-style="{zIndex: 502}">
          <div class="return-popup_title">选择回单类型</div>
          <div class="return-popup_item" v-for="(item, index) in dataDictionaries.hdyq" :key="index" @click="selectedReturnItem(item)">{{item.itemName}}</div>
          <div class="return-popup_item return-popup_item_cancel" @click="selectedReturnItem('cancel')">取消</div>
        </div>
      </popup>
    </div>
    <!-- 回单类型 popup start -->


  </div>
</template>

<script>
/**
 * @class 更多要求页面
*/

import * as mutationTypes from '@/vuex/mutations/types'
import * as actionTypes from '@/vuex/actions/types'
import {mapState, mapActions, mapMutations} from 'vuex'
import {Popup, TransferDom} from 'vux'
// cellTitle 组件
import FwCellTitle from '@/components/public/fw-cell-title'

export default {
  name: 'pageMoreLimit',
  directives: {
    TransferDom
  },
  data() {
    return {
      isShowReturnListPopup: false // 显示隐藏回单类型popup
    }
  },
  beforeRouteEnter: (to, from, next) => {next()},
  computed: {
    ...mapState('openBill', ['dataDictionaries', 'moreRequire'])
  },
  components: {
    Popup,
    FwCellTitle
  },
  methods: {
    ...mapMutations('openBill', {
      _setMoreRequire: mutationTypes.SET_MORE_REQUIRE
    }),
    // 回单编号
    returnCodeed(el) {
      this._setMoreRequire(Object.assign(this.moreRequire, {returnCodeed: el.target.value}))
    },
    // 回单份数
    returnNumbered(el) {
      el.target.value = el.target.value.replace(/[^\d]/i, '')
      this._setMoreRequire(Object.assign(this.moreRequire, {returnNumbered: el.target.value || 0}))
    },
    // 回单类型popup
    handleReturnListPopup() {
      this.isShowReturnListPopup = true
    },
    // 选中回单类型item
    selectedReturnItem(item) {
      if (item === 'cancel') {
        this.isShowReturnListPopup = false
        return
      }
      this._setMoreRequire(Object.assign(this.moreRequire, {returnRequireed: item}))
      this._setMoreRequire(Object.assign(this.moreRequire, {isShowCodeAndNumber: true}))
      this.isShowReturnListPopup = false
    },
    // 选中单选item
    checkedSingleItem(item) {
      this._setMoreRequire(Object.assign(this.moreRequire, {singleActiveIndex: item.id}))
      this._setMoreRequire(Object.assign(this.moreRequire, {singleed: this.moreRequire.singleList[this.moreRequire.singleActiveIndex]}))
    },
    // 选中多选item
    checkedCheckItem(item) {
      let list = []
      item.isShow = !item.isShow
      this.moreRequire.checkList.forEach(item => {
        if (item.isShow) {
          list.push(item)
        }
      })
      this._setMoreRequire(Object.assign(this.moreRequire, {checked: list}))
    },
    // 重置
    reset() {
      this._setMoreRequire(Object.assign(this.moreRequire, {
        isShowCodeAndNumber: false, // 是否显示编号及份数
        checked: [], // 多选结果
        checkList: [ // 多选列表
          {name: '开票', id: 0, isShow: false},
          {name: '整车', id: 1, isShow: false},
          {name: '加急', id: 2, isShow: false},
          {name: '入仓', id: 3, isShow: false},
          {name: '卸货', id: 4, isShow: false},
          {name: '上楼', id: 5, isShow: false},
          {name: '报关', id: 6, isShow: false}
        ],
        singleed: {}, // 单选结果
        singleActiveIndex: null, // 单选索引
        returnRequireed: {itemName: '请选择回单类型'}, // 回单类型结果
        returnCodeed: null, // 回单编号结果
        returnNumbered: null // 回单分数结果
      }))
    },
    // 确定
    confirm() {
      this.$router.go(-1)
    },
    jump () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
