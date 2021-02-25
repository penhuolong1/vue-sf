import axiosConfig from '@/utils/axios.js'
import Qs from 'qs'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 法律法规搜索
export const lawSec = (params) => {
    return service({
        url: '/court/lawquery/searchLaw.jhtml',
        method: 'get',
        params
    })
}

//法律详情
export const lawDetail = (params) => {
    return service({
        url: '/court/lawquery/detail.jhtml',
        method: 'get',
        params
    })
}