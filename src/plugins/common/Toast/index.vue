<template>
 <transition :name="fadeIn">
     <div class="toast-wrap" v-show="isShow">
         <transition :name="translate">
             <div class="toast-wrap_content" :class="position" v-show="isShow">
                 <inline-loading v-show="isShowIcon"></inline-loading>
                 <span>{{text}}</span>
             </div>
         </transition>
     </div>
 </transition>
</template>

<script>
/**
 @class props
 *
 @param { Boolean } isShow 是否显示此toast
 *
 @param { String } text 提醒文字
 *
 @param { Number } time 消失时间
 *
 @param { Boolean } isShowIcon 是否显示loading icon
 *
 @param { String } position 提醒容器位置
 *
 @param { Boolean } transition 是否开启动画
 *
*/
import { InlineLoading } from 'vux'

export default {
  name: 'pToast',
  data() {
    return {};
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: "loading"
    },
    time: {
      type: Number,
      default: 2000
    },
    isShowIcon: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: "center"
    },
    transition: {
      type: Boolean,
      default: true
    }
  },
  components: {
    'inline-loading': InlineLoading
  },
  computed: {
    translate() {
      // 根据props，生成相对应的动画
      if (!this.transition) {
        return "";
      } else {
        if (this.position === "top") {
          return "translate-top";
        } else if (this.position === "middle") {
          return "translate-middle";
        } else if (this.position === "bottom") {
          return "translate-bottom";
        }
      }
    },
    fadeIn() {
      // 同上
      if (!this.transition) {
        return "";
      } else {
        return "fadeIn";
      }
    }
  },
  methods: {
    // 控制时间
    timeFun(time) {
      setTimeout(function() {
        this.isShow = false;
      }.bind(this), time)
    }
  },
  watch: {
    isShow(isShow) {
      if (!isShow) return;
      this.timeFun(this.time);
    }
  }
}
</script>

<style lang="less" src="./index.less" scoped></style>
