/**
 * @class API
 * @module [开单,运单管理,签收]
*/

/** 开单模块 start by:kuangmiaolong */
// 省
export const GET_PROVINCE = '/tms-app-web/address/province'
// 市
export const GET_CITY = '/tms-app-web/address/getCityByProvinceId'
// 区
export const GET_COUNTY = '/tms-app-web/address/getCountyByCityId'
// 街道
export const GET_STREET = '/tms-app-web/address/getStreeByCountyId'
// 运单号规则接口 && 费率 (get)
export const GET_WAY_BILL_RULE = '/tms-app-web/waybill/companyConfig/getWayBillConfig'
// 获取数据字段 包含：回单要求 运输方式 配送方式 货物包装 付款方式 (tms-hdyq,tms-ysfs,tms-psfs,tms-bz,tms-fkfs) (get)
export const GET_DICCTIONARIES = '/tms-app-web/dictionary/searchBatch'
// 目的网点 接口 （POST）
export const GET_TARGET_DOT = '/tms-app-web/networkManage/queryNetworkByDisCode'
// 查询目的网点 接口 （POST）
export const SEARCH_TARGET_DOT = '/tms-app-web/networkManage/queryNetworkByDisCodeAndKey'
// 发货人模糊查询  客商档案 (POST)
export const GET_SEND_LIST_INFO = '/tms-app-web/appBossCustomer/getAppInvoiceCustomers'
// 收货人模糊查询  客商档案 (POST)
export const GET_RECEIVE_LIST_INFO = '/tms-app-web/appBossCustomer/getAppReceiptCustomers'
// 计算当前货物运费接口 (POST)
export const GET_ITEM_TOTAL = '/tms-app-web/waybillDeliveryCollect/calculateFreight'
// 校验运单号是否重复 (GET)
export const WAY_BILL_PEPEAT = '/tms-app-web/waybillForApp/checkWaybillCode'
// 货物运输线路接口
export const GET_TRANSPORT_LINE = '/tms-app-web/trunkLine/getBaseLine'
// 开单接口 (POST)
export const OPEN_WAY_BILL = '/tms-app-web/waybillForApp/addWaybill'
// 补录运单接口 (POST)
export const OPEN_WAY_BILL_SUPPLEMENT = '/tms-app-web/waybillForApp/updateForDispatcher'
/** 开单模块 end by:kuangmiaolong */

/** 运单管理模块 start by:wujie */
// 搜索运单
export const GET_WAY_BILL_LIST = '/tms-app-web/waybillForApp/getWayBillListAPP'
// 获取运单详情
export const GET_WAY_BILL_DETAIL = '/tms-app-web/waybillForApp/getAppWaybillInfo'
/** 运单管理模块 end by:wujie */

/** 提货任务模块 start by:kuangmiaolong */
// 待接单 && 待提货 && 历史 （POST）
export const GET_TASK_LIST = '/tms-app-web/ltlOrderDistributeApp/getListWithPage'
// 提货任务订单详情接口 （POST）
export const GET_TASK_DETAILS = '/tms-app-web/ltlOrderDistributeApp/getDetail'
// 订单接单接口 （POST）
export const RECEIPT_BILL = '/tms-app-web/ltlOrderDistributeApp/updateLtlOrderByDriver'
/** 提货任务模块 end by:kuangmiaolong */

/** 签收模块 start by:zhaomenghu */
// 签收记录接口查询【全部签收】【部分签收】【全部拒签】
export const SIGN_RECOURD_LIST = '/tms-app-web/transfer/query/sign/app/getSignRecordList'
// 签收Btn
export const SIGN_DELIVERY_ADD = '/tms-app-web/transfer/deplivery/sign/app/add'
// 取消签收
export const CHANCEL_SIGN = '/tms-app-web/transfer/deplivery/sign/app/cancelSign'
// 未签收【送货签收】列表查询
export const GET_NOTSIGN_LIST = '/tms-app-web/transfer/deplivery/sign/app/getNotSignListInfo'
// 详情
export const GET_SIGN_DETAIL = '/tms-app-web/transfer/deplivery/sign/app/getSignDetail'
// 获取收款结果
export const GET_PAY_RESULT = '/tms-app-web/financeScanCodePayment/queryPayStatusTime'
