// js register funNames (native -> js)

// window全局监听用户登录信息，header
export const GET_USER_INFO_CALLBACK = 'getUserInfoCallBack'

// window 全局监听添加货物
export const ADD_GOODS_ITEM = 'addGoodsItem'
// 监听运单搜索传入的信息
export const GETORDERSEARCHINPUT = 'getOrderSearchInput'
// 注册调起筛选时间事件
export const TRIGGERCUSTOMDATE = 'triggerCustomDate'
// 调用上传图片后 回调方法
export const ADDPHOTOCALLBACK = 'addPhotoCallBack'
// 调起运单详情页付款弹窗
export const TRIGGERPAYBTN = 'triggerPayBtn'
// 重新请求接口加载数据，mixins/common/reload.js
export const RELOAD = 'reload'
