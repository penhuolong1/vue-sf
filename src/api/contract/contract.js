import axiosConfig from '@/utils/axios.js'
import Qs from 'qs'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 发起联络
export function addGroup(params) {
  return service({
    url: '/court/group/addGroup.jhtml',
    method: 'post',
    data: Qs.stringify(params)
  })
}
// 获取人员树
export function getDeptTree(params) {
  return service({
    url: '/menu/getDeptTree.jhtml',
    method: 'get',
    params
  })
}

// 以下聊天室接口-----------

// 获取聊天室左侧人员列表
export function searchPageGroup(params) {
  return service({
    url: '/court/group/searchPageGroup.jhtml',
    method: 'get',
    params
  })
}

// 获取群组信息
export function selectGroup(params) {
  return service({
    url: '/court/group/selectGroup.jhtml',
    method: 'get',
    params
  })
}
// 群组接收通知结果返回后端
export function agreeAdd(params) {
  return service({
    url: '/court/group/agreeAdd.jhtml',
    method: 'get',
    params
  })
}

// 获取历史记录
export function getHistory(params) {
  return service({
    url: '/court/group/getHistory.jhtml',
    method: 'get',
    params
  })
}
// 记录离开群组时间
export function leave(params) {
  return service({
    url: '/court/group/leave.jhtml',
    method: 'get',
    params
  })
}
// 删除群组
export function deleteGroup(params) {
  return service({
    url: '/court/group/deleteGroup.jhtml',
    method: 'get',
    params
  })
}
// 修改群组
export function editGroup(params) {
  return service({
    url: '/court/group/editGroup.jhtml',
    method: 'post',
    params
  })
}
// 通知加入聊天室
export function sendnotice(params) {
  return service({
    url: '/court/group/sendMessage.jhtml',
    method: 'get',
    params
  })
}
// 获取token
export function getToken(params) {
  return service({
    url: '/court/group/getToken.jhtml',
    method: 'get',
    params
  })
}
// 获取用户信息
export function getUserById(params) {
  return service({
    url: '/court/group/getUserById.jhtml',
    method: 'get',
    params
  })
}
// 判断用户是否有已存在得群组
export function exist(params) {
  return service({
    url: '/court/group/exist.jhtml',
    method: 'get',
    params
  })
}
//
export function initGroup(params) {
  return service({
    url: '/court/group/initGroup.jhtml',
    method: 'get',
    params
  })
}
// 上传聊天文件
export function uploadFile(data) {
  return service({
    url: '/court/group/uploadFile.jhtml',
    method: 'post',
    data
  })
}
// 发起视频存续发起者
export function addGroupRoom(data) {
  return service({
    url: '/court/group/addGroupRoom.jhtml',
    method: 'post',
    data
  })
}

/**
 *视频发起者退出，所有人被踢
 * @param {*} params
 * @param {视频房间号} roomId
 * @param {当前账号} loginId
 *
 */
export function killUser(params) {
  return service({
    url: 'court/group/killUser.jhtml',
    method: 'get',
    params
  })
}
/**
 *离开视频时间记录接口
 * @param {*} params
 * @param {群组id} groupId
 *
 */
export function leaveGroupRoom(params) {
  return service({
    url: 'court/grouproom/leaveGroupRoom.jhtml',
    method: 'get',
    params
  })
}
