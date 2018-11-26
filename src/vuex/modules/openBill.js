import mutations from '@/vuex/mutations/index'
import actions from '@/vuex/actions/index'

const openBill = {
  namespaced: true,
  state: {
    addressProvince: [], // 省级地址列表
    targetAddressList: [], // 目的地四级地址结果
    wayBillInfo: { // 运单规则及费率
      coDeliveryFeeRate: '', // 代收货款费率
      companyId: '', // 公司id
      id: '', // 数据id
      insuranceRate: '', // 保价费率
      orderCodeEditable: '', // 是否支持手动录入 （自动编号）
      orderCodeLength: '', // 长度限制 0 || null 不限制 （自动编号）
      orderCodeType: '', // 1:自动编号  2 单据领用 (开单时传反值)
      totalFeeItemList: [] // 可计算费用列表(枚举)
    },
    selectedDot: {}, // 选择的网点
    receiveDeliverData: [ // 发货 && 收货信息 (0：发货 1：收货)
      {idList: [], isMonthly: 1, invoiceCompanyId: '', companyName: '', name: '', phone: null, region: '', region_2: '', address: '', isActive: false, placeholder: '请选择或输入发货人信息'},
      {idList: [], companyName: '', name: '', phone: null, region: '', address: '', region_2: '', isActive: false, placeholder: '请选择或输入收货人信息'},
      {invoiceCompanyId: '', companyName: ''} // 当前选中客商信息
    ],
    moreRequire: { // 更多要求
      isShowCodeAndNumber: false, // 是否显示编号及份数
      checked: [], // 多选结果
      checkList: [ // 多选list
        {name: '开票', id: 0, isShow: false},
        {name: '整车', id: 1, isShow: false},
        {name: '加急', id: 2, isShow: false},
        {name: '入仓', id: 3, isShow: false},
        {name: '卸货', id: 4, isShow: false},
        {name: '上楼', id: 5, isShow: false},
        {name: '报关', id: 6, isShow: false}
      ],
      singleList: [ // 单选list
        {name: '不可倒置', id: 0},
        {name: '轻放', id: 1},
        {name: '易碎', id: 2}
      ],
      singleed: {}, // 单选结果
      singleActiveIndex: null, // 单选索引
      returnRequireed: {itemName: '请选择回单类型'}, // 回单类型结果
      returnCodeed: null, // 回单编号结果
      returnNumbered: 1 // 回单份数结果
    },
    dataDictionaries: { // 数据字典 (回单要求 运输方式 配送方式 货物包装 付款方式)
      hwbz: [], // 货物包装
      hdyq: [], // 回单要求
      ysfs: [], // 运输方式
      psfs: [], // 配送方式
      fkfs: [] // 付款方式
    },
    goodsList: [], // 货物信息列表
    totalList: [], // 每条货物运费列表
    costInfo: { // 费用信息
      base: 0, // 基本运费 (item 运费 相加)
      delivery: 0, // 送货费
      additional: ['', '', '', '', '', '', '', '', '', '', '', ''] // 附加费用列表
    },
  },
  getters: {
    // 货物信息开单页展示
    getGoodListAggregate: (state) => {
      let result = ''
      let goodName = ''
      let number = 0
      let weight = 0
      let volume = 0
      state.goodsList.forEach((item, index) => {
        goodName += item.goodName + '、'
        number += Number.parseFloat(item.number)
        weight += Number.parseFloat(item.weight)
        volume += Number.parseFloat(item.volume)
      })
      goodName = `<div style="width: 30vw; overflow: hidden; text-overflow:ellipsis; white-space: nowrap; color: #333333;">${goodName.substring(0, goodName.length - 1)}</div>`
      result = `${goodName}<div style="max-width: 40vw; overflow: hidden; text-overflow:ellipsis; white-space: nowrap; color: #333333;"">/${number}件/${Number.parseInt(weight)}㎏/${Number.parseInt(volume)}m³</div>`
      return result
    },
    // 计算总费用
    getTotalCost: (state) => {
      let result = []
      let totalNum = 0
      let costEnumeration = [
        {key: 'pickup', id: 52, name: '提货费', value: state.costInfo.additional[0]},
        {key: 'packingcharges', id: 55, name: '包装费', value: state.costInfo.additional[1]},
        {key: 'collectpayment', id: 57, name: '代收货款', value: state.costInfo.additional[2]},
        {key: 'collectpaymentservice', id: 58, name: '代收货款手续费', value: state.costInfo.additional[3]},
        {key: 'declaredvalue', id: 68, name: '声明价值', value: state.costInfo.additional[4]},
        {key: 'insurancefee', id: 59, name: '保价费', value: state.costInfo.additional[5]},
        {key: 'emergencyfee', id: 60, name: '加急费', value: state.costInfo.additional[6]},
        {key: 'informationfee', id: 56, name: '信息费', value: state.costInfo.additional[7]},
        {key: 'freightadvanced', id: 66, name: '垫付运费', value: state.costInfo.additional[8]},
        {key: 'otherfee', id: 70, name: '其他费用', value: state.costInfo.additional[9]},
        {key: 'business', id: 69, name: '业务费', value: state.costInfo.additional[10]},
        {key: 'tax', id: 61, name: '税费', value: state.costInfo.additional[11]},
        {key: 'delivery', id: 53, name: '送货费', value: state.costInfo.delivery},
        {key: 'basicfreight', id: 51, name: '基本运费', value: state.costInfo.base}
      ]
      // 拥有可计算费用列表(枚举)
      if (state.wayBillInfo.totalFeeItemList.length > 0) {
        state.wayBillInfo.totalFeeItemList.forEach((item, index) => {
          costEnumeration.forEach((subItem, subIndex) => {
            if (item.attrCode === subItem.key) {
              result.push(subItem)
            }
          })
        })

        result.forEach((item, index) => {
          if (item.value) {
            totalNum = window.h5Vm.$calc('+', totalNum, Number.parseFloat(item.value))
          }
        })
        return totalNum
      } else {
        return 0
      }
    },
    // 总费用popup列表数据
    getTotalListData: (state) => {
      let result = []
      let costEnumeration = [
        {key: 'pickup', id: 52, name: '提货费', value: state.costInfo.additional[0]},
        {key: 'packingcharges', id: 55, name: '包装费', value: state.costInfo.additional[1]},
        {key: 'collectpayment', id: 57, name: '代收货款', value: state.costInfo.additional[2]},
        {key: 'collectpaymentservice', id: 58, name: '代收货款手续费', value: state.costInfo.additional[3]},
        {key: 'declaredvalue', id: 68, name: '声明价值', value: state.costInfo.additional[4]},
        {key: 'insurancefee', id: 59, name: '保价费', value: state.costInfo.additional[5]},
        {key: 'emergencyfee', id: 60, name: '加急费', value: state.costInfo.additional[6]},
        {key: 'informationfee', id: 56, name: '信息费', value: state.costInfo.additional[7]},
        {key: 'freightadvanced', id: 66, name: '垫付运费', value: state.costInfo.additional[8]},
        {key: 'otherfee', id: 70, name: '其他费用', value: state.costInfo.additional[9]},
        {key: 'business', id: 69, name: '业务费', value: state.costInfo.additional[10]},
        {key: 'tax', id: 61, name: '税费', value: state.costInfo.additional[11]},
        {key: 'delivery', id: 53, name: '送货费', value: state.costInfo.delivery},
        {key: 'basicfreight', id: 51, name: '基本运费', value: state.costInfo.base}
      ]
      // 拥有可计算费用列表(枚举)
      if (state.wayBillInfo.totalFeeItemList.length > 0) {
        state.wayBillInfo.totalFeeItemList.forEach((item, index) => {
          costEnumeration.forEach((subItem, subIndex) => {
            if (item.attrCode === subItem.key) {
              if (subItem.value) {
                result.push({
                  key: subItem.name,
                  value: subItem.value
                })
              }
            }
          })
        })
      } else {
        result = []
      }
      return result
    }
  },
  mutations: mutations(),
  actions: actions()
}

export default openBill
