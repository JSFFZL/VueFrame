// js handle native funName (js -> native)

// 唤起App登录
export const HANDLELOGIN = 'fwHandleLogin'
// 通知 native 是否显示二维码图标
export const ISSHOWQRCODE = 'isShowQRCode'
// 唤起扫描二维码
export const SCANORCODE = 'scanQRCode'
// 唤起native 搜索
export const TOSEARCH = 'toSearch'
// 通知native 搜索内容
export const ONHISTORYTAGCLICK = 'onHistoryTagClick'
// 通知native 历史时间
export const ONORDERDATALIMIT = 'onOrderDataLimit'
// 通知native 打电话
export const PHONECALL = 'phoneCall'
// 通知native 打印面单
export const PRINT_ORDER = 'fwPrintOrder'
// 唤起native 打印标签
export const PRINT_TAG = 'fwPrintTag'
// 唤起native 打印标签和面单
export const PRINT_TAG_ORDER = 'fwPrintOrderAndTag'
// 主动触发 native 获取用户信息
export const GET_USER_INFO_FROM_NATIVE = 'getUserNative'
// 调取原生刷新
export const RELOAD = 'fwReLoad'
// 调取原生 添加签收图片
export const ADDPHOTO = 'addPhoto'
// 调取原生 预览图片  传索引
export const PREVIEWPHOTO = 'previewPhoto'
// 调取原生 微信被扫
export const WECHATPAY = 'fwWeChatPay'
// 运单详情页是否显示收款
export const FWISSHOWPAYBTN = 'fwIsShowPayBtn'
