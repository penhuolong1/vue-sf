import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 案例默认
export const example = (params) => {
  return service({
    url: '/court/lawquery/search.jhtml',
    method: 'get',
    params
  })
}

// 案例搜索
export const exampleSec = (params) => {
  return service({
    url: '/court/lawquery/search.jhtml',
    method: 'get',
    params
  })
}

// 案例详情
export const egDetail = (params) => {
  return service({
    url: '/court/lawquery/detail.jhtml',
    method: 'get',
    params
  })
}
