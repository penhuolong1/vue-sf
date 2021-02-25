import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 获取token
export function getRoomToken(params) {
  return service({
    url: '/court/room/getRoomToken.jhtml',
    method: 'post',
    data: params
  })
}

// 受邀请方同意/拒绝视频连线
export function beInviteIntoRoom(params) {
  return service({
    url: '/court/room/beInviteIntoRoom.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 诉讼率折线图的接口
 * @param {String}  startTime 年月
 * @param {String}  endTime 年月
 */
export function getLine4(params) {
  return service({
    url: '/court/view/getLine4.jhtml',
    method: 'get',
    params
  })
}

/**
 * 人口基数的接口
 * @param {String}  startTime 年份
 */
export function getLine5(params) {
  return service({
    url: '/court/view/getLine5.jhtml',
    method: 'get',
    params
  })
}

// 在线调解数量 结案数量
export function getMediater(params) {
  return service({
    url: '/court/view/getMediater.jhtml',
    method: 'get',
    params
  })
}
