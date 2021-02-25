import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 添加考评时间
 * @params {String} sStart 自评开始时间
 * @params {String} sEnd 自评结束时间
 * @params {String} rStart 复评开始时间
 * @params {String} rEnd 复评结束时间
 */
export function opTime(params) {
  return service({
    url: '/court/evaluation/opTime.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 当前考评开启状态
 */
export function op() {
  return service({
    url: '/court/evaluation/op.jhtml',
    method: 'get'
  })
}

/**
 * 考评内容（考评内页头部信息）
 * @params {String} type 市/区
 * @params {String} courtId 复评时传，被复评者ID
 */
export function title(params) {
  return service({
    url: '/court/evaluation/title.jhtml',
    method: 'get',
    params
  })
}

/**
 * 考评详情（细则和答题以及文件）
 * @params {String} courtId 法院ID 复评时传输
 * @params {String} id 考评表ID
 */
export function details(params) {
  return service({
    url: '/court/evaluation/details.jhtml',
    method: 'get',
    params
  })
}

/**
 * 上传文件
 */
export function upFile(param) {
  return service({
    url: '/court/evaluation/upFile.jhtml',
    method: 'POST',
    data: param
  })
}

/**
 * 添加考评数据
 * @params {String} type 单位自评/中心复评
 * @params {String} id 考评内容ID
 * @params {String} score 考评分数
 * @params {Array} contents {id 考评细则ID(若没有的细则的情况下不需要传，例如复评),content: 文字内容, files: 文件路径（需先上传服务器）}
 */
export function eva(param) {
  return service({
    url: '/court/evaluation/eva.jhtml',
    method: 'POST',
    data: param
  })
}

/**
 * 考评内容
 * @params {String} type 市/区 只有厦门市诉非中心才可访问两者，其余只能根据自身条件访问
 * @params {String} id 考评时间ID（通过当前考评开启状态接口获取）
 */
export function list(params) {
  return service({
    url: '/court/evaluation/list.jhtml',
    method: 'get',
    params
  })
}

/**
 * 考评单位（考评数据）
 * @params {String} type 市/区
 */
export function evaUnit(params) {
  return service({
    url: '/court/evaluation/evaUnit.jhtml',
    method: 'get',
    params
  })
}
