import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 获取机构（没过权限）获取所有的关联单位
export function getMediater(params = {}) { // courtType 0是分流中心 ，1是联动单位，3是解纷组织
  // params.courtType = 1
  // params.pageSize = 100
  return service({
    url: '/court/view/getMediater.jhtml',
    method: 'get',
    params
  })
}

// 获取案由
export function brief(params) {
  return service({
    url: '/court/case/getBrief.jhtml',
    method: 'GET',
    params
  })
}

// 获取解纷人员
export function getMediaterUser(params) {
  return service({
    url: '/court/mediateter/getMByCId.jhtml',
    method: 'GET',
    params
  })
}

// 获取机构信息
export function getCourtInfo(params) {
  return service({
    url: '/court/court/getCourtInfo.jhtml',
    method: 'GET',
    params
  })
}

// 根据id获取当前用户信息
export function getAdminInfoById(params) {
  return service({
    url: '/main/getAdminInfoById.jhtml',
    method: 'GET',
    params
  })
}

// 获取智慧研判内容
export function char1(params) {
  return service({
    url: '/court/view/char1.jhtml',
    method: 'post',
    params
  })
}

// 获取机构数据（过权限）获取当前登陆角色下的关联单位
export function getMediater1(params = {}) { // courtType 0是分流中心 ，1是联动单位，3是解纷组织
  params.pageSize = 100
  return service({
    url: '/court/mediateter/getMediater.jhtml',
    method: 'get',
    params
  })
}

// 上传图片
export function uploadImg(params) {
  return service({
    url: '/web/case/uploadImg.jhtml',
    method: 'post',
    isLoad: true,
    data: params
  })
}

// 免登录大屏跳回已登录状态的首页
export function login(params) {
  return service({
    url: '/court/view/login.jhtml',
    method: 'post',
    params
  })
}

/**
 * 文件预览
 * @param {String} url 预览的地址
 */
export function getPreviewUrl(url) {
  return service({
    url: 'https://doc.olcourt.cn/wps/v1/api/file/getViewUrlWebPath?fileUrl=' + url + '&permission=read',
    method: 'get'
  })
}

/**
 * 获取热力图坐标
 * @param {String}  startTime 开始时间
 * @param {String} endTime 结束时间
 */
export function getLocation(url) {
  return service({
    url: '/court/view/getLocation.jhtml',
    method: 'get'
  })
}

/**
 * 上传文件
 * @param {String} url 上传文件接口地址
 * @param {Object} params 上传文件的其他参数
 */
export function upload(url, params) {
  return service({
    url: 'url',
    method: 'post',
    data: params
  })
}

/**
 * 下载文件
 * @param {String} url 下载文件的地址
 */
export function fileDownload(url) {
  window.open('/api/court/group/fileDownload.jhtml?url=' + url)
}

/**
 * 地址转成图片
 * @param {String} url 下载文件的地址
 */
export function getScan(params) {
  return service({
    url: '/menu/getScan.jhtml',
    method: 'post',
    data: params
  })
}
