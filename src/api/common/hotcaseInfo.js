import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 获取频发纠纷预警 的数据
 * @param {String}  year 年份
 */
export function getType(params) {
  return service({
    url: '/court/view/getType.jhtml',
    method: 'get',
    params
  })
}
/**
 * 获取收案数 的数据
 * @param {String}  year 年份
 */
export function getLine(params) {
  return service({
    url: '/court/view/getLine.jhtml',
    method: 'get',
    params
  })
}
/**
 * 获取收案数同/环比趋势 的数据
 * @param {String}  year 年份
 */
export function getLine2(params) {
  return service({
    url: '/court/view/getLine2.jhtml',
    method: 'get',
    params
  })
}
/**
 * 获取化解成功率趋势 的数据
 * @param {String}  year 年份
 */
export function getLine3(params) {
  return service({
    url: '/court/view/getLine3.jhtml',
    method: 'get',
    params
  })
}
