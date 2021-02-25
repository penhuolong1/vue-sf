import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 进入房间
export function intoRoom(params) {
  return service({
    url: '/court/room/intoRoom.jhtml',
    method: 'GET',
    params
  })
}

// 关闭房间
export function closeRoom(params) {
  return service({
    url: '/court/room/closeRoom.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 添加群组
 * @param {String} caseId 案件id
 * @param {String} loginId 登陆者id
 */
export function addChatGroup(params) {
  return service({
    url: '/court/group/addChatGroup.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 离开群组
 * @param {String} caseId 案件id
 * @param {String} loginId 登陆者id
 */
export function leaveGroup(params) {
  return service({
    url: '/court/group/leaveGroup.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 加入群组
 * @param {String} caseId 案件id
 * @param {String} loginId 登陆者id
 */
export function joinGroup(params) {
  return service({
    url: '/court/group/add.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 查询群组信息
 * @param {String} caseId 案件id
 */
export function getChatGroup(params) {
  return service({
    url: '/court/group/getChatGroup.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 查询解纷录像视频
 * @param {String} caseId 案件id
 */
export function listVideo(params) {
  return service({
    url: '/video_record_file/listVideo.jhtml',
    method: 'GET',
    params
  })
}
