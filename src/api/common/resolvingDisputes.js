import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 *  获取解纷资源：组织资源数量\解纷人员数量\解纷人员平均年办案数\纠纷数\化解成功率
* @param {String}  startTime 开始时间
*/
export function char2(params) {
  return service({
    url: '/court/view/char2.jhtml',
    method: 'get',
    params
  })
}

/**
 * 获取解纷资源：解纷类型\组织类型\解纷组织排行榜\解纷人员排行榜 的数据
 * @param {String}  startTime 开始时间
 */
export function char4(params) {
  return service({
    url: '/court/view/char4.jhtml',
    method: 'get',
    params
  })
}
