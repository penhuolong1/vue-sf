import axiosConfig from '@/utils/axios.js'
import Qs from 'qs'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// （诉非）根据多个类型获取机构(作废)
export function listCourtByType(params) {
  return service({
    url: '/court/court/listCourtByType.jhtml',
    method: 'get',
    params
  })
}

// (诉非)队伍管理，查询分流中心/移动单位/调解组织/调解员
export function getCourtInfoByType(params) {
  return service({
    url: '/court/court/getCourtInfoByType.jhtml',
    method: 'get',
    params
  })
}

// 查询a机构的上n级/下n级机构
export function getCourtsByCourtId(params) {
  return service({
    url: '/court/mediateter/getCourtsByCourtId.jhtml',
    method: 'get',
    params
  })
}

// 查询a机构的上n级/下n级机构2
export function listCourtByCourId(params) {
  return service({
    url: '/court/court/listCourtByCourId.jhtml',
    method: 'get',
    params
  })
}

// （诉非）添加机构
export function addCourt(data) {
  return service({
    url: '/court/court/addCourt.jhtml',
    method: 'post',
    data: data
  })
}

// （诉非）编辑机构
export function editCourtInfo(data) {
  return service({
    url: '/court/court/editCourtInfo.jhtml',
    method: 'post',
    data: data
  })
}

// 添加解纷员
export function addMediator(data) {
  return service({
    url: '/court/mediateter/addMediator.jhtml',
    method: 'post',
    data: data
  })
}

// 编辑解纷员
export function editMediator(data) {
  return service({
    url: '/court/mediateter/editMediator.jhtml',
    method: 'post',
    data: data
  })
}

// 解除机构
export function delCourt(data) {
  return service({
    url: '/court/court/delCourt.jhtml',
    method: 'post',
    data
  })
}

// 根据级别查询对应机构
export function getCourtByLevel(params) {
  return service({
    url: '/court/court/getCourtByLevel.jhtml',
    method: 'get',
    params
  })
}

// 根据级别查询对应机构(可以查询调解组织) 参数和上一接口一样（多一个has==1）
export function getCourtByLevel2(params) {
  return service({
    url: '/court/court/getCourtByLevel2.jhtml',
    method: 'get',
    params
  })
}

// 上传单位/解纷组织 文件依据附件
export function uploadFileBasic(params) {
  return service({
    url: '/court/court/uploadFileBasic.jhtml',
    method: 'post',
    isLoad: true,
    data: params
  })
}

// （诉非）上传图片接口
export function uploadImg(params) {
  return service({
    url: '/web/case/uploadImg.jhtml',
    method: 'post',
    isLoad: true,
    data: params
  })
}

/**
 * 删除调解员
 * @param {*} mediaterId 调解员id
 */
export function delMediators(data) {
  return service({
    url: 'court/mediateter/delMediators.jhtml',
    method: 'post',
    data
  })
}

/**
 * 获取机构
 * @param {*} courtId 机构id
 * @param {int} type 0：所有；1：上级；2：下级
 * @param {string} courtType 0 分流中心 1联动单位 2 调解组织 0 或者0,1
 * @param {string} pageSize
 * @param {string} pageNum
 * @param {string} courtLevel 市级/区级/街道级 1/2/3
 * @param {string} dept 机构差距
 */
export function getCourt(params) {
  return service({
    url: '/court/court/getCourtById.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 查询当前角色是否可以修改该机构
 * @param {string} courtId 机构id
 */
export function editAuthority(params) {
  return service({
    url: '/court/court/editAuthority.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 查询调解员的机构
 * @param {string} mediaterId 调解员id
 */
export function listCourtsByMediater(params) {
  return service({
    url: '/court/court/listCourtsByMediater.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 查询当前角色是否有修改调解员的权限
 * @param {string} mediaterId 调解员id
 */
export function medEditAuthority(params) {
  return service({
    url: '/court/mediateter/editAuthority.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 获取联动单位(树形结构的)
 * @param {string} courtName 机构名
 */
export function treeForTeam(params) {
  return service({
    url: '/court/court/treeForTeam.jhtml',
    method: 'GET',
    params
  })
}
