<template>
  <div class="test-fw-btns">
    <fw-button :items="transferItems" @getChecked='getChecked' :checkedIndex="transferCheckedIndex"></fw-button>
    当前选中为&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{transferItems[transferCheckedIndex].name}}
    <!-- <div class="select" @click="showPicker(0)" ref="select0">{{ selectedText[0] }}</div>
    <picker @select="handleSelect(0,arguments)" :selected-index="selectedIndex[0]"
            ref="picker0" :title="title[0]" :cancelTxt="'cancle'"
            :confirmTxt="'ok'">
    </picker> -->
    <tab-swiper :dataSource="dataSource"></tab-swiper>
  </div>
</template>

<script>
import fwButton from '@/components/common/fw-buttons/fw-buttons.vue'
import tabSwiper from '@/components/common/tab-swiper'
// import picker from '@/components/common/datetime'
let data1 = [
    {
      text: '剧毒',
      value: 1
    }, {
      text: '蚂蚁',
      value: 2
    },
    {
      text: '幽鬼',
      value: 3
    },
    {
      text: '主宰',
      value: 4
    },
    {
      text: '卡尔',
      value: 5
    },
    {
      text: '宙斯',
      value: 6
    },
    {
      text: '巫医',
      value: 7
    }, {
      text: '巫妖',
      value: 8
    },
    {
      text: '神谕者',
      value: 9
    },
    {
      text: '撼地神牛',
      value: 10
    },
    {
      text: '蓝胖子',
      value: 11
    },
    {
      text: '水晶室女',
      value: 12
    },
    {
      text: '莉娜',
      value: 13
    },
    {
      text: '斯拉克',
      value: 14
    },
    {
      text: '斯拉达',
      value: 15
    }
  ]
export default {
  data () {
    return {
      transferCheckedIndex: 0,
      transferItems: [
        {
          name: '自提',
          value: 1
        }
        ,
        {
          name: '送货',
          value: 2
        },
        // {
        //   name: '急速',
        //   value: 3
        // },
        // {
        //   name: '超速',
        //   value: 3
        // }
      ],
      dataSource: [
        {
            name: 'hello',
            routerPath: '/testFwBtns/1'
          },
          {
            name: 'openbill',
            routerPath: '/testFwBtns/2'
          },
          {
            name: 'sendinfo',
            routerPath: '/testFwBtns/3'
          }
      ],
      data: [
        [data1]
      ],
      selectedIndex: [
        [0],
      ],
      selectedText: [
        'asdasd'
      ],
      title: [
        'asdasd'
      ],
    }
  },
  components: {
    fwButton,
    tabSwiper
    // ,
    // picker
  },
  methods: {
    getChecked (index) {
      this.transferCheckedIndex = index
    },
    showPicker(index) {
      let picker = this.$refs['picker' + index]
      picker.show()
    },
    handleSelect(index, args) {
      this.selectedText.splice(index, 1, args[2].join('，'))
    }
  }
}
</script>

<style>
.test-fw-btns{
  margin-top: 100px;
  text-align: center;
}
 
</style>
