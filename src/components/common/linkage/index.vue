<template>
  <div class="fw-linkage" v-transfer-dom>
    <popup v-model="isShow" position="bottom" :hide-on-blur="false">
      <div class="sender-info_address_wrap" :popup-style="{zIndex: 502}">
        <div class="address_wrap_header" :class="onlyCancel ? '' : 'address_wrap_header_confirm'">
          <div class="address_wrap_header_close" @click="isOnlyClosePopup">{{!onlyCancel ? '取消' : ''}}</div>
          <div>{{title}}</div>
          <div class="address_wrap_header_close" @click="closePopup">
            <span class="address_wrap_header_close_icon" v-show="onlyCancel"></span>
            <span v-show="!onlyCancel" :class="selectedResult[1].id ? '' : 'address_wrap_header_disable'">确认</span>
          </div>
        </div>
        <div class="address_wrap_tab">
          <div class="address_wrap_tab_header">
            <div
              :class="isTabActiveClass === index ? 'tab-header_active_item' : ''"
              class="tab-header_item"
              v-for="(item, index) in selectedResult"
              :key="index"
              v-show="index !== 3"
              @click="switchTab(index)"
            >{{item.name}}</div>
          </div>
          <div class="address_wrap_tab_content">
            <transition-group :name="animationdirection">
              <div
                v-show="index === activeIndex"
                class="tab-content_item"
                v-for="(item, index) in 4"
                :key="index"
              >
                <div
                  :class="activeIndex === 3 && subItem.id === selectedResult[3].id ? 'tab-content_subitem_active' : ''"
                  class="tab-content_subitem"
                  v-for="(subItem, subIndex) in index === 0 ? addressProvince : addressInfo[index]"
                  :key="subIndex"
                  @click="selectCurrentItem(subItem, index, subItem.name)"
                >{{subItem.name}}</div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
/**
 * @class 省市区街道四级联动popup组件
 * @param {Boolean} isShow 是否显示
 * @param {String} title popup Title
 * @param {Boolean} onlyCancel 是否仅拥有取消操作
*/
import {
  mapState
} from 'vuex'
import {Popup, TransferDom} from 'vux'
import * as API from '@/http/common/api'
// 继承 mixins
import mixinUtils from '@/mixins/common/public.js'

export default {
  name: 'senderInfo',
  mixins: [mixinUtils],
  data () {
    return {
      animationdirection: 'right', // 切换动画方向
      addressInfo: [[],[],[],[]], // 缓存选择列表
      selectedResult: [{name: '请选择'},{name: ''},{name: ''},{name: ''}], // 省市区街道结果
      activeIndex: 0 // 省市区街道选择索引
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '所在地区'
    },
    onlyCancel: {
      type: Boolean,
      default: true
    }
  },
  directives: {
    TransferDom
  },
  computed: {
    isTabActiveClass() {
      return this.activeIndex === 3 ? 2 : this.activeIndex
    },
    ...mapState('openBill', [
      'addressProvince' // 省
    ])
  },
  components: {Popup},
  methods: {
    // 是否关闭popup
    closePopup(is) {
      if (this.onlyCancel) { // 仅存在取消
        this.$emit('update:isShow', false)
        return
      } else { // 存在确认&&取消
        if (!this.selectedResult[1].id) return
        this.$emit('result', this.selectedResult)
        this.$emit('update:isShow', false)
      }
    },
    // 仅仅关闭popup
    isOnlyClosePopup() {
      this.$emit('update:isShow', false)
    },
    // 切换tab
    switchTab(index) {
      // 未选上级，禁止选中下级
      if (!this.selectedResult[index].id) return
      this.activeIndex = index
    },
    // 选择当前省、市、区、街道等
    selectCurrentItem(item, index, name) {
      // 获取 市、区、街道 数据
      this._getSubAddressData(item.id, index, name)
    },
    // 获取 市、区、街道 数据
    _getSubAddressData(id, index, name) {

      // 设置所选内容
      this.selectedResult[index].name = name
      this.selectedResult[index].id = id

      // 当选择街道, 透传结果，隐藏弹窗
      if (this.activeIndex === 3) {
        if (this.selectedResult[3].id) { // 选中街道结果后
          this.$emit('result', this.selectedResult)
          // 隐藏弹层
          this.$emit('update:isShow', false)
          return
        }
      }

      // api
      const task = [
        API.GET_PROVINCE, // 省
        API.GET_CITY, // 市
        API.GET_COUNTY, // 区
        API.GET_STREET // 街道
      ]

      const params = [
        'provinceId',
        'cityId',
        'countyId'
      ]
      this.$http(`${task[index + 1]}?${params[index]}=${id}`, {
        type: 'GET'
      })
        .then(res => {
          // 无数据 return
          if (!res.result) {
            this.$emit('result', this.selectedResult)
            this.$emit('update:isShow', false)
            return
          }
          this.__isSuccess(res, function (result) { // 成功
            if (!result.result) {
              // this.$toast.show('暂无对应数据')
              // 台湾 香港 澳门 等
              this.$emit('result', this.selectedResult)
              this.$emit('update:isShow', false)
              return
            }
            let localData = result.result.map((item) => {
              return Object.assign(item, {
                name: item.cityName || item.countyName || item.streeName,
                id: item.cityId || item.countyId || item.streeId,
              })
            })
            // 选择街道，设置索引
            if (this.activeIndex === 2) {
              localData = localData.map((item) => {
                return Object.assign(item, {
                  isActive: false
                })
              })
            }
            // 重选时，清空tab值
            if (this.activeIndex === 0) {
              this.selectedResult = [{name: ''},{name: ''},{name: ''},{name: ''}]
              // 设置所选内容
              this.selectedResult[index].name = name
              this.selectedResult[index].id = id
            }

            // 动态设置下一级请选择标签
            if (this.selectedResult[this.activeIndex + 1]) {
              this.selectedResult[this.activeIndex + 1].name = '请选择'
            }
            // 设置当前索引
            this.activeIndex = index + 1
            // 设置所选层级列表
            this.addressInfo[this.activeIndex] = localData

          }.bind(this))
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    activeIndex(newIndex, oldIndex) {
      this.animationdirection = newIndex > oldIndex ? 'right' : 'left'
    },
    isShow(isShow) {
      let mask = document.querySelector('.vux-popup-mask')
      mask.addEventListener('touchmove',(e) => {
        if ( isShow ) {
          e.preventDefault();
        }else {
          e.returnValue = true;
        }
      })
    }
  }
}
</script>

<style lang="less" src="./index.less"></style>
