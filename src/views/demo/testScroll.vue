
<!--
scroll组件中的属性  

:data="scrollDataList" "是数据数组的盒子"
:pulldown="pulldown"是否开启刷新的开关  
:pullup="pullup" 是否开启加载的开关  
@pulldown="loadData"   是在下拉的时候调用loadData（）函数
@pullup="loadData"是在上拉的时候调用loadData（）函数
-->
<template>
  <div>
    <scroll
      :data="scrollDataList" 
      :pullup="true"
      :pulldown="true"
      @pullup="down"
      @pulldown="ajax"
      >
      <ul class="bg-color" >
        <li v-for="(item, index) in scrollDataList" :key="index">
          {{item}}         
        </li>
      </ul>
      </scroll>
    </div>
</template>

<script>
  import * as API from '@/http/common/api'
  import mixinUtils from '@/mixins/common/public.js'
  import scroll from '@/components/public/fw-scroll' //子组件
  export default {
    name: 'testScroll',
    mixins: [mixinUtils],
    data() {
      return {
        scrollDataList: [],
      }
    },
    components: {
      scroll
    },
    created() {
      this.loadData()
    },
    methods: {
      loadData() {
        //异步得到数据
  
        // this.$http(this.httpurl, {
        //     type: 'POST',
        //     params: {
        //       idList: 123456
        //     }
        //   })
        //   .then(res => {
        //     console.log(res)
        //     this.data = res.data.concat(this.data)
        //     //容错
        //     // this.__isSuccess(res, function(result) {
        //     //   console.log('better-scroll')
        //     // }.bind(this))
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
        
        this.scrollDataList = 100;
        console.log(this.scrollDataList)
      },
      ajax(){
        this.scrollDataList = 80;
        console.log(this.scrollDataList);
      },
      down(){
        this.scrollDataList = 50
        console.log(this.scrollDataList)
      }

    }
  }
</script>
